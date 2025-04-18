import Header from "@/Components/Header";

export default function HowQMWorks() {
  return (
    <>
      <Header>All you might want to know about Q-Manager</Header>
      <div className="w-full flex justify-center mt-8 p-4">
        <div className="w-1/2">
          <video
            controls
            className="max-w-[90%] max-h-[500px] rounded-md mx-auto border-2 border-bluestone-300 rounded-xl shadow-lg bg-transparent"
          >
            <source src="/q-manager-vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="w-1/2 flex items-center p-4">
          <span className="text-xl font-semibold tracking-wide p-4">
            This video is a quick overview of what Q-Manager is capable of. It’s not a complete
            guide, but a preview of what’s possible.
            <hr className="border-t border-bluestone-300 my-4" />
            Q-Manager is designed to streamline and automate queues and items in them. The app is
            being actively developed, with new features and improvements added regularly. It aims to
            simplify complex workflows and enhance productivity.
          </span>
        </div>
      </div>
    </>
  );
}
