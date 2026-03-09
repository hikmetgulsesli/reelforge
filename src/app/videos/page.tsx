import { Metadata } from "next";
import VideoLibraryClient from "./VideoLibraryClient";

export const metadata: Metadata = {
  title: "ReelForge - Video Library",
  description: "Manage and view your generated videos",
};

export default function VideoLibraryPage() {
  return <VideoLibraryClient />;
}
