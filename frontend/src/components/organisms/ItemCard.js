import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
});
export default function ItemCard(props) {
  const classes = useStyles();
  const { item } = props;
  if (!item) {
    return <div></div>;
  }
  const itemName =
    item.item_name.length >= 30
      ? item.item_name.substring(0, 30) + "..."
      : item.item_name;

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {item.image_URLs[0] && (
          <CardMedia
            className={classes.media}
            image={item.image_URLs[0].imageUrl}
            title={"item"}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="subtitle1">
            <a href={item.itemUrl}>{itemName}</a>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
