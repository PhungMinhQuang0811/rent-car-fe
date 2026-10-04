import React, { useState } from "react";
import FeedbackCard from "../Feedback/FeedbackCard";
import { Divider, Button, Box } from "@mui/joy";

export interface FeedbackListProps {
  feedbackList: any[];
  img?: string;
}

const buttonStyles = { mt: 1, borderColor: "#05ce80", color: "#05ce80" };

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbackList = [], img }) => {
  const isLoadMorePage = !!img;
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleFeedbacks = isLoadMorePage
    ? feedbackList.slice(0, visibleCount)
    : feedbackList;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 3);
  const handleCollapse = () => setVisibleCount(3);

  return (
    <>
      {visibleFeedbacks.map((feedback, index) => (
        <div key={feedback.id || index}>
          <FeedbackCard feedbackData={feedback} img={img} />
          {index < visibleFeedbacks.length - 1 && <Divider />}
        </div>
      ))}
      {isLoadMorePage && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          {visibleCount < feedbackList.length && (
            <Button onClick={handleLoadMore} variant="outlined" sx={buttonStyles}>
              Load More
            </Button>
          )}
          {visibleCount > 3 && (
            <Button onClick={handleCollapse} variant="outlined">
              Collapse
            </Button>
          )}
        </Box>
      )}
    </>
  );
};

export default FeedbackList;
