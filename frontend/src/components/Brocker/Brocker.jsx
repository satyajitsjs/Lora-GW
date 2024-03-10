import React, { useState } from "react";
import useUserAuth from "../Auth/UserAuth";
// import GatewaySettings from "../Settings/GatwaySettings";
// import NodeSettings from "../Settings/NodeSettings";
// import BlockedNode from "../Settings/BlockedNode";
import BrockerSettings from "../Settings/BrockerSettings";
import { useMediaQuery } from "react-responsive";
import NavBar from "../SideBar/NavBar";
import Footer from "../Common/Footer";

const Brocker = () => {
  useUserAuth();
  const [activeSetting, setActiveSetting] = useState("brocker");
  const isMobile = useMediaQuery({ query: "(max-width: 756px)" });

  const handleSettingClick = (setting) => {
    setActiveSetting(setting);
  };

  const settings = [
    // {
    //   key: "gateway",
    //   label: "Gateway Settings",
    //   component: <GatewaySettings />,
    // },
    {
      key: "brocker",
      label: "Brocker Settings",
      component: <BrockerSettings />,
    },
    // { key: "node", label: "Node Settings", component: <NodeSettings /> },
    // { key: "blockedNode", label: "Blocked Node", component: <BlockedNode /> },
  ];

  return (
    <>
      <NavBar activePage="settings" />
      <div
        className={`p-4 h-full w-full ${isMobile ? "m-auto" : ""}`}
        style={{ width: isMobile ? "100%" : "" }}
      >
        <div
          className={`flex ${
            isMobile ? "flex-wrap space-y-1" : "flex-row space-x-4"
          } `}
        >
          {settings.map(({ key, label }) => (
            <div key={key} className={`p-2 ${isMobile ? "w-full" : "w-full ml-32 mr-48"}`}>
              <button
                onClick={() => handleSettingClick(key)}
                className={`block w-full text-left text-blue-500 focus:outline-none rounded-md p-2 bg-gray-100 hover:bg-gray-200 ${
                  activeSetting === key ? "font-bold" : ""
                }`}
              >
                {label}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {settings.map(
            ({ key, component }) => activeSetting === key && component
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Brocker;
