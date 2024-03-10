import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../Common/BaseUrl";
import { toast } from "react-toastify";
import AttachTopicModal from "../Brocker/AddTopicModel";

const BrockerSettings = () => {
  const user_token = localStorage.getItem("user_token");
  const [brockerList, setBrockerList] = useState([]);
  const [newSettings, setNewSettings] = useState({
    id: null,
    ip_address: "",
    port: "",
    username: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [publishTopic, setPublishTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [isPublishModalOpen, setPublishModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishing, setPublishing] = useState(false);
  const [publishTopics, setPublishTopics] = useState([]);

  const URL = BaseUrl();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getBrockerList = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    await axios.get(`${URL}mqtt/`, { headers }).then((response) => {
      setBrockerList(response?.data);
    });
  };

  const fetchPublishTopicData = async () => {
    const publishTopicsURL = `${URL}publish-topics/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const [publishTopicsResponse] = await Promise.all([
        axios.get(publishTopicsURL, { headers }),
      ]);

      setPublishTopics(publishTopicsResponse?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBrocker = async () => {
    const { id, ip_address, port, username, password } = newSettings;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    await axios
      .put(
        `${URL}mqtt/${id}/`,
        { ip_address, port, username, password },
        { headers }
      )
      .then((response) => {
        getBrockerList();
        setEditMode(false);
        setNewSettings({
          id: null,
          ip_address: "",
          port: "",
          username: "",
          password: "",
        });
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.error("Error updating broker:", error);
        toast.error("Error updating broker");
      });
  };

  const handleEditClick = (brocker) => {
    setEditMode(true);
    setNewSettings(brocker);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const openPublishModal = () => {
    fetchPublishTopicData();
    setPublishModalOpen(true);
  };

  const closePublishModal = () => {
    setPublishModalOpen(false);
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };
      const publishURL = `${URL}mqtt/publish/`;
      const payload = {
        topics,
      };
      await axios
        .post(publishURL, payload, { headers })
        .then((response) => {
          toast.success(response?.data?.message);
          closePublishModal();
          getMqttPublish();
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.error);
        });
    } catch (error) {
      console.error("Error publishing data:", error);
      toast.error(error?.response?.data?.error);
    }
  };

  const stopMqttPublish = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    try {
      await axios
        .post(`${URL}mqtt/stop_publish/`, {}, { headers })
        .then((response) => {
          toast.success(response?.data?.message);
          getMqttPublish();
        });
    } catch (error) {
      console.error("Error sending stop command:", error);
    }
  };

  const getMqttPublish = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };
    try {
      await axios
        .get(`${URL}mqtt/get_publish_status/`, { headers })
        .then((response) => {
          setPublishing(response.data.status === "Running");
        });
    } catch (error) {
      console.error("Error sending stop command:", error);
    }
  };

  const addTopic = () => {
    if (publishTopic.trim() !== "") {
      setTopics([...topics, publishTopic.trim()]);
      setPublishTopic("");
    }
  };

  const removeTopic = (index) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  useEffect(() => {
    getBrockerList();
    getMqttPublish();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-semibold mb-4">Broker Settings</h2>
        <div>
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none mb-2 mr-2"
          >
            Attach Topic With Node
          </button>

          {!isPublishing ? (
            <button
              onClick={openPublishModal}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none mb-2"
              disabled={isPublishing}
            >
              {isPublishing ? "Publishing..." : "Publish Data"}
            </button>
          ) : (
            <button
              onClick={stopMqttPublish}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none ml-2"
            >
              Stop Publish
            </button>
          )}
        </div>
      </div>
      <ul>
        {brockerList.map((brocker) => (
          <li key={brocker.id} className="bg-gray-200 p-4 mb-4 rounded shadow">
            {editMode && newSettings.id === brocker.id ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="Password">Brocker</label>

                  <input
                    type="text"
                    placeholder="IP Address"
                    value={newSettings.ip_address}
                    onChange={(e) =>
                      setNewSettings({
                        ...newSettings,
                        ip_address: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="Password">Port</label>

                  <input
                    type="text"
                    placeholder="Port"
                    value={newSettings.port}
                    onChange={(e) =>
                      setNewSettings({ ...newSettings, port: e.target.value })
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="Password">UserName</label>

                  <input
                    type="text"
                    placeholder="Username"
                    value={newSettings.username}
                    onChange={(e) =>
                      setNewSettings({
                        ...newSettings,
                        username: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="Password">Password</label>
                  <input
                    type="text"
                    placeholder="Password"
                    value={newSettings.password}
                    onChange={(e) =>
                      setNewSettings({
                        ...newSettings,
                        password: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={updateBrocker}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <strong> Brocker : </strong>
                  {brocker.ip_address}
                </div>
                <div className="mb-2">
                  <strong> Port : </strong>
                  {brocker.port}
                </div>
                <div className="mb-2">
                  <strong> Username : </strong>
                  {brocker.username}
                </div>
                {/* Display other details as needed */}
                <button
                  onClick={() => handleEditClick(brocker)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-md mx-auto my-6">
            <div className="relative p-6 bg-white shadow-md rounded-md text-gray-800">
              <h2 className="font-bold">Publish Topics</h2>
              <table className="topic-table">
                <thead>
                  <tr>
                    <th>Node</th>
                    <th>Publish Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {publishTopics.map((topic) => (
                    <tr key={topic.id}>
                      <td>{topic.node_id}</td>
                      <td>{topic.publish_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 className="text-lg font-semibold mb-4">Publish Data</h3>
              <div className="mb-4 flex flex-row">
                <label htmlFor="topic">Topic:</label>
                <input
                  type="text"
                  id="topic"
                  placeholder="Enter the topic"
                  value={publishTopic}
                  onChange={(e) => setPublishTopic(e.target.value)}
                  className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none ml-2"
                >
                  Add
                </button>
              </div>
              <div className="mb-4">
                <label>Topics:</label>
                <ul>
                  {topics.map((topic, index) => (
                    <li key={index} className="mb-2">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="ml-2 text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closePublishModal}
                  className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Publish Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <AttachTopicModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default BrockerSettings;
