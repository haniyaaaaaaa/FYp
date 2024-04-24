import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles.module.css";
import NavbarFarmer from "../NavbarFarmer";
import NavbarAdmin from "../AdminPanel/NavbarAdmin";
import NavbarNormalvictim from "../NavbarNormalvictim";
import PlayButtonIcon from "@mui/icons-material/PlayCircle";
import Slider from "react-slick";
import axios from "axios";

const ThreeDModels = () => {
  const [userRole, setUserRole] = useState("");
  const [models, setModels] = useState([]);

  const url = `http://localhost:5000/api/floodmodels/get-models`;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(url);
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();

    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  var settings = {
    infinite: true,
    dots: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <React.Fragment>
      {userRole === "farmer" ? (
        <NavbarFarmer />
      ) : userRole === "power admin" ? (
        <NavbarAdmin />
      ) : (
        <NavbarNormalvictim />
      )}

      {/* black div */}
      <div
        style={{

          background: 'linear-gradient(to right, #000000, #333333)',
          color: 'white',
          padding: '75px 88px',
          height: '40vh',
        }}
      >
        {/* Heading */}
        <h1 style={{ color: 'rgba(59, 177, 155, 1)', marginLeft: '30px', marginTop: '10px', fontSize: '55px' }}>Flood Resilient Models</h1>

        {/* Description */}
        <div style={{ marginLeft: '30px', marginTop: '20px' }}>
          <p style={{ fontSize: '20px' }}>
            Welcome to our immersive 3D model interface,
            Explore flood-resilient homes with every precise.
          </p>

        </div>

      </div>

      <div className={styles.main_container}>

        {/* image slider */}
        <div className={styles.slider_container}>
          <Slider {...settings}>
            {models.map((model) => (
              <Link
                to={`/detail/${model._id}`}
                state={{
                  data: {
                    url: model.url,
                    title: model.title,
                    desc: model.desc,
                    modelurl: model.modelurl
                  },
                }}
                key={model.id}
                className={styles.link}
              >
                <div className="p-2 relative group hover:translate-y-[-5px] transition-transform rounded ">
                  <img
                    src={model.url}
                    className="h-36 w-11/12 object-cover rounded hover:cursor-pointer"
                  />
                  <p style={{ color: "black" }}>{model.title}</p>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ThreeDModels;
