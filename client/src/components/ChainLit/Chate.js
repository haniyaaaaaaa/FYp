import Footer from "../Footer";
// import NavbarFarmer from "../NavbarFarmer";
// import Accordion from "./ComplaintsAccordion";
import { useState, useEffect } from "react";
import axios from "axios";
// import NavbarNormalvictim from "../NavbarNormalvictim";
import { message } from "antd";
import { Playground } from "./playground";
import { RecoilRoot } from "recoil";
import {
    ChainlitAPI,
    sessionState,
    useChatSession,
} from "@chainlit/react-client";
import { useRecoilValue } from "recoil";

const CHAINLIT_SERVER = "http://localhost:8000";
const userEnv = {};

const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "app");

const Chate = () => {

    const { connect } = useChatSession();
    const session = useRecoilValue(sessionState);
    useEffect(() => {
      if (session?.socket.connected) {
        return;
      }
      fetch(apiClient.buildEndpoint("/custom-auth"))
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          connect({
            client: apiClient,
            userEnv,
            accessToken: `Bearer: ${data.token}`,
          });
        })
        .catch( err => {
          console.log(err)
        });
    }, [connect]);

    return (
        <>
    <Playground/>
        </>
    );
};

export default Chate;