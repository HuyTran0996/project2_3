import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  /////////////
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import { deleteComments } from "./commentSlice";
import CommentEditForm from "./CommentEditForm";
function CommentCard({ comment }) {
  // const [anchorEl, setAnchorEl] = useState(null);
  const [dialogEdit, setDialogEdit] = useState(false); //edit form
  const [dialogOpen, setDialogOpen] = useState(false); //delete form
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentUserId = user._id;
  let commentId = comment._id.toString();
  let authorId = comment.author._id;
  let postId = comment.post.toString();
  ////////////////Delete form////////////////////
  const handleDialogDelete = () => {
    if (authorId === currentUserId) {
      setDialogOpen(true);
    } else {
      toast.error("you can only delete your posts");
    }
  };
  const handleConfirmDelete = () => {
    dispatch(deleteComments({ authorId, commentId, postId }));
    setDialogOpen(false);
  };
  const handleCancelDelete = () => {
    setDialogOpen(false);
  };
  /////////////////////////////////////////
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
  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {/* date of comment */}
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleDialogDelete}>Delete</Button>
          <Button onClick={handleDialogEdit}>Edit</Button>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>

      {/* ///////////////Confirm pop up///////////// */}
      <Dialog open={dialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      {/* /////////////////////////////////////// */}

      <Dialog open={dialogEdit} onClose={handleCancelEdit}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <CommentEditForm
            postId={postId}
            commentId={commentId}
            oldContent={comment.content}
            authorId={authorId}
            setDialogEdit={setDialogEdit}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default CommentCard;
