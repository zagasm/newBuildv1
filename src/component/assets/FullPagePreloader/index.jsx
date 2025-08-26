

import { useEffect, useState } from "react";
import "./Preloader.css"; // Import styles
import logoMobile from '../../../assets/ZAGASM_LOGO_ICON_V2_350PX.png';
import logo from '../../../assets/zagasm_logo.png';
const FullpagePreloader = ({ loading }) => {
  return (
    <div className={`preloader show ${loading ? "show" : "hide"}`}>
      <img src={logoMobile} style={{width:'70px'}} alt="Zagasm Logo" className="preloader-logo" />
    </div>
  );
};

export default FullpagePreloader;

