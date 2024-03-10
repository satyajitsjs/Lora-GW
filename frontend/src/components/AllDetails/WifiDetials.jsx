import { useEffect, useState } from "react";
import axios from "axios";
import * as AiIcons from "react-icons/ai";
import Loading from "../Common/Loading";
import BaseUrl from "../Common/BaseUrl";

const WifiDetails = () => {
  const [wifiDetails, setWifiDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("user_token");
  const URL = BaseUrl();

  const getWifiDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const NewURL = `${URL}connected_wifi/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };

      const response = await axios.get(NewURL, { headers });
      setWifiDetails(response?.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch Wi-Fi details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWifiDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <span className="flex flex-col">
      <span>
        {loading ? (
          <Loading size="20px"/>
        ) : error ? (
          <span>Error: {error}</span>
        ) : wifiDetails.wifi_names ? (
          <>{wifiDetails.wifi_names} <AiIcons.AiOutlineWifi /></>
        ) : (
          <AiIcons.AiOutlineWifi />
        )}
      </span>
      {wifiDetails.ip_address && (
        <span> IP Address: {wifiDetails.ip_address}</span>
      )}
    </span>
  );
};

export default WifiDetails;
