import React, { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [result, setResult] = useState('');

  const callBackendCommand = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/execute-command/');
      setResult(response.data.result);
    } catch (error) {
      console.error('Error calling backend command:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <button onClick={callBackendCommand}>Call Backend Command</button>
      <p>Result from backend: {result}</p>
    </div>
  );
};

export default MyComponent;
