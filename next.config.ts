import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite que next/image sirva imagens enviadas pelo admin e hospedadas no Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
