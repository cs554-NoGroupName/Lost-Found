import React, { useEffect, useState } from "react";
import lodash from "lodash";
import LayoutProvider from "components/common/Layout";
import useDocumentTitle from "components/common/useDocumentTitle";
import LoadingText from "components/common/loadingText";
import { styled } from "@mui/material/styles";

import "./styles.css";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Global } from "@emotion/react";

import Search from "./Search";
import { makeApiCall } from "utils/apis/api";

import {
  FilterAlt,
  FilterAltOff,
  FilterList,
  FilterListOff,
} from "@mui/icons-material";
import ItemCard from "components/myActivities/card";

const container = window !== undefined ? () => window.document.body : undefined;

const drawerBleeding = 56;

const drawerBleedingDiff = 44;

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "#fff" : theme.palette.primary.main,
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const Home = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterTags, setFilterTags] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [todayItems, setTodayItems] = useState([]);

  // MUI Theme
  const theme = useTheme();

  // API Call on load
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await makeApiCall(`/items`);
        console.log("data:", data);
        const dataWithTags = arrayfyTags(data?.data);
        setItemsData(dataWithTags?.beyond);
        setTodayItems(dataWithTags?.today);
        setLastSevenDays(dataWithTags?.week);
        setLoading(false);
      } catch (err) {
        //console.log(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Search UseEffect
  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchWithoutSearch() {
      try {
        console.log(`in fetch searchTerm`);
        const { data } = await makeApiCall(`/items`);
        console.log("search data:", data);
        const dataWithTags = arrayfyTags(data?.data);
        setItemsData(dataWithTags?.beyond ?? []);
        setTodayItems(dataWithTags?.today ?? []);
        setLastSevenDays(dataWithTags?.week ?? []);
      } catch (e) {
        console.log(e);
      }
    }
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await makeApiCall(`/items?itemName=${searchTerm}`);
        console.log("search data:", data);
        const dataWithTags = arrayfyTags(data?.data);
        setItemsData(dataWithTags?.beyond ?? []);
        setTodayItems(dataWithTags?.today ?? []);
        setLastSevenDays(dataWithTags?.week ?? []);
      } catch (e) {
        //console.log(e);
      }
    }
    if (searchTerm) {
      //console.log("searchTerm is set");
      fetchData();
      setAppliedFilters(null);
      setFilterCategory(null);
      setFilterStatus(null);
      setFilterType(null);
      setFilterTags([]);
    } else {
      fetchWithoutSearch();
      setAppliedFilters(null);
      setFilterCategory(null);
      setFilterStatus(null);
      setFilterType(null);
      setFilterTags([]);
    }
  }, [searchTerm]);

  const arrayfyTags = (data) => {
    const today = data?.today ?? [];
    const week = data?.week ?? [];
    const beyond = data?.beyond ?? [];
    today.forEach((item) => {
      let itemTag = item?.tags?.split(",");
      let empty = [];
      itemTag.forEach((tag) => {
        empty.push(tag.trim());
      });
      item.tags = empty;
    });
    week.forEach((item) => {
      let itemTag = item?.tags?.split(",");
      let empty = [];
      itemTag.forEach((tag) => {
        empty.push(tag.trim());
      });
      item.tags = empty;
    });
    beyond.forEach((item) => {
      let itemTag = item?.tags?.split(",");
      let empty = [];
      itemTag.forEach((tag) => {
        empty.push(tag.trim());
      });
      item.tags = empty;
    });
    return {
      today: today,
      week: week,
      beyond: beyond,
    };
  };

  useEffect(() => {
    const getUniqueTags = () => {
      let temp = [];

      const totalData = [...itemsData, ...todayItems, ...lastSevenDays];

      for (const item of totalData) {
        // console.log(item)
        const value = item?.tags?.map((tag) => tag);
        temp = lodash.uniq([...temp, ...value]);
      }
      //console.log("tags array:", temp);
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
    if (
      (todayItems || lastSevenDays || itemsData) &&
      (todayItems.length > 0 ||
        lastSevenDays.length > 0 ||
        itemsData.length > 0)
    ) {
      setTags(getUniqueTags());
      setCategories(getUniqueCategories());
    }
  }, [itemsData, todayItems, lastSevenDays]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  // Filter functions
  const toggleFilter = () => {
    setShowFilters(!showFilters);
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
    //console.log("filtered data:", data);
    const dataWithTags = arrayfyTags(data?.data);
    setItemsData(dataWithTags?.beyond ?? []);
    setTodayItems(dataWithTags?.today ?? []);
    setLastSevenDays(dataWithTags?.week ?? []);
    setAppliedFilters(filterBool ? filterObj : null);
  };

  const clearFilter = () => {
    setFilterCategory(null);
    setFilterTags([]);
    setFilterStatus(null);
    setFilterType(null);
    setAppliedFilters(null);
    refetchWithFilters(false);
  };

  // Items Card building
  const cardBuilder = (item) => {
    return (
      <div className="mr-4 mb-2">
        <ItemCard item={item} />
      </div>
    );
  };

  const itemsCard = (data) => {
    return (
      <div className="items-card">
        {data?.map((item) => {
          return cardBuilder(item);
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
              {cardBuilder(item)}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <LayoutProvider>
      {useDocumentTitle("Home")}
      <div>
        {loading ? (
          <LoadingText />
        ) : (
          <div>
            <div className="flexer-even">
              <Search searchValue={searchValue} searchType="Events" />
              {/* <button className="btn_default" onClick={() => setSearchTerm(" ")}><Clear />Clear Search</button> */}
              <button className="btn_default" onClick={toggleFilter}>
                {showFilters ? (
                  <div>
                    <FilterListOff />
                    Hide
                  </div>
                ) : (
                  <div>
                    <FilterList />
                    Filters
                  </div>
                )}
              </button>
            </div>
            {appliedFilters ? (
              <div>
                {appliedFilters?.status ? (
                  <Chip
                    variant="outlined"
                    style={{ marginRight: "5px", marginBottom: "2px" }}
                    label={`Status: ${appliedFilters.status}`}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                ) : (
                  <></>
                )}
                {appliedFilters?.type ? (
                  <Chip
                    variant="outlined"
                    style={{ marginRight: "5px", marginBottom: "2px" }}
                    label={`Type: ${appliedFilters.type}`}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                ) : (
                  <></>
                )}
                {appliedFilters?.category ? (
                  <Chip
                    variant="outlined"
                    style={{ marginRight: "5px", marginBottom: "2px" }}
                    label={`Category: ${appliedFilters.category}`}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                ) : (
                  <></>
                )}
                {appliedFilters?.tags ? (
                  <Chip
                    variant="outlined"
                    style={{ marginRight: "5px", marginBottom: "2px" }}
                    label={`Tags: ${appliedFilters.tags}`}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <div style={{ margin: "10px" }} className="label-text">
                Today
              </div>
              {todayItems && todayItems?.length > 0 ? (
                <div>
                  <div
                    className="slider-cards"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    {itemsCard(todayItems)}
                  </div>
                </div>
              ) : (
                <div style={{ margin: "10px" }}>No data</div>
              )}
            </Box>
            <div style={{ margin: "10px" }} className="label-text">
              Last 7 days
            </div>
            <div>
              {lastSevenDays && lastSevenDays?.length > 0 ? (
                <div>{itemsCardAlt(lastSevenDays)}</div>
              ) : (
                <div style={{ margin: "10px" }}>No data</div>
              )}
            </div>
            <div style={{ margin: "10px" }} className="label-text">
              More than 7 days ago
            </div>
            <div>
              {itemsData && itemsData?.length > 0 ? (
                <div>{itemsCardAlt(itemsData)}</div>
              ) : (
                <div style={{ margin: "10px" }}>No data</div>
              )}
            </div>
            <br />
            <br />
            {/* Modal display to ask users to login for item details */}
            <Global
              styles={{
                ".MuiDrawer-root > .MuiPaper-root": {
                  overflow: "visible",
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
                  position: "absolute",
                  top: -drawerBleedingDiff,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  visibility: "visible",
                  right: 0,
                  left: 0,
                }}
              >
                <Puller />
                <Typography
                  sx={{ p: 2, color: "text.secondary", padding: "10px" }}
                >
                  Filters
                </Typography>
              </StyledBox>
              <Grid container spacing={0}>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl
                    variant="outlined"
                    sx={{
                      m: 1,
                      minWidth: 200,
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginRight: "15px",
                    }}
                  >
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                      value={filterCategory}
                      labelId="category-filter-label"
                      id="category-filter"
                      onChange={(e) => setCategoryOnFilter(e.target.value)}
                      label="Status"
                      sx={{ marginRight: "15px" }}
                    >
                      {categories.map((category) => {
                        return <MenuItem value={category}>{category}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl
                    variant="outlined"
                    sx={{
                      m: 1,
                      minWidth: 200,
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginRight: "15px",
                    }}
                  >
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      value={filterStatus}
                      labelId="status-filter-label"
                      id="status-filter"
                      onChange={(e) => setStatusOnFilter(e.target.value)}
                      label="Status"
                      sx={{ marginRight: "15px" }}
                    >
                      <MenuItem value="reported">Reported</MenuItem>
                      <MenuItem value="claimed">Claimed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl
                    variant="outlined"
                    sx={{
                      m: 1,
                      minWidth: 200,
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginRight: "15px",
                    }}
                  >
                    <InputLabel id="type-filter-label">Type</InputLabel>
                    <Select
                      value={filterType}
                      labelId="type-filter-label"
                      id="type-filter"
                      onChange={(e) => setTypeOnFilter(e.target.value)}
                      label="Type"
                      sx={{ marginRight: "15px" }}
                    >
                      <MenuItem value="lost">Lost</MenuItem>
                      <MenuItem value="found">Found</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  {tags ? (
                    <FormControl
                      variant="outlined"
                      sx={{
                        m: 1,
                        minWidth: 200,
                        display: "flex",
                        justifyContent: "center",
                        justifyItems: "center",
                      }}
                    >
                      <InputLabel id="tags-filter-label">Tag</InputLabel>
                      <Select
                        value={filterTags}
                        multiple
                        labelId="tags-filter-label"
                        id="tags-filter"
                        onChange={(e) => setTagsOnFilter(e.target.value)}
                        label="Tag"
                        sx={{ marginRight: "15px" }}
                      >
                        {tags?.map((tag) => {
                          return <MenuItem value={tag}>{tag}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
              <div className="flexer my-2">
                <button
                  className="btn_default mx-2"
                  onClick={refetchWithFilters}
                >
                  <FilterAlt />
                  Apply
                </button>
                <button
                  className="btn_default__light mx-2"
                  onClick={clearFilter}
                >
                  <FilterAltOff />
                  Clear
                </button>
              </div>
            </SwipeableDrawer>
          </div>
        )}
      </div>
    </LayoutProvider>
  );
};

export default Home;
