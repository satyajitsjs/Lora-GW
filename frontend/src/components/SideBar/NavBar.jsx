import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import "./Navbar.css";
import { IconContext } from "react-icons";
import axios from "axios";
import BaseUrl from "../Common/BaseUrl";
import Logout from "../Users/Logout";
import WifiSettings from "../Settings/WifiSettings";
import { useMediaQuery } from "react-responsive";

function NavBar({ activePage }) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [sidebar, setSidebar] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [user, setUser] = useState(false);
  const user_token = localStorage.getItem("user_token");
  const [isWifiSettingsOpen, setWifiSettingsOpen] = useState(false);
  const [wifiDetails, setWifiDetails] = useState({});
  const URL = BaseUrl();
  const navigate = useNavigate();
  const handleLogout = Logout(navigate);

  const UserDetials = async () => {
    if (user_token) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };
      await axios
        .get(`${URL}profile/`, { headers })
        .then((response) => {
          setUser(response?.data?.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          if (error.message === "Network Error") {
            localStorage.removeItem("token_expires_at");
            localStorage.removeItem("user_token");
          }
        });
    }
  };
  const handleClick = () => {
    setWifiSettingsOpen(true);
  };

  // const NewURLs = "http://192.168.0.148:8000/api/";
  const getWifiDetails = () => {
    const NewURL = `${URL}connected_wifi/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    axios.get(NewURL, { headers }).then((response) => {
      setWifiDetails(response?.data);
    });
  };

  useEffect(() => {
    UserDetials();
    getWifiDetails();
    // eslint-disable-next-line
  }, []);

  const handelClose = () => {
    setWifiSettingsOpen(false);
    getWifiDetails();
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const showSidebar = () => setSidebar(!sidebar);



  async function loadAllFunc(){
    const TokenArray =[]
    await axios.get(`${URL}token/`).then((response)=>{
      const result = response?.data?.token
      // eslint-disable-next-line
      result.map((r)=>{TokenArray.push(r["access_token"])})
    })
    if (!TokenArray.includes(user_token)){
      localStorage.removeItem("token_expires_at")
      localStorage.removeItem("user_token")
      window.location.reload()
    }
  }



  useEffect(() => {
    loadAllFunc();
    // eslint-disable-next-line
  }, []); 


  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div
          className={`${activePage !== "settings" ? "navbar" : "nav-setting"}`}
          
        >
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <Link to="#" className="menu-bars mr-5 text-white p-2">
            <div className="flex flex-row items-center user">
              {" "}
              {activePage !== "settings" && (
                <button
                  className={`flex flex-row ml-2 ${
                    isMobile ? "ml-32" : "mr-10"
                  }`}
                  onClick={handleClick}
                >
                  <span className="flex flex-row">
                    {wifiDetails.wifi_names ? wifiDetails.wifi_names : "null"}{" "}
                    <AiIcons.AiOutlineWifi />{" "}
                  </span>
                </button>
              )}
              <div className="flex flex-row">
                <h1 className="mr-2" onClick={togglePopup}>
                  {user.first_name}
                </h1>
                <div className="mr-2 mt-2" onClick={togglePopup}>
                  <FaIcons.FaRegUserCircle />
                </div>
              </div>
            </div>
          </Link>

          {activePage !== "settings" && isWifiSettingsOpen && (
            <WifiSettings
              isOpen={isWifiSettingsOpen}
              onRequestClose={() => handelClose()}
            />
          )}

          {isPopupVisible && (
            <div className="absolute top-12 right-0 bg-white p-4 shadow-md rounded-md text-gray-800 mr-2 mt-2">
              <div className="mb-4">
                <Link to={"/usersetiings"} className="text-lg font-bold">
                  User Details
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-red"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavBar;
