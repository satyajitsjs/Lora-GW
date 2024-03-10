import React from "react";
// import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Node",
    path: "/device",
    icon: <AiIcons.AiFillMobile />,
    cName: "nav-text",
  },
  {
    title: "GateWay",
    path: "/settings",
    icon: <IoIcons.IoIosSettings />,
    cName: "nav-text",
  },
  {
    title: "Brocker",
    path: "/brocker",
    icon: <IoIcons.IoIosSettings />,
    cName: "nav-text",
  },
];
