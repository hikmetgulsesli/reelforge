"use client";

import { SubtitleWizard } from "@/components/subtitle/SubtitleWizard";
import { useRouter } from "next/navigation";

export default function SubtitleWizardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      <SubtitleWizard
        onNext={() => {
          // Navigate to next step (background music)
          router.push("/wizard/music");
        }}
        onBack={() => {
          // Navigate to previous step (voice selection)
          router.push("/wizard/voice");
        }}
      />
    </main>
  );
}
