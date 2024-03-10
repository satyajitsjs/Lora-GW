import React from "react";
import useUserAuth from "../Auth/UserAuth";
import AreaChat from "../Charts/AreaChat";
// import MyComponent from "./MyComponent";
import NodeTable from "../AllDetails/NodeTable";
import NavBar from "../SideBar/NavBar";
import Footer from "../Common/Footer";

const Dashboard = () => {
  useUserAuth();

  return (
    <>
      <NavBar />
      <div className="grid md:grid-cols-2 gap-4 mt-1">
        <div className="md:row-span-1">
          <NodeTable />
        </div>
        <div className="md:row-span-1">
          <AreaChat />
        </div>
      </div>

      {/* <div>
        <MyComponent/>
      </div> */}
      <Footer />
    </>
  );
};

export default Dashboard;
