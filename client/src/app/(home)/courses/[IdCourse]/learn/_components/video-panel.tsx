import { Download, FileText, Paperclip } from "lucide-react";
import VideoPlayerComponent from "@/components/vedioPlayer";
import { Lecture, Module } from "@/util/interfaces";

const resources = [
  { name: "lesson-slides.pdf", size: "2.4 MB" },
  { name: "starter-code.zip", size: "850 KB" },
  { name: "cheatsheet.pdf", size: "410 KB" },
];

export default function VideoPanel({
  activeModule,
  activeLecture,
}: {
  activeModule: Module | undefined;
  activeLecture: Lecture | undefined;
}) {
  return (
    <div className="flex-1 min-w-0">
      <VideoPlayerComponent
        video={activeLecture?.secureUrl}
        videoUrl={activeLecture?.secureUrl || ""}
      />

      <div className="mt-5">
        <div className="text-xs text-popover-foreground/40 uppercase tracking-wide">
          {activeModule?.title}
        </div>
        <div className="font-bold text-xl mt-1">{activeLecture?.title}</div>
        <div className="text-sm text-popover-foreground/60 mt-2 leading-normal">
          {activeLecture?.description}
        </div>
      </div>

      <div className="mt-7 border-t border-popover-foreground/10 pt-5">
        <div className="font-bold flex items-center gap-2">
          <Paperclip className="w-4 h-4" /> Lesson resources
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {resources.map((resource) => (
            <div
              key={resource.name}
              className="flex items-center gap-3 bg-popover rounded-lg px-4 py-3"
            >
              <FileText className="w-[18px] h-[18px] text-primary" />
              <div className="flex-1">
                <div className="text-sm">{resource.name}</div>
                <div className="text-xs text-popover-foreground/40">
                  {resource.size}
                </div>
              </div>
              <button
                disabled
                className="flex items-center gap-1.5 border border-popover-foreground/15 rounded-md px-3.5 py-1.5 text-xs cursor-not-allowed opacity-60"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
