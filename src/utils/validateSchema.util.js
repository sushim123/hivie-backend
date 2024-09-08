// Helper function to validate deliverables
export const validateDeliverables = (deliverables) => {
  return deliverables.map((deliverable) => {
    if (deliverable.deliverable_type === 'reel') {
      if (!deliverable.details.title || typeof deliverable.details.time_duration !== 'number') {
        throw new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid reel details');
      }
    } else if (deliverable.deliverable_type === 'post') {
      if (!deliverable.details.title || !deliverable.details.description) {
        throw new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid post details');
      }
    }
    return true;
  });
};

// Helper function to validate user IDs
export const validateUserIds = (userIds) => {
  return userIds.map((userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new apiError(STATUS_CODES.BAD_REQUEST, `Invalid user ID: ${userId}`);
    }
    return true;
  });
};
