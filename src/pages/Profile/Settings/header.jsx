import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarNav from "../../pageAssets/sideBarNav.jsx";
import AccountSettings from "./AccountSideBar.jsx";

function Settings() {

    return (
        <>
            {/* <ProfileHeader /> */}
             <SideBarNav />
             <AccountSettings />
            <Outlet />
            </>
    );
}
export default Settings;