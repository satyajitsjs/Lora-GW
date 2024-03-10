import React, { useState } from 'react';
import Modal from 'react-modal';

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

const DeleteModal = ({ isOpen, onRequestClose, onConfirm }) => {
  const [deviceId, setDeviceId] = useState('');

  const handleConfirm = () => {
    if (deviceId) {
      onConfirm(deviceId);
      setDeviceId('');
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Delete Device Modal"
    >
      <h2 className="text-2xl font-bold mb-4">Delete User</h2>
      <div className="mb-4">
        <label className="block mb-2">
          GateWay ID:
          <input
            className="w-full border rounded px-2 py-1"
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleConfirm}
        >
          Confirm Delete
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

export default DeleteModal;
