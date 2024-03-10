import React from "react";

const EditGatewayModal = ({
  gatewayDetails,
  handleInputChange,
  handleCancelEdit,
  handleSaveClick,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md max-w-lg max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Gateway</h3>
        <form>
          <div className="flex flex-col">
            <strong>Name:</strong>
            <input
              type="text"
              name="name"
              value={gatewayDetails.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <strong>IP Address:</strong>
            <input
              type="text"
              name="ip_address"
              value={gatewayDetails.ip_address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <strong>Gateway Type:</strong>
            <select
              name="Gateway_Type"
              value={gatewayDetails.Gateway_Type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option value="1">X</option>
              <option value="2">Y</option>
              <option value="3">Z</option>
            </select>
          </div>
          <div className="flex flex-col">
            <strong>Frequency:</strong>
            <input
              type="number"
              name="frequency"
              value={gatewayDetails.frequency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <strong>BandWidth:</strong>{" "}
            <select
              name="BandWidth"
              value={gatewayDetails.BandWidth}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option value="1">125KHz</option>
              <option value="2">250KHz</option>
              <option value="3">500KHz</option>
            </select>
          </div>
          <div className="mb-4">
            <strong>SF:</strong>{" "}
            <input
              type="text"
              name="s_f"
              value={gatewayDetails.s_f}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <strong>Tx Power:</strong>{" "}
            <input
              type="text"
              name="t_x_power"
              value={gatewayDetails.t_x_power}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <strong>Rx Gain:</strong>{" "}
            <input
              type="text"
              name="r_x_gain"
              value={gatewayDetails.r_x_gain}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <strong>Code Rate:</strong>{" "}
            <input
              type="text"
              name="code_rate"
              value={gatewayDetails.code_rate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <strong>Payload Length:</strong>{" "}
            <input
              type="text"
              name="payload_length"
              value={gatewayDetails.payload_length}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <strong>ADR:</strong>{" "}
            <label>
              <input
                type="radio"
                name="a_d_r"
                value="true"
                checked={gatewayDetails.a_d_r === true}
                onChange={handleInputChange}
              />
              On
            </label>{" "}
            <label>
              <input
                type="radio"
                name="a_d_r"
                value="false"
                checked={gatewayDetails.a_d_r === false}
                onChange={handleInputChange}
              />
              Off
            </label>
          </div>
          <div className="mb-4">
            <strong>CRC:</strong>{" "}
            <label>
              <input
                type="radio"
                name="c_r_c"
                value="true"
                checked={gatewayDetails.c_r_c === true}
                onChange={handleInputChange}
              />
              On
            </label>{" "}
            <label>
              <input
                type="radio"
                name="c_r_c"
                value="false"
                checked={gatewayDetails.c_r_c === false}
                onChange={handleInputChange}
              />
              Off
            </label>
          </div>
        </form>
        <div className="flex justify-end">
          <button
            onClick={handleCancelEdit}
            className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGatewayModal;
