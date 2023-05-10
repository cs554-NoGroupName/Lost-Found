import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Chip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function ItemCard({ item }) {
  const {
    _id,
    imageUrl,
    tags,
    itemName,
    description,
    lastSeenDate,
    lastSeenLocation,
    itemStatus,
    type,
  } = item;

  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card sx={{ minWidth: 320 }}>
      <Link to={`/item/${_id}`}><CardMedia sx={{ height: 400 }} image={imageUrl} title={itemName} /></Link>

      <CardContent>
        <div className="text-xl font-[700]">{itemName}</div>
        <div className="font-[600] mt-1">
          Status: <span className="font-[700]">{itemStatus}</span>
        </div>
        <div className="font-[600] mt-1">
          Reported Location: {lastSeenLocation}
        </div>
        <div className="font-[600] mt-1">
          Reported Date: {moment(lastSeenDate).format("MMMM Do YYYY, h:mm a")}
        </div>
        <div className="font-[600] mt-2">
          {typeof tags === 'object' ? 
          tags?.map((tag) => (
            <Chip
              key={tag}
              sx={{
                backgroundColor: "#ff9717",
                color: "#1c2536",
                borderRadius: "50px",
                marginRight: "5px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
              label={tag}
            />
          ))
          :  tags?.split(",")?.map((tag) => (
            <Chip
              key={tag}
              sx={{
                backgroundColor: "#ff9717",
                color: "#1c2536",
                borderRadius: "50px",
                marginRight: "5px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
              label={tag}
            />
          ))}
        </div>
        <div className="type_tag mt-2">{type}</div>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <button
          className="btn_default_moreinfo"
          onClick={() => {
            navigate("/item/" + _id);
          }}
        >
          View details
        </button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div className="text-xl font-[600]">Description</div>
          <div className="textWrap">{description}</div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ItemCard;
