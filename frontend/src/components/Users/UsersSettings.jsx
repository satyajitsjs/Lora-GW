import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserAuth from "../Auth/UserAuth";
import { toast } from "react-toastify";
import BaseUrl from "../Common/BaseUrl";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ChangePasswordModal from "./ChangePassword";
import DeleteModal from "./DeleteModel";
import NavBar from "../SideBar/NavBar";
import Loading from "../Common/Loading";

const UsersSettings = () => {
  useUserAuth();
  const isMobile = useMediaQuery({ query: "(max-width: 756px)" });
  const [isModalOpen, setModalOpen] = useState(false);
  const user_token = localStorage.getItem("user_token");
  const [editMode, setEditMode] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: 0,
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const NewURL = BaseUrl();
  const navigate = useNavigate("");

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to edit user details?"
    );
    if (confirmed) {
      const URL = `${NewURL}users/${userDetails.id}/`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token}`,
      };

      await axios
        .put(URL, userDetails, { headers })
        .then((response) => {
          toast.success("User Update SuccessFully");
          setEditMode(false);
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const UserDetails = async () => {
    const URL = `${NewURL}users/`; // Adjust the endpoint based on your API
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    await axios
      .get(URL, { headers })
      .then((response) => {
        const result = response.data;
        const userData = result[0];
        setUserDetails(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching data");
        setLoading(false);
      });
  };

  const handleDelete = async () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (deviceId) => {
    const URL = `${NewURL}profile/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.post(URL, { id: deviceId }, { headers });
      toast.success(response?.data?.message);
      navigate("/");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response.data.error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleChnagePassword = () => {
    setModalOpen(true);
  };

  const handleConfirmPasswordChange = (gatewayId, newPassword) => {
    const URL = `${NewURL}change-password/`;
    const formData = { "gateway-id": gatewayId, "new-password": newPassword };
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    axios
      .post(URL, formData, { headers })
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
      });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    UserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar activePage="settings"/>
      <br />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
        <div className="p-4 bg-gray-200 rounded shadow-md">
          {loading && <p><Loading size="30px"/></p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <>
              {editMode ? (
                <form className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-2 text-lg font-semibold text-gray-800">
                      Username:
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={userDetails.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-lg font-semibold text-gray-800">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-lg font-semibold text-gray-800">
                      First Name:
                    </label>
                    <input
                      type="first_name"
                      name="first_name"
                      value={userDetails.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 text-lg font-semibold text-gray-800">
                      Last Name:
                    </label>
                    <input
                      type="last_name"
                      name="last_name"
                      value={userDetails.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {/* Add more input fields for other user details */}

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
                <div>
                  <div className="mb-4">
                    <strong className="text-lg font-semibold text-gray-800">
                      Username:
                    </strong>{" "}
                    {userDetails.username}
                  </div>
                  <div className="mb-4">
                    <strong className="text-lg font-semibold text-gray-800">
                      Email:
                    </strong>{" "}
                    {userDetails.email}
                  </div>
                  <div className="mb-4">
                    <strong className="text-lg font-semibold text-gray-800">
                      Name:
                    </strong>{" "}
                    {userDetails.first_name} {userDetails.last_name}
                  </div>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none ml-2"
                  >
                    DELETE
                  </button>
                  <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                  />
                  <button
                    type="button"
                    onClick={handleChnagePassword}
                    className={`bg-zinc-800 text-white px-4 py-2 rounded hover:bg-slate-900 focus:outline-none ${
                      isMobile ? "mt-2 ml-0" : "ml-2"
                    }`}
                  >
                    Change password
                  </button>
                  <ChangePasswordModal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    onConfirm={handleConfirmPasswordChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersSettings;
