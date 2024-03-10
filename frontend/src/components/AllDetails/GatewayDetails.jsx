import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserAuth from "../Auth/UserAuth";
import BaseUrl from "../Common/BaseUrl";
import { useMediaQuery } from "react-responsive";
import * as AiIcons from "react-icons/ai";
import Loading from "../Common/Loading";
import "./Blinking.css";

const GatewayDetails = () => {
  useUserAuth();
  const user_token = localStorage.getItem("user_token");
  const NewURL = BaseUrl();
  const [gateWays, setGateWays] = useState([]);
  const [system, setSystem] = useState({});
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [wifiDetails, setWifiDetails] = useState({});
  const [selectedOption, setSelectedOption] = useState("DownLink");
  const [LoraMode, setLoraMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWifiDetails = () => {
    const URL = `${NewURL}connected_wifi/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    axios.get(URL, { headers }).then((response) => {
      setWifiDetails(response?.data);
    });
  };

  const fetchGatewayDetails = async (option) => {
    setLoading(true);
    setError(null);
    const URL = `${NewURL}gateway-models/?type=${option}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.get(URL, { headers });
      const result = response?.data?.data;
      setGateWays(result);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const GetLoraMode = () => {
    const URL = `${NewURL}get_lora_mode/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    axios
      .get(URL, { headers })
      .then((response) => {
        setLoraMode(response?.data?.mode);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSystemDetails = () => {
    const URL = `${NewURL}system/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    axios.get(URL, { headers }).then((response) => {
      setSystem(response?.data);
    });
  };

  useEffect(() => {
    GetLoraMode();
    const intervalId = setInterval(() => {
      getSystemDetails();
      GetLoraMode();
    }, 15000);
    fetchGatewayDetails(selectedOption);
    getWifiDetails();
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [selectedOption]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    fetchGatewayDetails(option);
  };

  if (loading) {
    return <Loading size={"40px"} />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-white rounded-md shadow-lg overflow-hidden mt-4 border-4 border-r-8 ml-1 mr-2 mb-2">
      <div className="flex justify-center p-4">
        <button
          className={`mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none ${
            selectedOption === "DownLink" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleOptionChange("DownLink")}
        >
          Downlink
        </button>
        <button
          className={`bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none ${
            selectedOption === "UpLink" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleOptionChange("UpLink")}
        >
          Uplink
        </button>
      </div>
      {gateWays.map((gateway) => (
        <div
          key={gateway.id}
          className="flex p-6 border-b hover:shadow-xl transition duration-300 ease-in-out"
        >
          <div className="w-2/3 pr-8">
            <h1 className="text-2xl font-bold mb-4 text-blue-500">
              {gateway.name}
            </h1>
            <div>
              <strong className="text-lg font-semibold">Gateway Id:</strong>{" "}
              {gateway.gateway}
            </div>
            <div>
              <strong className="text-lg font-semibold">Gateway Type:</strong>{" "}
              {gateway.gateway_type_display}
            </div>
            <div>
              <strong className="text-lg font-semibold">Frequency:</strong>{" "}
              {gateway.frequency}Mhz
            </div>
            <div>
              <strong className="text-lg font-semibold">Bandwidth:</strong>{" "}
              {gateway.bandwidth_display}Khz
            </div>
            <div>
              <strong className="text-lg font-semibold">SF:</strong>{" "}
              {gateway.s_f}
            </div>
            <div>
              <strong className="text-lg font-semibold">Tx Power:</strong>{" "}
              {gateway.t_x_power}
            </div>
            <div>
              <strong className="text-lg font-semibold">Rx Gain:</strong>{" "}
              {gateway.r_x_gain}
            </div>
            <div>
              <strong className="text-lg font-semibold">Code Rate:</strong>{" "}
              {gateway.code_rate}
            </div>
          </div>
          <div className="w-1/3 flex flex-col items-end mt-10 ml-2">
            <div>
              <strong className="text-lg font-semibold">Mode:</strong>{" "}
              <strong
                className={`${
                  LoraMode === "Sleep"
                    ? "text-red-500"
                    : "blinking-text text-orange-500"
                }`}
              >
                {" "}
                {LoraMode}
              </strong>
            </div>
            <div>
              <strong className="text-lg font-semibold">ADR:</strong>{" "}
              {gateway.a_d_r ? (
                <span className="text-green-500">ON</span>
              ) : (
                <span className="text-red-500">OFF</span>
              )}
            </div>
            <div>
              <strong className="text-lg font-semibold">CRC:</strong>{" "}
              {gateway.c_r_c ? (
                <span className="text-green-500">ON</span>
              ) : (
                <span className="text-red-500">OFF</span>
              )}
            </div>

            <div>
              <strong className="text-lg font-semibold">CPU Load:</strong>{" "}
              <span>{system.cpuLoad} %</span>
            </div>
            <div>
              <strong className="text-lg font-semibold">Temparature:</strong>{" "}
              <span>
                {system.cpuTemperature != null ? system.cpuTemperature : "0"}
                &deg;C{" "}
              </span>
            </div>
            <div className="flex flex-row mr-2 ml-2">
              <strong className="text-lg font-semibold">Wifi:</strong>{" "}
              <span className={`flex flex-row${isMobile ? "mt-3" : "mt-1"}`}>
                {wifiDetails.wifi_names ? wifiDetails.wifi_names : "Null"}{" "}
                <AiIcons.AiOutlineWifi />{" "}
              </span>
            </div>
            <div className="flex flex-row mr-2 ml-2">
              <strong className="text-lg font-semibold">IP Address:</strong>{" "}
              <span className={`${isMobile ? "mt-3" : "mt-1"}`}>
                {wifiDetails.ip_address ? wifiDetails.ip_address : "0.0.0.0"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GatewayDetails;
