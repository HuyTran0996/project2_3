import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  ////////
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";

import { Link as RouterLink } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fDate } from "../../utils/formatTime";

import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import useAuth from "../../hooks/useAuth";
import { deletePosts } from "./postSlice";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});
const defaultValues = {
  content: "",
  // image: null,
};

function PostCard({ post }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  ///////////////////
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentUserId = user._id;

  const { isLoading } = useSelector((state) => state.post);

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  // const updatedProfile = useSelector((state) => state.user.updatedProfile);

  const handlePostMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePostMenuClose = () => {
    setAnchorEl(null);
  };

  let postId = post._id;
  let authorId = post.author._id;
  const handleEditPost = () => {};

  const handleDeletePost = () => {
    if (authorId === currentUserId) {
      setDialogOpen(true);
    } else {
      toast.error("you can only delete your posts");
    }
  };

  const handleConfirmDelete = () => {
    dispatch(deletePosts({ authorId, postId }));
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handlePostMenuClose}
      loading={isSubmitting || isLoading}
    >
      {/* <MenuItem onClick={handleEditPost}>Edit Post</MenuItem> */}

      <LoadingButton onClick={handleDeletePost}>Delete Post</LoadingButton>
    </Menu>
  );
  return (
    <Card>
      <CardHeader
        methods={methods}
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton onClick={handlePostMenuOpen}>
            {/* toggle edit post and delete post here */}
            <MoreVertIcon sx={{ fontSize: 30 }} />
          </IconButton>
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
      {renderMenu}
      {/* ///////////////Confirm pop up///////////// */}
      <Dialog open={dialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default PostCard;
