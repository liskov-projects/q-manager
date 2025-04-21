import Header from "@/Components/Header";
import SectionHeader from "@/Components/SectionHeader";
import LiskovLogo from "@/Components/Svgs/LiskovLogo";

export default function HowQMWorks() {
  return (
    <>
      <Header>Q-Manager Guide</Header>
      <div className="w-full flex flex-col md:flex-row justify-center mt-8 p-3">
        <div className="w-full md:w-1/2 flex justify-center">
          <video
            controls
            className="max-w-[90%] max-h-[500px] rounded-xl mx-auto border-2 border-bluestone-300 shadow-lg bg-transparent"
          >
            <source src="/q-manager-vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="w-full md:w-1/2 flex items-center p-5">
          <span className="text-xl font-semibold tracking-wide">
            This video is a quick overview of what Q-Manager is capable of. It’s not a complete
            guide, but a preview of what’s possible.
            <hr className="border-t border-bluestone-300 my-4" />
            Q-Manager is designed to streamline and automate queues and items in them. The app is
            being actively developed, with new features and improvements added regularly. It aims to
            simplify complex workflows and enhance productivity.
          </span>
        </div>
      </div>
      <SectionHeader className="pt-4 text-4xl font-semibold">
        Q-Manager Beginners&apos; Guide
      </SectionHeader>
      <QManagerEmbed />
    </>
  );
}

function QManagerEmbed() {
  return (
    <div className="w-full flex flex-col justify-center mt-8 p-4">
      <div className="w-full">
        <div className="relative w-[90%] mx-auto pb-[56.25%]">
          {/* 16:9 aspect ratio box */}
          <iframe
            loading="lazy"
            src="https://www.canva.com/design/DAGkAmlDwmw/zfpVliCqERF0H_VJTLfshQ/view?embed"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg border-none shadow-lg"
          ></iframe>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center mt-4">
        <p className="pr-2 text-bluestone-200 font-semibold">Q-Manager by</p>
        <LiskovLogo width="w-[40px]" height="h-[40px]" />
      </div>
    </div>
  );
}
