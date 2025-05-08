import type { NextApiRequest, NextApiResponse } from "next";

export type VimeoType = {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  embedUrl: string;
};

export type VimeosType = VimeoType[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VimeosType>
) {
  const accessToken = process.env.VIMEO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json([]);
  }

  try {
    const vimeoRes = await fetch(
      "https://api.vimeo.com/me/videos?per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await vimeoRes.json();

    const videos: VimeosType = (json.data || []).map((video: any) => {
      const id = video.uri.split("/").pop();
      const title = video.name;
      const duration = video.duration;
      const thumbnail =
        video.pictures?.sizes?.[video.pictures.sizes.length - 1]?.link || "";

      // Extract hash from player_embed_url (e.g., ...video/1080492908?h=8af716daaf)
      const hashMatch = video.player_embed_url?.match(/\?h=([\w\d]+)/);
      const privacyHash = hashMatch?.[1] || "";

      const embedUrl = `https://player.vimeo.com/video/${id}?h=${privacyHash}`;

      return {
        id,
        title,
        duration,
        thumbnail,
        embedUrl,
      };
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching Vimeo videos:", error);
    res.status(500).json([]);
  }
}
