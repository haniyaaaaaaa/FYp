import Video from "./Video";
import { useState } from "react";
import embeddedData from "./Data";

export default function Gallery() {
  const [activeVid, setActiveVid] = useState(
    "https://www.youtube.com/embed/NuzyXYBwejQ"
  );
  const [actTitle, setActTitle] = useState(
    "The Great Flood: Investigating One of History's Greatest Myths | Full Documentary"
  );
  const [description, setDescription] = useState(
    "The Great Flood: Investigating One of History's Greatest Myths | Full Documentary"
  );

  const arr = embeddedData;
  return (
    <div>

      <h4 style={{ marginLeft: "15rem", marginTop: "40px", marginBottom: "-10px" }}>Video Library</h4>


      <div className="flex flex-row w-10/12 pt-2">
        <Video link={activeVid} title={actTitle} description={description} />
        <div
          className="w-3/6 shadow-lg shadow-gray-300 
						overflow-y-scroll flex flex-col 
						mt-4 border-slate-100 
						border-2 rounded-lg"
          style={{ height: "min(33vw)" }}
        >
          {arr.map((e, index) => {
            return (
              <div
                key={index}
                className="hover:bg-gray-200 p-2 
									border-2 rounded-sm h-2/6 
									shadow-xl shadow-gray-300"
                onClick={() => {
                  setActiveVid(e.link);
                  setActTitle(e.videoTitle);
                  setDescription(e.videoDescription);
                }}
              >
                <img
                  className="w-1/2 h-20 my-4 
										mx-2 float-left"
                  src={"/assets/image.png"}
                  alt="img"
                />
                <p
                  className="ml-2 font-semibold 
										pt-6 pl-8 text-sm"
                >
                  {e.videoTitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
