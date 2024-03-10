import React, { useEffect, useState } from "react";
import useUserAuth from "../Auth/UserAuth";
import { useMediaQuery } from "react-responsive";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import BaseUrl from "../Common/BaseUrl";
import axios from "axios";
import "./AreaChat.css";
import GatewayDetails from "../AllDetails/GatewayDetails";

const AreaChat = () => {
  useUserAuth();
  const URL = BaseUrl();
  const user_token = localStorage.getItem("user_token");
  const [device, setDevice] = useState([{ time: "Loading...", size: 0 }]);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 756px)" });

  const getDeviceData = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    };

    try {
      const response = await axios.get(`${URL}device-models/`, { headers });
      let data = response.data.data.map((item) => ({
        ...item,
        time: new Date(item.time).toLocaleTimeString(),
      }));

      if (data.length === 0) {
        data.push({ time: "default", size: 0 });
      }
      const lastDataPoint = data[data.length - 1];
      const topNumber = lastDataPoint.size + 30;
      data = [
        ...data.slice(0, data.length - 1),
        { ...lastDataPoint, size: topNumber },
      ];

      setDevice(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch device data. Please try again later.");
    }
  };

  useEffect(() => {
    getDeviceData();
    const fetchDataInterval = setInterval(() => {
      getDeviceData();
    }, 5000);
    return () => clearInterval(fetchDataInterval);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="md:col-span-1">
        <div className="chat-container border grid md:grid-rows-2 gap-4 mt-1 mr-2">
          <div className="md:row-span-1 mb-4">
            <h1 className="text-red-600 underline text-center font-bold font-sans text-3xl">
              Device Data Visualization
            </h1>
            {error ? (
              <p>Error: {error}</p>
            ) : (
              <ResponsiveContainer
                width="100%"
                aspect={isMobile ? 1 : 3}
                className={"mt-4"}
              >
                <AreaChart
                  data={device}
                  width={isMobile ? 100 : 500}
                  height={isMobile ? 300 : 600}
                  margin={
                    isMobile
                      ? { top: 5, right: 20, left: 0, bottom: 5 }
                      : { top: 5, right: 150, left: 100, bottom: 5 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    interval={"preserveStartEnd"}
                    label={{
                      value: "Time",
                      position: "insideBottom",
                      dy: 5,
                      fill: "blue",
                    }}
                    tick={{ fill: "green" }}
                    axisLine={{ stroke: "red" }}
                    tickLine={{ stroke: "purple" }}
                    height={40}
                  />

                  <YAxis
                    label={{
                      value: "Size",
                      angle: -90,
                      position: "insideLeft",
                      fill: "orange",
                    }}
                    tick={{ fill: "brown" }}
                    axisLine={{ stroke: "yellow" }}
                    tickLine={{ stroke: "cyan" }}
                  />

                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="size"
                    stroke="#8884d8"
                    fill="#8884d8"
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="md:row-span-1">
            <GatewayDetails />
          </div>
        </div>
      </div>
    </>
  );
};

export default AreaChat;
