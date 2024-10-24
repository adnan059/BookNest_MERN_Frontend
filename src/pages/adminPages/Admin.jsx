import "../../assets/styles/adminStyles/admin.css";

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AllUsers from "../../components/adminComponents/AllUsers";
import AllHotels from "../../components/adminComponents/AllHotels";
import AllRooms from "../../components/adminComponents/AllRooms";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ my: 3, px: "1.6rem" }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Admin = () => {
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  const [activeTab, setActiveTab] = React.useState(() => {
    return parseInt(localStorage.getItem("activeTab")) || 0;
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    localStorage.setItem("activeTab", newValue);
  };

  return (
    <Box sx={{ width: "100%" }} className="adminHomeContainer">
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "bisque",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          centered
          indicatorColor="none"
        >
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Hotels" {...a11yProps(1)} />
          <Tab label="Rooms" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={activeTab} index={0}>
        <AllUsers />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={1}>
        <AllHotels />
      </CustomTabPanel>
      <CustomTabPanel value={activeTab} index={2}>
        <AllRooms />
      </CustomTabPanel>
    </Box>
  );
};

export default Admin;

{
  /* <h2>admin</h2>
      <p> users: all users, make admin, delete user </p>
      <p>
        hotels : all hotels, single hotel - [create room, all rooms of the
        hotel, get single room ,update single room,delete single room], create
        hotel, update hotel, delete hotel
      </p> */
}
