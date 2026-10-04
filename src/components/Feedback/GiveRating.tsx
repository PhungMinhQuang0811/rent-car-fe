import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import { sendFeedback } from "../../services/FeedbackServices";
import NotificationSnackbar from "../common/NotificationSnackbar";

export interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; review: string }) => void;
  bookingDate?: string | Date;
  hasReviewed?: boolean;
  bookingId: string | number;
}

const RatingModal: React.FC<RatingModalProps> = ({
  open,
  onClose,
  onSubmit,
  bookingDate,
  hasReviewed = false,
  bookingId,
}) => {
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isReviewed] = useState(hasReviewed);
  const [alert, setAlert] = useState<{ open: boolean; severity: "success" | "error" | "info" | "warning"; message: string }>({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    if (bookingDate) {
      const completedDate = new Date(bookingDate);
      const now = new Date();
      const diffInDays = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
      setIsExpired(diffInDays > 30);
    }
  }, [bookingDate]);

  const handleSubmit = async () => {
    try {
      await sendFeedback({
        bookingId: String(bookingId),
        rating: rating || 0,
        comment: review.trim(),
      });

      setAlert({ open: true, severity: "success", message: "Feedback submitted successfully!" });
      setTimeout(() => {
        onSubmit({ rating: rating || 0, review });
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setAlert({ open: true, severity: "error", message: "Failed to submit feedback!" });
    }
  };

  return (
    <>
      <Modal id="feedback-modal" open={open} onClose={onClose}>
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
          }}
        >
          <Typography variant="h6" align="center">
            Rate your trip
          </Typography>

          {isExpired ? (
            <Typography color="error" align="center">
              Feedback period expired (30 days limit).
            </Typography>
          ) : isReviewed ? (
            <Typography color="textSecondary" align="center">
              You have already submitted your review.
            </Typography>
          ) : (
            <>
              <Typography variant="body2" align="center">
                Do you enjoy your trip? Please let us know what you think.
              </Typography>

              <Rating
                name="trip-rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
              />

              <TextField
                id="feedback-comment"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, 2000))}
                helperText={`${review.length}/2000`}
                disabled={isReviewed}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button id="skip-feedback" onClick={onClose} variant="outlined">
                  Skip
                </Button>
                <Button
                  id="send-review"
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={!rating || rating === 0 || isReviewed}
                  sx={{ backgroundColor: "#05ce80" }}
                >
                  Send Review
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
    </>
  );
};

export default RatingModal;
