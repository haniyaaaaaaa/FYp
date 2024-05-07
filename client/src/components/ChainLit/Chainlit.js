import Footer from "../Footer";
// import NavbarFarmer from "../NavbarFarmer";
// import Accordion from "./ComplaintsAccordion";
import { useState, useEffect } from "react";
import Chate  from "./Chate";
// import NavbarNormalvictim from "../NavbarNormalvictim";
import { RecoilRoot } from "recoil";

const Chainlit = () => {
    return (
        <RecoilRoot>
            <Chate/>
        </RecoilRoot>
    );
};

export default Chainlit;