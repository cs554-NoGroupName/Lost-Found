import React, { useContext, useEffect, useState } from "react";
import lodash from "lodash";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "FirebaseUtils/authenticate";
import "./styles.css";

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import LayoutProvider from "components/common/Layout";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const [currentUser] = React.useContext(AuthContext);
  const [itemsData, setItemsData] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // API Call on load
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "https://tempapi.proj.me/api/_iq6G8cWO" // TODO: Replace with items data backend call using REACT env variables
        );
        setItemsData(data?.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Current user:", currentUser)
  }, [currentUser]);

  useEffect(() => {
    const getUniqueTags = () => {
      let temp = [];
  
      for (const item of itemsData) {
        // console.log(item)
        const value = item.tags.map(tag => tag);
        temp = lodash.uniq([...temp, ...value]);
      }
      return temp;
    };
    if (itemsData) {
      setTags(getUniqueTags());
    }
  }, [itemsData]);

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  const filterByField = (field, value) => {
    setFilteredData(itemsData.filter(item => item[field] === value));
  };

  const filterByTag = (tag) => {
    setFilteredData(itemsData.filter(item => item.tags.includes(tag)));
  };

  const clearFilter = () => {
    setFilteredData(null);
  };

  console.log("TAGS:", tags);

  const cardBuilder = (item) => {
    return (
      <Card key={item.id} sx={{ maxWidth: 345 }}>
        <CardHeader title={item.name} subheader={item.category} />
        <CardMedia
          className="card-media"
          component="img"
          height="200px"
          width="100%"
          image={item.images[0]}
          alt={item.name}
        />
        <CardContent>
          {item.type ? <div>Type: {item.type}</div> : <></>}
          {item.status ? <div>Status: {item.status}</div> : <></>}
          {item.description ? (
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          ) : (
            <></>
          )}
        </CardContent>
        <CardContent>
          {item.tags && item.tags.length > 0 ? (
            <>{itemTags(item.tags)}</>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    );
  };

  const itemTags = (tags) => {
    return tags.map((tag) => {
      return (
        <Chip
          variant="outlined"
          style={{ marginRight: "5px", marginBottom: "2px" }}
          label={tag}
        />
      );
    });
  };

  // Modal operations
  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const itemsCard = (data) => {
    return (
      <Grid item display="flex" spacing={4} xs={6}>
        {data.map((item) => {
          return (
            <>
              {currentUser ? (
                <Link to={`/item/${item.id}`}>{cardBuilder(item)}</Link>
              ) : (
                <span onClick={openModal}>{cardBuilder(item)}</span>
              )}
            </>
          );
        })}
      </Grid>
    );
  };

  return (
    <LayoutProvider>
      <div>
        {/* Items displayed in cards using Material UI Grid */}
        {showFilters ? <div>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              onChange={(e) => filterByField("status", e.target.value)}
              label="Status"
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              onChange={(e) => filterByField("type", e.target.value)}
              label="Type"
            >
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="found">Found</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="tags-filter-label">Tag</InputLabel>
            <Select
              labelId="tags-filter-label"
              id="tags-filter"
              onChange={(e) => filterByTag(e.target.value)}
              label="Tag"
            >
              {tags.map((tag) => {
                return <MenuItem value={tag}>{tag}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div> : <></>}
        <div className="flexer">
          <Button onClick={toggleFilter}>{showFilters ? "Hide Filters" : "Show Filters"}</Button>
          <Button onClick={clearFilter}>Clear Filters</Button>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          {itemsData ? (
            <Grid
              spacing={2}
              justify="space-between"
              display="flex"
              direction="row"
              container
            >
              {itemsCard(filteredData ? filteredData : itemsData)}
            </Grid>
          ) : (
            <></>
          )}
        </Box>

        {/* Modal display to ask users to login for item details */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showModal}
          onClose={closeModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={showModal}>
            <Box sx={modalStyle}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Looks like you haven't signed in
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <Link to={`/login`}>Click here</Link> to sign and view this item
                in detail
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>
    </LayoutProvider>
  );
};

export default Home;
