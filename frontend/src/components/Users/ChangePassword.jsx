import React, { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root'); 

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '300px', // Adjust the width as needed
    padding: '20px',
  },
};

const ChangePasswordModal = ({ isOpen, onRequestClose, onConfirm }) => {
  const [gatewayId, setGatewayId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleConfirm = () => {
    if (gatewayId && newPassword) {
      onConfirm(gatewayId, newPassword);
      setGatewayId('');
      setNewPassword('');
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Change Password Modal"
    >
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <div className="mb-4">
        <label className="block mb-2">
          Gateway ID:
          <input
            className="w-full border rounded px-2 py-1"
            type="text"
            value={gatewayId}
            onChange={(e) => setGatewayId(e.target.value)}
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          New Password:
          <input
            className="w-full border rounded px-2 py-1"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleConfirm}
        >
          Confirm
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={onRequestClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
