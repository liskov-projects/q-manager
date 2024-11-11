type PlayerType = {
  // as in Mongo later
  _id: string;
  names: string;
  categories: string;
  mobileNumbers: string;
  assignedToQueue: boolean;
  processedThroughQueue: boolean;
};

export default PlayerType;
