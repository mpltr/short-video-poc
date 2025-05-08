import { useState } from "react";
import { GetServerSideProps } from "next";
import Carousel from "@/components/Carousel";
import MuxCard from "@/components/MuxCard";
import MuxModal from "@/components/MuxModal";
import { MuxesType } from "./api/mux";

type Props = {
  videos: MuxesType;
};

export default function MuxPage({ videos }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="p-8">
      <Carousel>
        {videos.map((video, index) => (
          <MuxCard
            key={video.id}
            video={video}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </Carousel>

      {selectedIndex !== null && (
        <MuxModal
          videos={videos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={(i: number) => setSelectedIndex(i)}
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  videos: MuxesType;
}> = async (context) => {
  const { req } = context;

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/mux`);
  const videos: MuxesType = await res.json();

  return {
    props: {
      videos,
    },
  };
};
