import type { NextConfig } from "next";
import path from "path";
import { config } from "dotenv";

// Load credentials from hidden secure folder first
config({ path: path.join(process.cwd(), "._secure_keys", "credentials.env") });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
