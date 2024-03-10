import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../Common/BaseUrl";
import { useMediaQuery } from "react-responsive";
import Loading from "../Common/Loading";

Modal.setAppElement("#root");

const WifiSettings = ({ isOpen, onRequestClose }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: `${isMobile ? "100%" :"450px"}`,
      padding: "20px",
    },
  };
  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const URL = BaseUrl();
  // const URL = "http://192.168.0.148:8000/api/";

  const fetchAvailableNetworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${URL}available_networks/`);
      setAvailableNetworks(response?.data?.wifi_names);
    } catch (error) {
      console.error("Error fetching available networks:", error);
      setError("Error fetching available networks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableNetworks();
    // eslint-disable-next-line
  }, []);

  const connectToNetwork = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!selectedNetwork || !password) {
        console.error("Network name and password are required.");
        return;
      }
      await axios.post(`${URL}connect_wifi/`, {
        ssid: selectedNetwork,
        password: password,
      });

      toast(`Connected to ${selectedNetwork}`);
      onRequestClose();
    } catch (error) {
      console.error("Error connecting to the network:", error);
      setError("Error connecting to the network. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Wi-Fi Settings Modal"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Wi-Fi Settings</h2>
      </div>
      {loading ? (
        <Loading size="30px"/>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul className="list-disc pl-4">
          {availableNetworks.map((network) => (
            <li
              key={network}
              className={`flex items-center justify-between mb-2 cursor-pointer ${
                selectedNetwork === network ? "bg-blue-200" : ""
              }`}
              onClick={() => setSelectedNetwork(network)}
            >
              <span className="mr-2">{network}</span>
              {selectedNetwork === network && (
                <input
                  type="text"
                  placeholder="Enter password"
                  className="border border-gray-300 px-2 py-1 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <button
                onClick={connectToNetwork}
                className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default WifiSettings;
