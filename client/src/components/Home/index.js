import React, { useContext, useEffect, useState } from "react";
import lodash from "lodash";
import testData from "./testData.json";
// import axios from "axios";
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
// import { GET_ITEMS_LIST } from "routes";

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

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const Home = () => {
  const [currentUser] = useContext(AuthContext);
  const [itemsData, setItemsData] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterTags, setFilterTags] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState([]);

  const [todayItems, setTodayItems] = useState(false);

  // API Call on load
  useEffect(() => {
    async function fetchData() {
      try {
        // const { data } = await axios.get(
        //   "https://tempapi.proj.me/api/_iq6G8cWO" // TODO: Replace with items data backend call using REACT env variables
        // );
        // setItemsData(data?.data);
        setItemsData(testData);
        updateTodayItems(testData);
        updateLastSevenDaysItems(testData);
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
        const value = item?.tags?.map(tag => tag);
        temp = lodash.uniq([...temp, ...value]);
      }
      return temp;
    };
    const getUniqueCategories = () => {
      let temp = [];

      for (const item of itemsData) {
        temp = lodash.uniq([...temp, item.category]);
      }

      return temp;
    };
    if (itemsData) {
      setTags(getUniqueTags());
      setCategories(getUniqueCategories());
    }
  }, [itemsData]);

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  const updateTodayItems = (data) => {
    const today = new Date();
    const dayToday = today.getDate();
    const monthToday = today.getMonth();
    const yearToday = today.getFullYear();
    const formattedToday = new Date(`${yearToday}-${monthToday}-${dayToday} 0:00:00`);
    // const todayData = data?.data?.filter((item) => new Date(item.reportedDate) > formattedToday);
    const todayData = data?.filter((item) => new Date(item?.reportedDate) > formattedToday);
    console.log("todayData", todayData);
    setTodayItems(todayData ?? []);
  };

  const updateLastSevenDaysItems = (data) => {
    const sevenDaysAgo = new Date(Date.now() - 1000*60*60*24*7);
    const day = sevenDaysAgo.getDate();
    const month = sevenDaysAgo.getMonth();
    const year = sevenDaysAgo.getFullYear();
    const formattedToday = new Date(`${year}-${month}-${day} 0:00:00`);
    // const todayData = data?.data?.filter((item) => new Date(item.reportedDate) > formattedToday);
    const sevenDaysAgoData = data?.filter((item) => new Date(item?.reportedDate) > formattedToday);
    console.log("sevenDaysAgoData", sevenDaysAgoData);
    setLastSevenDays(sevenDaysAgoData ?? []);
  };

  const setStatusOnFilter = (status) => {
    if (status && typeof status == "string" && status.trim().length > 0) {
      setFilterStatus(status);
    }
  };

  const setTypeOnFilter = (type) => {
    if (type && typeof type == "string" && type.trim().length > 0) {
      setFilterType(type);
    }
  };

  const setCategoryOnFilter = (category) => {
    if (category && typeof category == "string" && category.trim().length > 0) {
      setFilterCategory(category);
    }
  };

  const setTagsOnFilter = (tags) => {
    if (tags && Array.isArray(tags) && tags.length > 0) {
      setFilterTags(tags);
    }
  };

  // const filterByField = (field, value) => {
  //   setFilteredData(itemsData.filter(item => item[field] === value));
  // };

  // const filterByTag = (tag) => {
  //   setFilteredData(itemsData.filter(item => item.tags.includes(tag)));
  // };

  const clearFilter = () => {
    setFilteredData(null);
  };

  console.log("TAGS:", tags);

  const cardBuilder = (item) => {
    return (
      <Card key={item?.id} sx={{ maxWidth: 345 }}>
        <CardHeader title={item?.name} subheader={item?.category} />
        <CardMedia
          className="card-media"
          component="img"
          height="200px"
          width="100%"
          image={item?.images?.[0]}
          alt={item?.name}
        />
        <CardContent>
          {item?.type ? <div>Type: {item?.type}</div> : <></>}
          {item?.status ? <div>Status: {item?.status}</div> : <></>}
          {item?.description ? (
            <Typography variant="body2" color="text.secondary">
              {item?.description}
            </Typography>
          ) : (
            <></>
          )}
        </CardContent>
        <CardContent>
          {item?.tags && item?.tags?.length > 0 ? (
            <>{itemTags(item?.tags)}</>
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

  const refetchTestData = () => {
    const filters = {};
    if (filterStatus) {
      filters.status = filterStatus;
    }
    if (filterTags && filterTags.length > 0) {
      filters.tags = tags;
    }
    if (filterCategory) {
      filters.category = filterCategory;
    }
    if (filterType) {
      filters.type = filterType;
    }
    let filteredTestData = testData;
    const filterKeys = Object.keys(filters) ?? [];
    if (filterKeys && filterKeys?.length > 0) {
      for (const key of filterKeys) {
        if (key !== "tags") {
          filteredTestData = filteredTestData?.filter((item) => item[key] === filters[key])
        } else {
          filteredTestData = filteredTestData?.filter((item) => checkExactSubset(item?.keys, filters?.keys))
        }
      }
    }
    setItemsData(filteredTestData);
    updateTodayItems(filteredTestData);
    updateLastSevenDaysItems(filteredTestData);
  };

  const checkExactSubset = (parentArray, childArray) => {
    return childArray?.every((el) => {
        return parentArray?.includes(el)
    });
  };

  // const refetchWithFilters = async () => {
  //   const filters = {};
  //   if (filterStatus) {
  //     filters.status = filterStatus;
  //   }
  //   if (filterTags && filterTags.length > 0) {
  //     filters.tags = tags;
  //   }
  //   if (filterCategory) {
  //     filters.category = filterCategory;
  //   }
  //   if (filterType) {
  //     filters.type = filterType;
  //   }
  //   const data = await axios.get(`${GET_ITEMS_LIST}?`, {
  //     params: filters
  //   });
  //   setItemsData(data);
  //   updateTodayItems(data);
  //   updateLastSevenDaysItems(data);
  // };

  // Modal operations
  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const itemsCard = (data) => {
    return (
      <div className="items-card">
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
      </div>
    );
  };

  const getLastSevenDaysCard = (data) => {
    return (
      <div className="item-row">
        {data?.map((item) => {
          return (
            <>
              {currentUser ? (
                <Link to={`/item/${item?.id}`}>{rowCardBuilder(item)}</Link>
              ) : (
                <span onClick={openModal}>{rowCardBuilder(item)}</span>
              )}
            </>
          );
        })}
      </div>
    );
  };

  const rowCardBuilder = (item) => {
    return (
      <div className="row-wrapper">
        <div className="image-wrapper">
          <img className="row-image" src={item?.images?.[0]} alt={item?.name} />
          {item?.type ? <div className="image-text">{item.type}</div> : <></>}
        </div>
        <div className="row-details">
          <div className="item-name">{item?.name}</div>
          <div className="item-data">
          {item?.type ? <div className="item-type">Type: {item?.type}</div> : <></>}
          {item?.status ? <div className="item-status">Status: {item?.status}</div> : <></>}
          {item?.description ? (
            <div className="item-description">
              {item?.description}
            </div>
          ) : (
            <></>
          )}
          {item?.tags && item?.tags?.length > 0 ? (
            <div className="item-tags">{itemTags(item?.tags)}</div>
          ) : (
            <></>
          )}
          </div>
        </div>
        <div className="row-end">{item?.reportedDate ? (<div className="item-reported-date">{new Date(item.reportedDate).toLocaleDateString(undefined, options)}</div>) : <></>}</div>
      </div>
    );
  };

  return (
    <LayoutProvider>
      <div>
        {/* Items displayed in cards using Material UI Grid */}
        {/* Filter options */}
        {showFilters ? 
        // <div className="flexer">
        <Grid container spacing={0}>
          <Grid item md={3} sm={6} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              value={filterCategory}
              labelId="category-filter-label"
              id="category-filter"
              onChange={(e) => setCategoryOnFilter(e.target.value)}
              label="Status"
            >
              {categories.map((category) => {
                return <MenuItem value={category}>{category}</MenuItem>
              })}
            </Select>
          </FormControl>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              value={filterStatus}
              labelId="status-filter-label"
              id="status-filter"
              onChange={(e) => setStatusOnFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              value={filterType}
              labelId="type-filter-label"
              id="type-filter"
              onChange={(e) => setTypeOnFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="found">Found</MenuItem>
            </Select>
          </FormControl>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }} className="flexer">
            <InputLabel id="tags-filter-label">Tag</InputLabel>
            <Select
              value={filterTags}
              multiple
              labelId="tags-filter-label"
              id="tags-filter"
              onChange={(e) => setTagsOnFilter(e.target.value)}
              label="Tag"
            >
              {tags.map((tag) => {
                return <MenuItem value={tag}>{tag}</MenuItem>
              })}
            </Select>
          </FormControl>
          </Grid>
        {/* </div> */}
        </Grid>
         : <></>}
        <div className="flexer">
          <Button onClick={toggleFilter}>{showFilters ? "Hide Filters" : "Show Filters"}</Button>
          {/* TODO: Replace function refetchTestData with commented out function refetchWithFilters once Backend is ready */}
          {showFilters ? <Button onClick={refetchTestData}>Apply Filters</Button> : <></>} 
          <Button onClick={clearFilter}>Clear Filters</Button>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          {itemsData ? (
            <div>
              Today
              <div className="slider-cards">
                {itemsCard(filteredData ? filteredData : todayItems ? todayItems : itemsData)}
              </div>
            </div>
          ) : (
            <></>
          )}
        </Box>
        <Grid container>
          {lastSevenDays ? (
            <div>
              Last 7 days
              <div className="items-rows">
                {getLastSevenDaysCard(lastSevenDays)}
              </div>
            </div>
          ) : <></>}
        </Grid>

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
