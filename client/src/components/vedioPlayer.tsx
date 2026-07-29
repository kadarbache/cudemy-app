"use client";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/kibo-ui/video-player/index";
const VideoPlayerComponent = ({
  video,
  videoUrl,
}: {
  video: string | undefined;
  videoUrl: string;
}) => {
  if (videoUrl !== undefined) {
    video = videoUrl;
  }
  if (typeof window === "undefined") return null;
  return (
    <VideoPlayer className="overflow-hidden rounded-lg border mb-4">
      <VideoPlayerContent
        crossOrigin=""
        muted
        preload="auto"
        slot="media"
        src={video}
      />
      <VideoPlayerControlBar>
        <VideoPlayerPlayButton />
        <VideoPlayerSeekBackwardButton />
        <VideoPlayerSeekForwardButton />
        <VideoPlayerTimeRange />
        <VideoPlayerTimeDisplay showDuration />
        <VideoPlayerMuteButton />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </VideoPlayer>
  );
};
export default VideoPlayerComponent;
