import { VimeoType } from "@/pages/api/vimeo";
import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type Props = {
  videos: VimeoType[];
  currentIndex: number;
  onClose: () => void;
  onNext: (index: number) => void;
};

export default function VimeoModal({
  videos,
  currentIndex,
  onClose,
  onNext,
}: Props) {
  const video = videos[currentIndex];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);

    const updateProgress = async () => {
      const duration = await player.getDuration();
      const currentTime = await player.getCurrentTime();
      setProgress(currentTime / duration);
    };

    const handleEnded = () => {
      setProgress(1);
      if (currentIndex + 1 < videos.length) {
        onNext(currentIndex + 1);
      } else {
        onClose();
      }
    };

    player.on("timeupdate", updateProgress);
    player.on("ended", handleEnded);
    player.play().catch(() => {});

    return () => {
      player.off("timeupdate", updateProgress);
      player.off("ended", handleEnded);
      player.unload();
    };
  }, [currentIndex]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative h-full w-full aspect-video">
        {/* Instagram-style progress bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-4 pt-4">
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

        {/* Vimeo Player */}
        <iframe
          key={video.id}
          ref={iframeRef}
          src={video.embedUrl}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-11/12 rounded mt-10"
        />

        {/* Clickable LEFT overlay */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNext(currentIndex - 1)}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-30 pointer-events-auto opacity-60"
          >
            <div className="bg-white rounded-full shadow p-3">
              <ChevronLeftIcon className="h-7 w-7 text-red-700" />
            </div>
          </button>
        )}

        {/* Clickable RIGHT overlay */}
        {currentIndex < videos.length - 1 && (
          <button
            onClick={() => onNext(currentIndex + 1)}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-30 pointer-events-auto opacity-60"
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
