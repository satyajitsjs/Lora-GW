import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserAuth from "../Auth/UserAuth";
import { toast } from "react-toastify";
import BaseUrl from "../Common/BaseUrl";
import "./GateWay.css";
import EditGatewayModal from "./EditGatewayModal";
import Loading from "../Common/Loading";

const GatewaySettings = () => {
  useUserAuth();
  const user_token = localStorage.getItem("user_token");
  const [downlinkDetails, setDownlinkDetails] = useState({});
  const [uplinkDetails, setUpLinkDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const NewURL = BaseUrl();

  const fetchGatewayDetails = async () => {
    const URL = `${NewURL}gateway-models/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.get(URL, { headers });
      const result = response?.data?.data;
      const downlinkData = result.find((data) => data.link_type === "DownLink");
      const uplinkData = result.find((data) => data.link_type === "UpLink");
      setDownlinkDetails(downlinkData);
      setUpLinkDetails(uplinkData);
      setLoading(false);
      if (!downlinkData || !uplinkData) {
        setError("Error fetching data");
      }
    } catch (error) {
      console.error(error);
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatewayDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (type) => {
    if (type === "DownLink") {
      setEditedDetails(downlinkDetails);
    } else if (type === "UpLink") {
      setEditedDetails(uplinkDetails);
    }
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    const confirmed = window.confirm("Are you sure you want to Edit Gateway?");
    if (confirmed) {
      const URL = `${NewURL}gateway-models/${editedDetails.id}/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };

      await axios
        .put(URL, editedDetails, { headers })
        .then((response) => {
          toast.success(response?.data?.message);
          setEditMode(false);
          fetchGatewayDetails();
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            const validationErrors = error?.response?.data?.errors;
            Object.keys(validationErrors).forEach((key) => {
              const errorMessages = validationErrors[key];
              errorMessages.forEach((errorMessage) => {
                toast.error(`${key}: ${errorMessage}`);
              });
            });
            fetchGatewayDetails();
          } else {
            console.error("Error updating gateway details:", error);
            fetchGatewayDetails();
          }
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      // Handle radio button changes
      setEditedDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value === "true",
      }));
    } else {
      // Handle other input changes
      setEditedDetails((prevDetails) => ({
        ...prevDetails,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const renderGatewaySettings = (details, type) => {
    return (
      <>
        <div className="mb-4">
          <strong>Name:</strong> {details.name}
        </div>
        <div className="mb-4">
          <strong>IP Address:</strong> {details.ip_address}
        </div>
        <div className="mb-4">
          <strong>Gateway Type:</strong> {details.gateway_type_display}
        </div>
        <div className="mb-4">
          <strong>Frequency:</strong> {details.frequency} MHz
        </div>
        <div className="mb-4">
          <strong>Bandwidth:</strong> {details.bandwidth_display} KHz
        </div>
        <div className="mb-4">
          <strong>SF:</strong> {details.s_f}
        </div>
        <div className="mb-4">
          <strong>Tx Power:</strong> {details.t_x_power}
        </div>
        <div className="mb-4">
          <strong>Rx Gain:</strong> {details.r_x_gain}
        </div>
        <div className="mb-4">
          <strong>Code Rate:</strong> {details.code_rate}
        </div>
        <div className="mb-4">
          <strong>ADR:</strong>{" "}
          {details.a_d_r ? (
            <>
              <span className="dot-green"></span>
              <span className="ml-1">ON</span>
            </>
          ) : (
            <>
              <span className="dot-red"> </span>
              <span className="ml-1">OFF</span>
            </>
          )}
        </div>
        <div className="mb-4">
          <strong>CRC:</strong>{" "}
          {details.c_r_c ? (
            <>
              <span className="dot-green"></span>
              <span className="ml-1">ON</span>
            </>
          ) : (
            <>
              <span className="dot-red"></span>
              <span className="ml-1">OFF</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleEditClick(type)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Edit
        </button>
      </>
    );
  };

  return (
    <>
      {loading && <><Loading size="50px"/></>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Gateway Settings</h2>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-2">DownLink Gateway(Receiving)</h3>
                {renderGatewaySettings(downlinkDetails, "DownLink")}
              </div>
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-2">UpLink Gateway(Sending)</h3>
                {renderGatewaySettings(uplinkDetails, "UpLink")}
              </div>
            </div>
            {editMode && (
              <EditGatewayModal
                gatewayDetails={editedDetails}
                handleInputChange={handleInputChange}
                handleCancelEdit={handleCancelEdit}
                handleSaveClick={handleSaveClick}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default GatewaySettings;
