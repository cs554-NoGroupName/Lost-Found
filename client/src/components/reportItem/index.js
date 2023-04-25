import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import "./styles.css";
import LayoutProvider from "components/common/Layout";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
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

function ReportItem() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <LayoutProvider>
      <Box sx={{ borderBottom: 2, borderColor: "#95B1B0" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="report type"
          indicatorColor="secondary"
        >
          <Tab label="Lost" {...a11yProps(0)} />
          <Tab label="Found" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Lost form
      </TabPanel>
      <TabPanel value={value} index={1}>
        Found form
      </TabPanel>
    </LayoutProvider>
  );
}

export default ReportItem;
