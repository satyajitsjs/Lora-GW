import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserAuth from "../Auth/UserAuth";
import BaseUrl from "../Common/BaseUrl";

const NodeDetails = ({ selectedNode, onNodeSelected }) => {
  useUserAuth();
  const URL = BaseUrl();
  const user_token = localStorage.getItem("user_token");
  const [nodeData, setNodeData] = useState([]);
  const [allNodeData, setAllNodeData] = useState([]);
  const [showAllNodeData, setShowAllNodeData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNodeData = async () => {
    setError(null);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    try {
      const response = await axios.get(`${URL}nodes/data/${selectedNode.id}`, {
        headers,
      });
      setNodeData(response?.data?.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch node data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getAllNodeData = async () => {
    setError(null);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    try {
      const response = await axios.get(`${URL}node/data/`, {
        headers,
      });
      setAllNodeData(response?.data?.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch node data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString();
    return formattedTime;
  };

  const getColorForNodeId = (id) => {
    // Extract numeric value from the MAC address
    const numericValue = parseInt(id.replace(/:/g, ""), 16);

    // Define your colors
    const colors = [
      "bg-blue-200",
      "bg-green-200",
      "bg-yellow-200",
      "bg-pink-200",
      "bg-purple-200",
      "bg-orange-200",
      "bg-red-200",
      "bg-indigo-200",
    ];

    // Use a hashing function to generate a more distributed index
    const hash = (numericValue) => {
      let hashValue = 0;
      for (let i = 0; i < id.length; i++) {
        hashValue = (hashValue << 5) - hashValue + id.charCodeAt(i);
      }
      return hashValue;
    };

    // Use the hashed numeric value to get an index
    const index = Math.abs(hash(numericValue)) % colors.length;

    // Return the color
    return colors[index];
  };

  useEffect(() => {
    const fetchData = () => {
      if (selectedNode) {
        setShowAllNodeData(false);
        getNodeData();
      } else {
        getAllNodeData();
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [selectedNode, showAllNodeData]);

  const getAllNodeDataRefresh = (e) => {
    e.preventDefault();
    getAllNodeData();
    setShowAllNodeData(true);
    onNodeSelected(null);
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-4 h-48">
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          {showAllNodeData ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Node Details</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">ID</th>
                      <th className="py-2 px-4 border">Time</th>
                      <th className="py-2 px-4 border">Counter</th>
                      <th className="py-2 px-4 border">Node Id</th>
                      <th className="py-2 px-4 border">SNR</th>
                      <th className="py-2 px-4 border">RSSI</th>
                      <th className="py-2 px-4 border">CRC</th>
                      <th className="py-2 px-4 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allNodeData.map((node) => (
                      <tr
                        key={node.id}
                        className={`hover:bg-gray-100 transition duration-300 ease-in-out ${getColorForNodeId(
                          node.NodeId
                        )}`}
                      >
                        <td className="py-2 px-4 border">{node.id}</td>
                        <td className="py-2 px-4 border">
                          {formatTime(node.time)}
                        </td>
                        <td className="py-2 px-4 border">{node.counter}</td>
                        <td className="py-2 px-4 border">{node.NodeId}</td>
                        <td className="py-2 px-4 border">{node.s_n_r}</td>
                        <td className="py-2 px-4 border">{node.r_s_s_i}</td>
                        <td
                          className={`py-2 px-4 border ${
                            node.c_r_c ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {node.c_r_c ? "Ok" : "Error"}
                        </td>
                        <td
                          className={`py-2 px-4 border ${
                            node.node_status ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {node.node_status ? "True" : "False"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              {selectedNode ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 flex flex-row justify-between">
                    Node Details of {selectedNode.id}
                    <button onClick={(e) => getAllNodeDataRefresh(e)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </button>
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="py-2 px-4 border">ID</th>
                          <th className="py-2 px-4 border">Time</th>
                          <th className="py-2 px-4 border">Counter</th>
                          <th className="py-2 px-4 border">SNR</th>
                          <th className="py-2 px-4 border">RSSI</th>
                          <th className="py-2 px-4 border">CRC</th>
                          <th className="py-2 px-4 border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodeData.map((anode, index) => (
                          <tr
                            key={anode.id}
                            className={`hover:bg-gray-100 transition duration-300 ease-in-out ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-300"
                            }`}
                          >
                            <td className="py-2 px-4 border">{anode.id}</td>
                            <td className="py-2 px-4 border">
                              {formatTime(anode.time)}
                            </td>
                            <td className="py-2 px-4 border">
                              {anode.counter}
                            </td>
                            <td className="py-2 px-4 border">{anode.s_n_r}</td>
                            <td className="py-2 px-4 border">
                              {anode.r_s_s_i}
                            </td>
                            <td
                              className={`py-2 px-4 border ${
                                anode.c_r_c ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {anode.c_r_c ? "Ok" : "Error"}
                            </td>
                            <td
                              className={`py-2 px-4 border ${
                                anode.node_status
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {anode.node_status ? "True" : "False"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <h1>Data Not Available</h1>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NodeDetails;
