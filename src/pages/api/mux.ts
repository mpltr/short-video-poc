// pages/api/mux.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Mux } from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export type MuxType = {
  id: string;
  playbackId: string | null;
  duration: number | undefined;
  thumbnail: string | null;
  createdAt: string;
  status: "preparing" | "ready" | "errored";
};

export type MuxesType = MuxType[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MuxesType>
) {
  try {
    const assetsPage = await mux.video.assets.list({ limit: 3 });
    const formatted = assetsPage.data.map((asset) => ({
      id: asset.id,
      playbackId: asset.playback_ids?.[0]?.id || null,
      duration: asset.duration,
      createdAt: asset.created_at,
      status: asset.status,
      thumbnail: asset.playback_ids?.[0]
        ? `https://image.mux.com/${asset.playback_ids[0].id}/thumbnail.jpg`
        : null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("MUX API Error:", error);
    res.status(500).json({ error: "Failed to fetch Mux video data" });
  }
}
