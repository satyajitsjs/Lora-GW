import React, { useState, useEffect } from "react";
import axios from "axios";
import BaseUrl from "../Common/BaseUrl";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

const BlockedNode = () => {
  const [blockedNodes, setBlockedNodes] = useState([]);
  const user_token = localStorage.getItem("user_token");
  const NewURL = BaseUrl();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const unblockNode = async (node) => {
    const confirmed = window.confirm(
      "Are you sure you want to unblock this node?"
    );
    if (confirmed) {
      const URL = `${NewURL}nodes/${node.id}/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };

      const updatedNode = {
        ...node,
        is_blocked: false,
      };

      await axios
        .put(URL, updatedNode, { headers })
        .then((response) => {
          fetchBlockedNodes();
          toast.success("Unblocked SuccessFully");
        })
        .catch((error) => {
          console.error("Error unblocking node:", error);
        });
    }
  };

  const fetchBlockedNodes = async () => {
    const URL = `${NewURL}block-nodes/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    await axios
      .get(URL, { headers })
      .then((response) => {
        setBlockedNodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching blocked nodes:", error);
      });
  };

  const DeleteNode = (node) => {
    const confirmed = window.confirm(
      "Are you sure you want to Delete this node?"
    );
    if (confirmed) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };
      axios
        .delete(`${NewURL}nodes/${node}/`, { headers })
        .then((response) => {
          fetchBlockedNodes();
          console.log("Node deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    }
  };

  useEffect(() => {
    fetchBlockedNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Blocked Nodes</h2>
      {blockedNodes.length === 0 ? (
        <p>No blocked nodes.</p>
      ) : (
        <>
          {isMobile ? (
            <div className="space-y-6">
              {blockedNodes.map((node, index) => (
                <div
                  key={node.id}
                  className="bg-gray-100 p-6 rounded-md shadow-md"
                >
                  <div className="flex flex-col items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        Node Id: {node.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Frequency: {node.frequency}
                      </p>
                      <p className="text-sm text-gray-600">
                        Gateway: {node.gateway_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Node Type: {node.node_type_display}
                      </p>
                    </div>
                    <div className="flex items-center mt-4 space-x-4">
                      <button
                        onClick={() => unblockNode(node)}
                        className="text-blue-600 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => DeleteNode(node.id)}
                        className="text-red-600 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Node Id
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Frequency
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Gateway
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Node Type
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blockedNodes.map((node, index) => (
                  <tr
                    key={node.id}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="py-3 px-4">{node.id}</td>
                    <td className="py-3 px-4">{node.frequency}</td>
                    <td className="py-3 px-4">{node.gateway_name}</td>
                    <td className="py-3 px-4">{node.node_type_display}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => unblockNode(node)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => DeleteNode(node.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
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
    </div>
  );
};

export default BlockedNode;
