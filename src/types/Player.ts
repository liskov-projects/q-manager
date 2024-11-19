type PlayerType = {
  // as in Mongo later
  _id?: string;
  names?: string;
  categories?: string | string[];
  phoneNumbers?: string;
  assignedToQueue?: boolean;
  processedThroughQueue?: boolean;
  tournamentId: string;
};

export default PlayerType;
