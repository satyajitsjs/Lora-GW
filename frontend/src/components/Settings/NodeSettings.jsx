import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserAuth from "../Auth/UserAuth";
import { toast } from "react-toastify";
import BaseUrl from "../Common/BaseUrl";
import { useMediaQuery } from "react-responsive";
import NodeDevice from "../Devices/NodeDevice";
import Loading from "../Common/Loading";

const NodeSettings = () => {
  useUserAuth();
  const user_token = localStorage.getItem("user_token");
  const isMobile = useMediaQuery({ query: "(max-width: 756px)" });
  const [editMode, setEditMode] = useState(false);
  const [loraProcess, setLoraProcess] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState({
    id: 0,
    name: "",
    location: "",
    status: "",
  });
  const [statusOptions] = useState([
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ]);
  const NODE_TYPE_CHOICES = [
    [1, "Type 1"],
    [2, "Type 2"],
    [3, "Type 3"],
    [4, "Type 4"],
    [5, "Type 5"],
    // Add more choices if needed
  ];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const NewURL = BaseUrl();

  const handleEditClick = (node) => {
    setSelectedNode(node);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleKickClick = async (node) => {
    const confirmed = window.confirm(
      "Are you sure you want to kick this node?"
    );
    if (confirmed) {
      const URL = `${NewURL}nodes/${node.id}/`; // Use node.id directly
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };

      const updatedNode = {
        ...node, // Use the node parameter directly
        is_blocked: true,
      };

      await axios
        .put(URL, updatedNode, { headers })
        .then((response) => {
          toast.success("Node Blocked From Sending Any Further Data");
          setEditMode(false);
          NodeDetails();
        })
        .catch((error) => {
          console.error("Error updating node status:", error);
        });
    }
  };

  const handleSaveClick = async () => {
    const confirmed = window.confirm("Are you sure you want to Edit Node?");
    if (confirmed) {
      const URL = `${NewURL}nodes/${selectedNode.id}/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };

      await axios
        .put(URL, selectedNode, { headers })
        .then((response) => {
          toast.success("Node Updated SuccessFully");
          setEditMode(false);
          NodeDetails();
        })
        .catch((error) => {
          console.error("Error updating node details:", error);
        });
    }
  };

  const NodeDetails = async () => {
    const URL = `${NewURL}nodes/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    await axios
      .get(URL, { headers })
      .then((response) => {
        const result = response?.data?.data;
        setNodes(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching data");
        setLoading(false);
      });
  };

  const handleAddNode = (addedNode) => {
    NodeDetails();
  };

  const handleConfigure = (node) => {
    const URL = `${NewURL}lora_configuration/${node.id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    axios
      .get(URL, { headers })
      .then((response) => {
        toast.success(response?.data?.message);
        setTimeout(() => {
          toast.success("Lora Configuration SuccessFully");
          NodeDetails();
          getLoraProcess();
        }, 10000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message);
      });
  };

  const handleStartLora = () => {
    const URL = `${NewURL}lora_start_recive/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    axios
      .get(URL, { headers })
      .then((response) => {
        toast.success(response?.data?.message);
        NodeDetails();
        getLoraProcess();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStopLora = () => {
    const URL = `${NewURL}lora_stop_recive/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    axios
      .get(URL, { headers })
      .then((response) => {
        toast.success(response?.data?.message);
        NodeDetails();
        getLoraProcess();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLoraProcess = () => {
    const URL = `${NewURL}get_lora_process/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    axios.get(URL, { headers }).then((response) => {
      setLoraProcess(response.data.data === "active");
    });
  };

  useEffect(() => {
    NodeDetails();
    getLoraProcess();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      {loading && (
        <>
          <Loading size="50px" />
        </>
      )}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          {editMode ? (
            <form className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-2 text-lg font-semibold text-gray-800">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={selectedNode.id}
                  onChange={(e) =>
                    setSelectedNode((prevNode) => ({
                      ...prevNode,
                      id: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-lg font-semibold text-gray-800">
                  Frequency:
                </label>
                <input
                  type="text"
                  name="Frequency"
                  value={selectedNode.frequency}
                  onChange={(e) =>
                    setSelectedNode((prevNode) => ({
                      ...prevNode,
                      frequency: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-lg font-semibold text-gray-800">
                  Node Type:
                </label>
                <select
                  name="node_type"
                  value={selectedNode.node_type}
                  onChange={(e) =>
                    setSelectedNode((prevNode) => ({
                      ...prevNode,
                      node_type: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                >
                  {NODE_TYPE_CHOICES.map((option) => (
                    <option key={option[0]} value={option[0]}>
                      {option[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-lg font-semibold text-gray-800">
                  Status:
                </label>
                <select
                  name="status"
                  value={selectedNode.status}
                  onChange={(e) =>
                    setSelectedNode((prevNode) => ({
                      ...prevNode,
                      status: e.target.value === "true", // Convert the string to a boolean
                    }))
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <div className="flex flex-row">
                <NodeDevice onAddNode={handleAddNode} />
                {loraProcess ? (
                  <button
                    onClick={() => handleStopLora()}
                    className="h-12 w-28 ml-4 text-white px-4 py-2 rounded-md bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 transition-colors duration-300 ease-in-out"
                  >
                    Stop Lora
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartLora()}
                    className={`${
                      isMobile ? "h-20 w-32" : "h-12 w-28"
                    } ml-4 text-white px-4 py-2 rounded-md bg-green-500 border border-green-500 hover:bg-white hover:text-green-500 transition-colors duration-300 ease-in-out`}
                  >
                    Start Lora
                  </button>
                )}
              </div>
              {isMobile ? (
                <div className="space-y-4">
                  {nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`mb-4 ${
                        index % 2 === 0
                          ? "bg-gray-100 p-4 rounded hover:bg-gray-300 "
                          : "bg-white p-6 shadow-md rounded hover:bg-gray-300 "
                      }`}
                    >
                      <strong className="text-lg font-semibold text-gray-800">
                        Node Id:
                      </strong>{" "}
                      {node.id}
                      <br />
                      <strong className="text-lg font-semibold text-gray-800">
                        Frequency:
                      </strong>{" "}
                      {node.frequency}
                      <br />
                      <strong className="text-lg font-semibold text-gray-800">
                        Node Type:
                      </strong>{" "}
                      {node.node_type_display}
                      <br />
                      <strong className="text-lg font-semibold text-gray-800">
                        Status:
                      </strong>{" "}
                      <span
                        className={
                          node.status === true
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {node.status === true ? "Active" : "Inactive"}
                      </span>
                      <br />
                      <strong className="text-lg font-semibold text-gray-800">
                        Gateway:
                      </strong>{" "}
                      {node.gateway_name}
                      <br />
                      <strong className="text-lg font-semibold text-gray-800">
                        Publish Id:
                      </strong>{" "}
                      {node.publish_id ? node.publish_id : "Add The PublishId"}
                      <br />
                      <div className="flex mt-2">
                        <button
                          onClick={() => handleEditClick(node)}
                          className="ml-4 text-indigo-600 hover:text-indigo-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleKickClick(node)}
                          className="ml-4 text-red-600 hover:text-red-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="m6.72 5.66 11.62 11.62A8.25 8.25 0 0 0 6.72 5.66Zm10.56 12.68L5.66 6.72a8.25 8.25 0 0 0 11.62 11.62ZM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Node Id
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Node Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gateway
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Publish Id
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-gray-100">
                    {nodes.map((node, index) => (
                      <tr
                        key={node.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {node.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {node.frequency} Mhz
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {node.node_type_display}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap"
                          style={{
                            color: node.status === true ? "green" : "red",
                          }}
                        >
                          {node.status === true ? "Active" : "Inactive"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {node.gateway_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {node.publish_id
                            ? node.publish_id
                            : "Add The PublishId"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ml-auto">
                          {!loraProcess && (
                            <button
                              onClick={() => handleConfigure(node)}
                              className="h-12 hover:text-cyan-500 px-4 py-2 rounded-md hover:bg-white border border-cyan-500 bg-cyan-500 text-white transition-colors duration-300 ease-in-out"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => handleEditClick(node)}
                            className="ml-4 h-12 hover:text-indigo-900 px-4 py-2 rounded-md hover:bg-white border border-indigo-600 bg-indigo-600 text-white transition-colors duration-300 ease-in-out"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleKickClick(node)}
                            className="ml-4 h-12 hover:text-red-900 px-4 py-2 rounded-md hover:bg-white border border-red-600 bg-red-600 text-white transition-colors duration-300 ease-in-out"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="m6.72 5.66 11.62 11.62A8.25 8.25 0 0 0 6.72 5.66Zm10.56 12.68L5.66 6.72a8.25 8.25 0 0 0 11.62 11.62ZM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NodeSettings;
