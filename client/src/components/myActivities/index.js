import LayoutProvider from "components/common/Layout";
import React from "react";
import { getUserActivites } from "utils/apis/user";
import { Box, Grid } from "@mui/material";
import LoadingText from "components/common/loadingText";
import ItemCard from "./card";

function MyActivites() {
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    getUserActivites()
      .then((data) => {
        setData(data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const section = (title, data, noDataTitle = "Nothing to show!") => {
    return (
      <div className="mx-5 mb-8">
        <div className="text-2xl font-[700] mt-3 mb-4 text-[#1c2536bd]">
          {title}
        </div>
        <div>
          <Box>
            {data?.length > 0 ? (
              <Grid container spacing={4}>
                {data?.map((item) => {
                  return (
                    <Grid xs={12} sm={12} md={4} lg={3} key={item?._id} item>
                      <ItemCard item={item} />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <div className="text-xl font-[600] my-2">{noDataTitle}</div>
            )}
          </Box>
        </div>
      </div>
    );
  };

  return (
    <LayoutProvider>
      <div>
        <div className="text-3xl font-[700] mb-5 text-[#1c2536]">
          My MyActivites
        </div>
        {loading ? (
          <LoadingText />
        ) : (
          <>
            {section("My Reported Items", data?.reported)}
            {section("My Claimed Items", data?.claims)}
            {section("Recieved claim requests", data?.received_claims)}
            {section("Sent claim requests", data?.requested_claims)}
          </>
        )}
      </div>
    </LayoutProvider>
  );
}

export default MyActivites;
