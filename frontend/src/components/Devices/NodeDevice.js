import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserAuth from "../Auth/UserAuth";
import BaseUrl from "../Common/BaseUrl";
import Loading from "../Common/Loading";

const NodeDevice = ({ onAddNode }) => {
  useUserAuth();
  const user_token = localStorage.getItem("user_token");
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);
  const [nodeTypeChoices, setNodeTypeChoices] = useState([]);
  const [newNode, setNewNode] = useState({
    id: "",
    frequency: "",
    node_type: "",
    gateway: "",
  });

  const NewURL = BaseUrl();

  const fetchGateways = async () => {
    const gatewayURL = `${NewURL}gateway-models/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    await axios
      .get(gatewayURL, { headers })
      .then((response) => {
        setGateways(response?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching gateways:", error);
      });
  };

  const fetchNodes = async () => {
    const URL = `${NewURL}nodes/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    await axios
      .get(URL, { headers })
      .then((response) => {
        setNodeTypeChoices(response?.data?.node_type_choices);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching nodes:", error);
        setError("Error fetching nodes");
        setLoading(false);
      });
  };

  const handleAddNodeClick = () => {
    setShowAddNodeForm(true);
  };

  const handleCancelAddNode = () => {
    setShowAddNodeForm(false);
  };

  const handleAddNodeSubmit = async () => {
    const URL = `${NewURL}nodes/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.post(URL, newNode, { headers });
      setShowAddNodeForm(false);
      // Call the callback function after adding a node
      if (onAddNode) {
        onAddNode(response.data);
      }
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  useEffect(() => {
    fetchNodes();
    fetchGateways();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="rounded">
        {loading && <><Loading size="0px"/></>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <>
            <h2 className="text-lg font-semibold mb-4">Nodes</h2>
            <button
              onClick={handleAddNodeClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none mb-4"
            >
              Add New Node
            </button>
            {showAddNodeForm && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Add New Node</h3>
                <form>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      ID:
                    </label>
                    <input
                      type="text"
                      value={newNode.id}
                      onChange={(e) =>
                        setNewNode({ ...newNode, id: e.target.value })
                      }
                      className="mt-1 p-2 border rounded w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Frequency:
                    </label>
                    <input
                      type="text"
                      value={newNode.frequency}
                      onChange={(e) =>
                        setNewNode({ ...newNode, frequency: e.target.value })
                      }
                      className="mt-1 p-2 border rounded w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Node Type:
                    </label>
                    <select
                      name="node_type"
                      value={newNode.node_type}
                      onChange={(e) =>
                        setNewNode({
                          ...newNode,
                          node_type: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 p-2 border rounded w-full"
                    >
                      {nodeTypeChoices.map((option) => (
                        <option key={option[0]} value={option[0]}>
                          {option[1]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gateway:
                    </label>
                    <select
                      name="gateway"
                      value={newNode.gateway}
                      onChange={(e) =>
                        setNewNode({
                          ...newNode,
                          gateway: e.target.value,
                        })
                      }
                      className="mt-1 p-2 border rounded w-full"
                    >
                      <option value="" disabled>
                        Select Gateway
                      </option>
                      {gateways.map((gateway) => (
                        <option key={gateway.id} value={gateway.id}>
                          {gateway.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={handleCancelAddNode}
                      className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNodeSubmit}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                    >
                      Add Node
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NodeDevice;
