type PlayerType = {
  // as in Mongo later
  _id?: string;
  names?: string;
  categories?: string;
  phoneNumbers?: string;
  assignedToQueue?: boolean;
  processedThroughQueue?: boolean;
};

export default PlayerType;
