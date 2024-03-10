// AttachTopicModal.jsx

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Topic.css";
import BaseUrl from "../Common/BaseUrl";
import axios from "axios";

Modal.setAppElement("#root");

const AttachTopicModal = ({ isOpen, onClose }) => {
  const NewURL = BaseUrl();
  const [publishTopics, setPublishTopics] = useState([]);
  const [nodes, setNodes] = useState([]); // State to store the list of nodes
  const [newNodeId, setNewNodeId] = useState("");
  const [newPublishId, setNewPublishId] = useState("");
  const [selectedPublishTopic, setSelectedPublishTopic] = useState(null);
  const [editNodeId, setEditNodeId] = useState("");
  const [editPublishId, setEditPublishId] = useState("");
  const user_token = localStorage.getItem("user_token");

  const fetchPublishTopicData = async () => {
    const publishTopicsURL = `${NewURL}publish-topics/`;
    const nodesURL = `${NewURL}nodes/`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const [publishTopicsResponse, nodesResponse] = await Promise.all([
        axios.get(publishTopicsURL, { headers }),
        axios.get(nodesURL, { headers }),
      ]);

      setPublishTopics(publishTopicsResponse?.data);
      setNodes(nodesResponse?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddEntry = async () => {
    const URL = `${NewURL}publish-topics/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.post(
        URL,
        {
          node_id: newNodeId,
          publish_id: newPublishId,
        },
        { headers }
      );

      if (response.status === 201) {
        fetchPublishTopicData();
        setNewNodeId("");
        setNewPublishId("");
      } else {
        console.error(
          "Failed to add entry:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to Delete this Topic?"
    );
    if (confirmed) {
      const URL = `${NewURL}publish-topics/${id}/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };

      try {
        const response = await axios.delete(URL, { headers });

        if (response.status === 204) {
          fetchPublishTopicData();
        } else {
          console.error(
            "Failed to delete entry:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleEdit = (publishTopic) => {
    // Set the selectedPublishTopic with the values of the clicked row
    setSelectedPublishTopic({
      id: publishTopic.id,
      node_id: publishTopic.node_id,
      publish_id: publishTopic.publish_id,
    });

    // Set the edit mode state variables
    setEditNodeId(publishTopic.node_id);
    setEditPublishId(publishTopic.publish_id);
  };

  const handleUpdate = async () => {
    const URL = `${NewURL}publish-topics/${selectedPublishTopic.id}/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.put(
        URL,
        {
          node_id: editNodeId,
          publish_id: editPublishId,
        },
        { headers }
      );

      if (response.status === 200) {
        fetchPublishTopicData();
        setSelectedPublishTopic(null);
        setEditNodeId(""); // Reset the edit mode state variables
        setEditPublishId("");
      } else {
        console.error(
          "Failed to update entry:",
          response.status,
          response.statusText
        );

        // Log the error response
        console.error("Error response:", response.data);
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  useEffect(() => {
    fetchPublishTopicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Node Details Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="font-bold">Publish Topics</h2>
      <table className="topic-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>Publish Topic</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {publishTopics.map((topic) => (
            <tr key={topic.id}>
              <td>{topic.node_id}</td>
              <td>{topic.publish_id}</td>
              <td className="flex space-x-2">
                <button
                  className="bg-indigo-700 text-white px-2 py-2 rounded hover:bg-indigo-900 focus:outline-none"
                  onClick={() => handleEdit(topic)}
                >
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-2 rounded hover:bg-red-800 focus:outline-none"
                  onClick={() => handleDelete(topic.id)}
                >
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-entry-form">
        <h3 className="font-bold">
          {selectedPublishTopic ? "Edit Topic" : "Add Topic"}
        </h3>
        <div className="flex flex-row justify-between ml-10">
          <div>
            <label htmlFor="newNodeId" className="font-semibold">
              Node ID:
            </label>
            <select
              id="newNodeId"
              value={selectedPublishTopic ? editNodeId : newNodeId}
              onChange={(e) =>
                selectedPublishTopic
                  ? setEditNodeId(e.target.value)
                  : setNewNodeId(e.target.value)
              }
              className="border border-slate-800"
            >
              <option value="" disabled>
                Select Node Id
              </option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.id}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-10">
            <label htmlFor="newPublishId" className="font-semibold">
              Publish ID:
            </label>
            <input
              type="text"
              id="newPublishId"
              value={selectedPublishTopic ? editPublishId : newPublishId}
              onChange={(e) =>
                selectedPublishTopic
                  ? setEditPublishId(e.target.value)
                  : setNewPublishId(e.target.value)
              }
              className="border border-slate-800"
            />
          </div>
        </div>
        <button onClick={onClose}>Close</button>
        <button onClick={selectedPublishTopic ? handleUpdate : handleAddEntry}>
          {selectedPublishTopic ? "Update Entry" : "Add Entry"}
        </button>
      </div>
    </Modal>
  );
};

export default AttachTopicModal;
