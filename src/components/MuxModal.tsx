import { MuxType } from "@/pages/api/mux";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type Props = {
  videos: MuxType[];
  currentIndex: number;
  onClose: () => void;
  onNext: (index: number) => void;
};

export default function MuxModal({
  videos,
  currentIndex,
  onClose,
  onNext,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const video = videos[currentIndex];

  useEffect(() => {
    if (!videoRef.current || !video.playbackId) return;

    const hls = new Hls();
    hls.loadSource(`https://stream.mux.com/${video.playbackId}.m3u8`);
    hls.attachMedia(videoRef.current);

    const handleEnded = () => {
      if (currentIndex + 1 < videos.length) {
        onNext(currentIndex + 1);
      } else {
        onClose();
      }
    };

    const updateProgress = () => {
      if (!videoRef.current) return;
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) {
        setProgress(currentTime / duration);
      }
    };

    const vid = videoRef.current;
    vid.addEventListener("ended", handleEnded);
    vid.addEventListener("timeupdate", updateProgress);
    vid.play().catch(() => {});

    return () => {
      hls.destroy();
      vid.removeEventListener("ended", handleEnded);
      vid.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentIndex]);

  if (!video || !video.playbackId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative h-full w-full aspect-video">
        {/* Instagram-style progress bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-4 pt-4 pointer-events-none">
          {videos.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white rounded-full relative overflow-hidden"
            >
              {i < currentIndex && (
                <div className="absolute inset-0 bg-red-700" />
              )}
              {i === currentIndex && (
                <div
                  className="absolute inset-0 bg-red-700 transition-all duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mux Video Player */}
        <video
          ref={videoRef}
          controls
          muted={false}
          autoPlay
          playsInline
          className="w-full h-11/12 rounded mt-10"
        />

        {/* Left nav button */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNext(currentIndex - 1)}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-30 pointer-events-auto"
          >
            <div className="bg-white rounded-full shadow p-3">
              <ChevronLeftIcon className="h-7 w-7 text-red-700" />
            </div>
          </button>
        )}

        {/* Right nav button */}
        {currentIndex < videos.length - 1 && (
          <button
            onClick={() => onNext(currentIndex + 1)}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-30 pointer-events-auto"
          >
            <div className="bg-white rounded-full shadow p-3">
              <ChevronRightIcon className="h-7 w-7 text-red-700" />
            </div>
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-12 right-2 text-white bg-black/60 rounded px-3 py-1 z-30"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
