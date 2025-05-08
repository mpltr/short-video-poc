import { useState } from "react";
import Carousel from "@/components/Carousel";
import VimeoCard from "@/components/VimeoCard";
import VimeoModal from "@/components/VimeoModal";
import { GetServerSideProps } from "next";
import { VimeosType } from "./api/vimeo";

type Props = {
  videos: VimeosType;
};

export default function VimeoPage({ videos }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="p-8">
      <Carousel>
        {videos.map((video, index) => (
          <VimeoCard
            key={video.id}
            video={video}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </Carousel>

      {selectedIndex !== null && (
        <VimeoModal
          videos={videos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={(index) => setSelectedIndex(index)}
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/vimeo`);
  const videos: VimeosType = await res.json();

  return {
    props: {
      videos,
    },
  };
};
