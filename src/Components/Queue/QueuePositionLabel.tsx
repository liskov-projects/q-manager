const QueuePositionLabel = ({ index }: { index: number }) => {
  return (
    <div
      className={`text-[0.65rem] w-[95%] shadow-left-bottom-lg font-extrabold mb-1 px-3 py-1 rounded-full border-0 border-gray-400 ${
        index === 0 ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"
      }`}
    >
      {index === 0 ? "ON COURT" : `QUEUE POSITION: ${index}`}
    </div>
  );
};

export default QueuePositionLabel;
