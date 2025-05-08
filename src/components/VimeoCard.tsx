import { VimeoType } from "@/pages/api/vimeo";
import { LockClosedIcon, PlayIcon } from "@heroicons/react/24/solid"; // optional: use your own icons

type Props = {
  video: VimeoType;
  onClick?: () => void;
};

export default function VimeoCard({ video, onClick }: Props) {
  return (
    <div
      className="relative aspect-[9/14] w-full overflow-hidden rounded-md bg-black text-white shadow-md"
      onClick={onClick}
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover"
      />

      {/* Top label */}
      <div className="absolute top-2 left-2 bg-teal-700 text-xs px-2 py-1 rounded-sm font-semibold">
        5:25 Sandown
      </div>

      {/* Play icon center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/80 p-2 rounded-full">
          <PlayIcon className="h-6 w-6 text-black" />
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/20 p-2 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-white text-black px-1 py-0.5 rounded font-mono text-[10px]">
            00:35
          </span>
          <span className="bg-red-600 text-white px-1 py-0.5 rounded text-[10px]">
            Tipping
          </span>
          <LockClosedIcon className="h-4 w-4 text-white ml-auto" />
        </div>
        <div className="font-medium text-sm leading-tight line-clamp-2">
          {video.title}
        </div>
      </div>
    </div>
  );
}
