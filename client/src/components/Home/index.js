import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import LayoutProvider from 'components/common/Layout';
import { Box, Card, CardContent, CardHeader, CardMedia, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { getAuth } from '@firebase/auth';
import { AuthContext } from "../../firebase/auth";

// import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

const Home = () => {
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);
  const [itemsData, setItemsData] = useState(undefined);

  useEffect(() => {
    async function fetchData () {
      try {
        const { data } = await axios.get(
          "https://tempapi.proj.me/api/SVytfBNEU"
        );
        setItemsData(data?.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const itemsCard = () => {
    return (
      <Grid item display="flex" spacing={4} xs={6}>
        {itemsData.map((item) => {
          return (
            <Card key={item.id} sx={{ maxWidth: 345 }}
      // header={<img id={`image-${item.id}`} src={item.images[0]} alt={`${item.name}`} />}
      // revealIcon={<Icon>more_vert</Icon>}
    >
      <CardHeader 
      // action={
      //   <IconButton aria-label="settings">
      //     <MoreVertIcon />
      //   </IconButton>
      // }
      title={item.name}
      // subheader={`${item.status}`} 
      />
      <CardMedia
        component="img"
        height="auto"
        width="100%"
        image={item.images[0]}
        alt={item.name}
      />
      <CardContent>  
        {item.description ? <Typography variant="body2" color="text.secondary">{item.description}</Typography> : <></>}
      </CardContent>
      {/* {item.name ? <div>{item.name}</div> : ""} */}
      <CardContent>
        {item.type ? <Chip label={item.type} variant="outlined" style={{marginRight: "5px"}} /> : <></>}
        {item.status ? <Chip label={item.status} variant="outlined" /> : <></>}
      </CardContent>
    </Card>)
        })}
      </Grid>
    );
  };

  return (
    <LayoutProvider>
    <div>
      Home
      <Box sx={{ flexGrow: 1 }}>
      {itemsData ? <Grid spacing={2} justify="space-between" display="flex" direction="row" container spacing={2}>{itemsCard()}</Grid> : <></>}
      </Box>
    </div>
    </LayoutProvider>
  )
};

export default Home;