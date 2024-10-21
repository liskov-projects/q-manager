type Player = {
  // as in Mongo later
  _id: string;
  names: string;
  category: string;
  mobileNumbers: string;
  assignedToQueue: boolean;
  processedThroughQueue: boolean;
};

export default Player;
