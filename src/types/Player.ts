// TYPES:
type Player = {
  // as in Mongo later
  id: string;
  name: string;
  category: string;
  mobileNumber: string;
  assignedToQueue: boolean;
  processedThroughQueue: boolean;
  currentMatch: boolean;
};

export default Player;
