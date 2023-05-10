import React, { useEffect, useState } from "react";
import lodash from "lodash";
// import testData from "./testData.json";
import { Link } from "react-router-dom";
import LayoutProvider from "components/common/Layout";
import useDocumentTitle from "components/common/useDocumentTitle";
import LoadingText from "components/common/loadingText";
import { styled } from '@mui/material/styles';

import "./styles.css";

import {
  Backdrop,
  Box,
  Button,
  Chip,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SwipeableDrawer,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Global } from "@emotion/react";

import Search from "./Search";
import { makeApiCall } from "utils/apis/api";

import { Clear, FilterAlt, FilterAltOff, FilterList, FilterListOff } from "@mui/icons-material";
import ItemCard from "components/myActivities/card";

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

const container = window !== undefined ? () => window.document.body : undefined;

const drawerBleeding = 56;

const drawerBleedingDiff = 44;

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const Home = () => {
  const currentUser = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterTags, setFilterTags] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const [todayItems, setTodayItems] = useState([]);

  const theme = useTheme();

  // API Call on load
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await makeApiCall(
          `/items` // TODO: Replace with items data backend call using REACT env variables
        );
        console.log("data:", data);
        const dataWithTags = arrayfyTags(data?.data);
        setItemsData(dataWithTags?.beyond);
        setTodayItems(dataWithTags?.today);
        setLastSevenDays(dataWithTags?.week);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await makeApiCall(
          `/items?itemName=${searchTerm}`
        );
        console.log("search data:", data);
        const dataWithTags = arrayfyTags(data?.data);
        setItemsData(dataWithTags?.beyond ?? []);
        setTodayItems(dataWithTags?.today ?? []);
        setLastSevenDays(dataWithTags?.week ?? []);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
      setAppliedFilters(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    console.log("Current user:", currentUser)
  }, [currentUser]);

  const arrayfyTags = (data) => {
    const today = data?.today ?? [];
    const week = data?.week ?? [];
    const beyond = data?.beyond ?? [];
    today.forEach((item) => {
      let itemTag = item?.tags?.split(",");
      let empty = [];
      itemTag.forEach((tag) => {
        empty.push(tag.trim());
      })
      item.tags = empty;
    });
    week.forEach((item) => {
      let itemTag = item?.tags?.split(",");
      let empty = [];
      itemTag.forEach((tag) => {
        empty.push(tag.trim());
      })
      item.tags = empty;
    });
    beyond.forEach((item) => {
      let itemTag = item?.tags?.split(",");
      let empty = [];
      itemTag.forEach((tag) => {
        empty.push(tag.trim());
      })
      item.tags = empty;
    });
    return {
      today: today,
      week: week,
      beyond: beyond
    };
  };

  useEffect(() => {
    const getUniqueTags = () => {
      let temp = [];

      const totalData = [...itemsData, ...todayItems, ...lastSevenDays];

      for (const item of totalData) {
        // console.log(item)
        const value = item?.tags?.map(tag => tag);
        temp = lodash.uniq([...temp, ...value]);
      }
      console.log("tags array:", temp);
      return temp;
    };
    const getUniqueCategories = () => {
      let temp = [];
      const totalData = [...itemsData, ...todayItems, ...lastSevenDays];

      for (const item of totalData) {
        temp = lodash.uniq([...temp, item.category]);
      }

      return temp;
    };
    if ((todayItems || lastSevenDays || itemsData) && (todayItems.length > 0 || lastSevenDays.length > 0 || itemsData.length > 0)) {
      setTags(getUniqueTags());
      setCategories(getUniqueCategories());
    }
  }, [itemsData, todayItems, lastSevenDays]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  // const updateTodayItems = (data) => {
  //   const today = new Date();
  //   const dayToday = today.getDate();
  //   const monthToday = today.getMonth();
  //   const yearToday = today.getFullYear();
  //   const formattedToday = new Date(`${yearToday}-${monthToday}-${dayToday} 0:00:00`);
  //   // const todayData = data?.data?.filter((item) => new Date(item.reportedDate) > formattedToday);
  //   const todayData = data?.filter((item) => new Date(item?.lastSeenDate) > formattedToday);
  //   console.log("todayData", todayData);
  //   setTodayItems(todayData ?? []);
  // };

  // const updateLastSevenDaysItems = (data) => {
  //   const sevenDaysAgo = new Date(Date.now() - 1000*60*60*24*7);
  //   const day = sevenDaysAgo.getDate();
  //   const month = sevenDaysAgo.getMonth();
  //   const year = sevenDaysAgo.getFullYear();
  //   const formattedToday = new Date(`${year}-${month}-${day} 0:00:00`);
  //   // const todayData = data?.data?.filter((item) => new Date(item.reportedDate) > formattedToday);
  //   const sevenDaysAgoData = data?.filter((item) => new Date(item?.lastSeenDate) > formattedToday);
  //   console.log("sevenDaysAgoData", sevenDaysAgoData);
  //   setLastSevenDays(sevenDaysAgoData ?? []);
  // };

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
  //   setSearchTerm(itemsData.filter(item => item[field] === value));
  // };

  // const filterByTag = (tag) => {
  //   setSearchTerm(itemsData.filter(item => item.tags.includes(tag)));
  // };

  const clearFilter = () => {
    setFilterCategory(null);
    setFilterTags([]);
    setFilterStatus(null);
    setFilterType(null);
    setAppliedFilters(null);
    refetchWithFilters(false);
  };

  console.log("TAGS:", tags);

  const cardBuilder = (item) => {
    return <ItemCard item={item} />
    // return (
    //   <Card key={item?._id} sx={{ maxWidth: 325, margin: "10px" }}>
    //     <CardHeader title={item?.itemName} subheader={item?.category} subheaderTypographyProps={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}} sx={{ color: theme.palette.primary.contrastText,
    //       backgroundColor: theme.palette.primary.main}} />
    //     <CardMedia
    //       // className="card-media"
    //       component="img"
    //       height="200px"
    //       width="100%"
    //       sx={{
    //         objectFit: "contain",
    //         width: "300px",
    //         height: "300px"
    //       }}
    //       image={item?.imageUrl ?? noImage}
    //       alt={item?.itemName}
    //     />
    //     <CardContent sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}>
    //       {item?.lastSeenDate ? (<div className="item-reported-date">{new Date(item.lastSeenDate).toLocaleDateString(undefined, options)}</div>) : <></>}
    //       {item?.type ? <div>Type: {item?.type}</div> : <></>}
    //       {item?.itemStatus ? <div>Status: {item?.itemStatus}</div> : <></>}
    //       {item?.description ? (
    //         <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}>
    //           {item?.description}
    //         </Typography>
    //       ) : (
    //         <></>
    //       )}
    //     </CardContent>
    //     <CardContent sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}>
    //       {item?.tags && item?.tags?.length > 0 ? (
    //         <>{itemTags(item?.tags)}</>
    //       ) : (
    //         <></>
    //       )}
    //     </CardContent>
    //   </Card>
    // );
  };

  // const itemTags = (tags) => {
  //   return tags?.map((tag) => {
  //     return (
  //       <Chip
  //         variant="outlined"
  //         style={{ marginRight: "5px", marginBottom: "2px" }}
  //         label={tag}
  //         sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}
  //       />
  //     );
  //   });
  // };

  // const refetchTestData = () => {
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
  //   let filteredTestData = testData;
  //   const filterKeys = Object.keys(filters) ?? [];
  //   if (filterKeys && filterKeys?.length > 0) {
  //     for (const key of filterKeys) {
  //       if (key !== "tags") {
  //         filteredTestData = filteredTestData?.filter((item) => item[key] === filters[key])
  //       } else {
  //         filteredTestData = filteredTestData?.filter((item) => checkExactSubset(item?.keys, filters?.keys))
  //       }
  //     }
  //   }
  //   setItemsData(filteredTestData);
  //   updateTodayItems(filteredTestData);
  //   updateLastSevenDaysItems(filteredTestData);
  // };

  // const checkExactSubset = (parentArray, childArray) => {
  //   return childArray?.every((el) => {
  //       return parentArray?.includes(el)
  //   });
  // };

  const refetchWithFilters = async (filterBool = true) => {
    let filters = "";
    let filterObj = {};
    if (filterStatus) {
      filters = filters + `&itemStatus=${filterStatus}`;
      filterObj.status = filterStatus;
    }
    if (filterTags && filterTags.length > 0) {
      filters = filters + `&tags=${filterTags.toString()}`;
      filterObj.tags = filterTags.toString();
    }
    if (filterCategory) {
      filters = filters + `&category=${filterCategory}`;
      filterObj.category = filterCategory;
    }
    if (filterType) {
      filters = filters + `&type=${filterType}`;
      filterObj.type = filterType;
    }
    const { data } = await makeApiCall(`/items?${filterBool ? filters : ""}`);
    console.log("filtered data:", data);
    const dataWithTags = arrayfyTags(data?.data);
    setItemsData(dataWithTags?.beyond ?? []);
    setTodayItems(dataWithTags?.today ?? []);
    setLastSevenDays(dataWithTags?.week ?? []);
    setAppliedFilters(filterBool ? filterObj : null);
  };

  // Modal operations
  // const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const itemsCard = (data) => {
    return (
      <div className="items-card">
        {data?.map((item) => {
          return  cardBuilder(item)
            // <div>
            //   {currentUser ? (
            //     <Link to={`/item/${item?._id}`}>{cardBuilder(item)}</Link>
            //   ) : (
            //     <span onClick={openModal}>{cardBuilder(item)}</span>
            //   )}
            // </div>


        })}
      </div>
    );
  };

  const itemsCardAlt = (data) => {
    return (
      <Grid container spacing={4}>
        {data?.map((item) => {
          return (
            <Grid item lg={4} md={6} sm={12} xs={12}>
              {/* {currentUser ? ( */}
                {/* <Link to={`/item/${item?._id}`}>{cardBuilder(item)}</Link> */}
              {/* ) : ( */}
                {/* <span onClick={openModal}>{cardBuilder(item)}</span> */}
              {/* )} */}
              {cardBuilder(item)}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // const getLastSevenDaysCard = (data) => {
  //   return (
  //     <div className="item-row">
  //       {data?.map((item) => {
  //         return (
  //           <>
  //             {currentUser ? (
  //               <Link to={`/item/${item?._id}`}>{rowCardBuilder(item)}</Link>
  //             ) : (
  //               <span onClick={openModal}>{rowCardBuilder(item)}</span>
  //             )}
  //           </>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  // const rowCardBuilder = (item) => {
  //   return (
  //     <div className="row-wrapper">
  //       <div className="image-wrapper">
  //         <img className="row-image" src={item?.imageUrl ?? noImage} alt={item?.itemName} />
  //         {item?.type ? <div className="image-text">{item.type}</div> : <></>}
  //       </div>
  //       <div className="row-details">
  //         <div className="item-name">{item?.itemName}</div>
  //         <div className="item-data">
  //         {item?.type ? <div className="item-type">Type: {item?.type}</div> : <></>}
  //         {item?.itemStatus ? <div className="item-status">Status: {item?.itemStatus}</div> : <></>}
  //         {item?.description ? (
  //           <div className="item-description">
  //             {item?.description}
  //           </div>
  //         ) : (
  //           <></>
  //         )}
  //         {item?.tags && item?.tags?.length > 0 ? (
  //           <div className="item-tags">{itemTags(item?.tags)}</div>
  //         ) : (
  //           <></>
  //         )}
  //         </div>
  //       </div>
  //       <div className="row-end">{item?.lastSeenDate ? (<div className="item-reported-date">{new Date(item.lastSeenDate).toLocaleDateString(undefined, options)}</div>) : <></>}</div>
  //     </div>
  //   );
  // };

  return (
    <LayoutProvider>
      {useDocumentTitle("Home")}
      <div>{loading ? <LoadingText /> :(
        <div>
        {/* Items displayed in cards using Material UI Grid */}
        {/* Filter options */}
        {/* {showFilters ?
        <Grid container spacing={0}>
          <Grid item md={3} sm={6} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
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
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              value={filterStatus}
              labelId="status-filter-label"
              id="status-filter"
              onChange={(e) => setStatusOnFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Claimed</MenuItem>
            </Select>
          </FormControl>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
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
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
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
        </Grid>
         : <></>} */}
        <div className="flexer-even">
          <Search searchValue={searchValue} searchType="Events" />
          <Button sx={{ backgroundColor: theme.palette.yellowButton, margin: "10px", border: "1px solid black" }} onClick={() => setSearchTerm(" ")}><Clear />Clear Search</Button>
          <button className="btn_default" onClick={toggleFilter}>{showFilters ? <div><FilterListOff />Hide</div> : <div><FilterList />Filters</div>}</button>
          {/* {showFilters ? <Button onClick={refetchTestData}>Apply Filters</Button> : <></>}
          <Button onClick={clearFilter}>Clear Filters</Button> */}
        </div>
        {appliedFilters ? <div>
          {appliedFilters?.status ? <Chip
            variant="outlined"
            style={{ marginRight: "5px", marginBottom: "2px" }}
            label={`Status: ${appliedFilters.status}`}
            sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}
          /> : <></>}
          {appliedFilters?.type ? <Chip
            variant="outlined"
            style={{ marginRight: "5px", marginBottom: "2px" }}
            label={`Type: ${appliedFilters.type}`}
            sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}
          /> : <></>}
          {appliedFilters?.category ? <Chip
            variant="outlined"
            style={{ marginRight: "5px", marginBottom: "2px" }}
            label={`Category: ${appliedFilters.category}`}
            sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}
          /> : <></>}
          {appliedFilters?.tags ? <Chip
            variant="outlined"
            style={{ marginRight: "5px", marginBottom: "2px" }}
            label={`Tags: ${appliedFilters.tags}`}
            sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}
        /> : <></>}
        </div> : <></>}
        <Box sx={{ flexGrow: 1 }}>
          <div style={{ margin: "10px" }} className="label-text">Today</div>
          {todayItems && todayItems?.length > 0 ? (
            <div>
              <div className="slider-cards" style={{ display: "flex", gap: "10px" }}>
                {itemsCard(todayItems)}
              </div>
            </div>
          ) : (
            <div style={{ margin: "10px" }}>No data</div>
          )}
        </Box>
        <div style={{ margin: "10px" }} className="label-text">Last 7 days</div>
        <div>
          {lastSevenDays && lastSevenDays?.length > 0 ? (
            // <div>
            //   <div className="items-rows">
            //     {getLastSevenDaysCard(lastSevenDays)}
            //   </div>
            // </div>
            <div>
              {itemsCardAlt(lastSevenDays)}
            </div>
          ) : <div style={{margin: "10px"}}>No data</div>}
        </div>
        <div style={{ margin: "10px" }} className="label-text">More than 7 days ago</div>
        <div>
          {itemsData && itemsData?.length > 0 ? (
            <div>
              {itemsCardAlt(itemsData)}
            </div>
          ) : <div style={{ margin: "10px" }}>No data</div>}
        </div>

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
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              // height: `calc(50% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}
        />
        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={showFilters}
          onClose={() => setShowFilters(false)}
          onOpen={() => setShowFilters(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleedingDiff,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary', padding: "10px" }}>Filters</Typography>
        </StyledBox>
        {/* <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Skeleton variant="rectangular" height="100%" />
        </StyledBox> */}
        <Grid container spacing={0}>
          <Grid item md={3} sm={12} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
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
          <Grid item md={3} sm={12} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              value={filterStatus}
              labelId="status-filter-label"
              id="status-filter"
              onChange={(e) => setStatusOnFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="reported">Reported</MenuItem>
              <MenuItem value="claimed">Claimed</MenuItem>
            </Select>
          </FormControl>
          </Grid>
          <Grid item md={3} sm={12} xs={12}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
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
          <Grid item md={3} sm={12} xs={12}>
          {tags ?<FormControl variant="outlined" sx={{ m: 1, minWidth: 200, display: "flex", justifyContent: "center", justifyItems: "center" }}>
            <InputLabel id="tags-filter-label">Tag</InputLabel>
            <Select
              value={filterTags}
              multiple
              labelId="tags-filter-label"
              id="tags-filter"
              onChange={(e) => setTagsOnFilter(e.target.value)}
              label="Tag"
            >
              {tags?.map((tag) => {
                return <MenuItem value={tag}>{tag}</MenuItem>
              })}
            </Select>
          </FormControl> : <></>}
          </Grid>
        </Grid>
        <div className="flexer my-2">
          <button
          className='btn_default mx-2'
          onClick={refetchWithFilters}><FilterAlt />Apply</button>
          <button
          className="btn_default__light mx-2"
          // sx={{ backgroundColor: theme.palette.yellowButton, margin: "10px", border: "1px solid black" }}
          onClick={clearFilter}><FilterAltOff />Clear</button>
        </div>
      </SwipeableDrawer>
      </div>
      )}</div>
    </LayoutProvider>
  );
};

export default Home;
