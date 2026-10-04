import React from "react";
import { Modal, Box, Typography, Rating, Button } from "@mui/material";

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedback?: {
    createdAt?: string | Date;
    rating?: number;
    comment?: string;
    [key: string]: any;
  } | null;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onClose, feedback }) => {
  return (
    <Modal id="view-feedback-modal" open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          textAlign: "center",
          alignItems: "center",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6">Your Feedback</Typography>

        {!feedback ? (
          <Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              No feedback available.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="textSecondary">
              Create Date: {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : ""}
            </Typography>
            <Rating value={feedback.rating || 0} readOnly sx={{ mt: 1, alignSelf: "center" }} />
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                px: 2,
                textAlign: "justify",
                whiteSpace: "pre-wrap",
              }}
            >
              {feedback.comment}
            </Typography>
          </>
        )}

        <Button onClick={onClose} variant="contained" sx={{ mt: 2, width: "30%" }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
