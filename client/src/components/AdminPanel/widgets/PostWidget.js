import React from "react";
import { Typography, Divider } from "@mui/material";
import Friend from "./Friend";
import WidgetWrapper from "../../FloodConnect/components/WidgetWrapper";

const PostWidget = ({ postUserId, name, description, picturePath }) => {
  return (
    <WidgetWrapper m="2rem 0">
      <Friend friendId={postUserId} name={name} />

      <Typography variant="body1" sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:5000/assets/${picturePath}`}
        />
      )}

      <Divider />
    </WidgetWrapper>
  );
};

export default PostWidget;
