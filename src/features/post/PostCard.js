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

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";

import { Link as RouterLink } from "react-router-dom";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { fDate } from "../../utils/formatTime";

import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import useAuth from "../../hooks/useAuth";
import { deletePosts } from "./postSlice";
import PostEditForm from "./PostEditForm";

function PostCard({ post }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  ///////////////////
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentUserId = user._id;

  const handlePostMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePostMenuClose = () => {
    setAnchorEl(null);
  };

  let postId = post._id;
  let authorId = post.author._id;
  ////////////////Delete form////////////////////
  const handleDialogDelete = () => {
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
  /////////////////////////////////////////

  //////////////////////Edit form/////////////////
  const handleDialogEdit = () => {
    if (authorId === currentUserId) {
      setDialogEdit(true);
    } else {
      toast.error("you can only edit your posts");
    }
  };

  const handleCancelEdit = () => {
    setDialogEdit(false);
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
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <LoadingButton onClick={handleDialogEdit}>Edit Post</LoadingButton>
        <LoadingButton onClick={handleDialogDelete}>Delete Post</LoadingButton>
      </Box>
    </Menu>
  );

  ///////////////////////////////
  return (
    <Card>
      <CardHeader
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
      {/* /////////////////////////////////////// */}

      {/* ///////////////Edit pop up///////////// */}
      <Dialog open={dialogEdit} onClose={handleCancelEdit}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <PostEditForm
            content={post.content}
            image={post.image}
            postId={postId}
            authorId={authorId}
            setAnchorEl={setAnchorEl}
            setDialogEdit={setDialogEdit}
          />
        </DialogContent>
      </Dialog>

      {/* /////////////////////////////////////// */}
    </Card>
  );
}

export default PostCard;
