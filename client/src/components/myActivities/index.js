import LayoutProvider from "components/common/Layout";
import React from "react";

function MyActivites() {
  // const cardBuilder = (item) => {
  //   return (
  //     <Card key={item?.id} sx={{ maxWidth: 345 }}>
  //       <CardHeader title={item?.name} subheader={item?.category} subheaderTypographyProps={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}} sx={{ color: theme.palette.primary.contrastText,
  //         backgroundColor: theme.palette.primary.main}} />
  //       <CardMedia
  //         // className="card-media"
  //         component="img"
  //         height="200px"
  //         width="100%"
  //         sx={{
  //           objectFit: "contain",
  //           width: "300px",
  //           height: "300px"
  //         }}
  //         image={item?.images?.[0]}
  //         alt={item?.name}
  //       />
  //       <CardContent sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}>
  //         {item?.type ? <div>Type: {item?.type}</div> : <></>}
  //         {item?.status ? <div>Status: {item?.status}</div> : <></>}
  //         {item?.description ? (
  //           <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}>
  //             {item?.description}
  //           </Typography>
  //         ) : (
  //           <></>
  //         )}
  //       </CardContent>
  //       <CardContent sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main}}>
  //         {item?.tags && item?.tags?.length > 0 ? (
  //           <>{itemTags(item?.tags)}</>
  //         ) : (
  //           <></>
  //         )}
  //       </CardContent>
  //     </Card>
  //   );
  // };

  // const itemTags = (tags) => {
  //   return tags.map((tag) => {
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
  return (
    <LayoutProvider>
      <div>MyActivites</div>
    </LayoutProvider>
  );
}

export default MyActivites;
