"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { WizardProgress, WizardNavigation, SceneCard, Scene } from "./WizardComponents";

interface AssetsStepProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AssetsStep({ onNext, onPrevious }: AssetsStepProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes] = useState<Scene[]>([
    {
      id: "1",
      number: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKkvIKiOg2SPHf2vYbfGRvvgdSOZMkOzKJm3yegkqaaV30i3u096GPQAUmICsid318tMbEOY5d-BlmmX2EfhlI7OkGf-JfRdn8WYv5YbMmMv671FjakJM46rll0GsqmAWDE1BXCH0JV78zCrX2JfLiDXQ5YGg3zOBqiOn6XHp7A-649d4o1v3pbUJ86LJR6NMkd43UKBKXYfkTwVIJRSmnB3pE6eOj1z2UVKdhI3I91eaMAtUqSd4L10YDvVR-3fXGRV60-kHv",
      description: "Establishing shot of the futuristic cityscape at dawn.",
      duration: 5.0,
    },
    {
      id: "2",
      number: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJjsFNeCAT9TnTX75XK6HwVpyGTgUZfinjxrc2vOZ2GJCyce1FNkOgO66VW1FCdLfuPrjBo5_TL1QhFFOhfdDfeyGsisI7JUObFnoBq6H26nLAPlwdt61qbfjFf71zkH-ECj1jQ_DZplfNw9sIa-wqVBr9NIScm-v2hlg9IEJQCQLigzup0qhSV6xyFWCQUjXgkzdO5KrtqE2jQAkApQDAO4x9KRihV_S_8vpQUeKcLp_6o9QVCfbjG5s9Kn1AB7JPbSpGBNTl",
      description: "Close up on the glowing data core pulsing with energy.",
      duration: 4.5,
    },
    {
      id: "3",
      number: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcYR7BOaEtMk89e8o5RUjhvQJre59H5pU7KzRuU_qFcVYlw3wqizcAMpeF_dAQhHTIJlbtNLd3rFHef48pX2QgIU4N_LgICYIYCKU9hKKZxUF1lAsqpsbs2bQ2e0Daaa5N1HEeF0Iq8SdrCPNjOMMgHuWZrFSucdyU2cfDxND_Ue-KWYMIH57NMmXFQXOw-fCxlNZvbEGOls4CaUfqJC8uWI-PZzARIoH3GyUsBUewWW2Pc4QMmIG5KR34_Qxjczlv83HRCMq0",
      description: "Fast pan tracking the light trails through the neon grid.",
      duration: 6.0,
    },
    {
      id: "4",
      number: 4,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC44qUQYHeuj14Ribh9eMbYcz9bIr0504Fd0mDgU04WSA8uLaCL5wv2y9qKW6dp-BqLi95pKea5FaTDAzOtPXX58HONZ3hChsA9m2q-lmu6peniIuI_prZUFr8nSfVFlgZz3gkIFrSyNi4wOZVwM8Yq4oknD6vWafrKip3zBYrjEx9llSZrFUlXZSuKUwZx5Yiwj1AvJby2BdgI99DNRonkDwBL0pRNZupHD-oqy33GK9IRTO2OO2QhgTGURNZw7a2HHhxnCyOa",
      description: "Fluid transformation sequence morphing into the brand logo.",
      duration: 3.5,
    },
    {
      id: "5",
      number: 5,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeOvUW9KO7dBFpWG55AMO7EVDN_aLbh5YtHdOWLa3H5U5Xz9Q2RbujEiJkmK1ojssziD7yO9-APTxW3F-4CzXLKG1cXkCYbuqERqkMWRgPbkoZoxkxcsMxAZXst1uPANFNBRucNXopZj9EJOGBCdpZVYxI4AVPVDE9WblAehwyS4DShtQ1WxiErK7YGqNbDAr5DJN3t0ISUMGiDGMG0j_RX5gDw--Q9ex_8JlS1yXCsrmw1nv_mrtuSBI2DG4KBYzi-S1oCpqw",
      description: "Fade out on the metallic texture with final title overlay.",
      duration: 5.5,
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate AI image generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const handleRegenerate = (sceneId: string) => {
    // Simulate regenerating a single scene
    console.log("Regenerating scene:", sceneId);
  };

  const handleRegenerateAll = () => {
    // Simulate regenerating all scenes
    console.log("Regenerating all scenes");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop - would upload to server
    console.log("Files dropped:", e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <WizardProgress currentStep={3} totalSteps={7} />

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Generated Scenes</h1>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
            AI-generated visuals based on your script and style selection
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          style={{
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          <span className="material-symbols-outlined text-xl">play_circle</span>
          Preview Slideshow
        </Button>
      </div>

      {/* AI Generation Prompt */}
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <h3 className="font-bold mb-4">Generate New Assets</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the scene you want to generate..."
            className="flex-1 px-4 py-3 rounded-lg border"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-border)",
              color: "var(--text-main)",
            }}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">
                  sync
                </span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">auto_awesome</span>
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Timeline / Scene Cards */}
      <div className="flex-1 relative mb-8">
        {/* Timeline Line (desktop only) */}
        <div
          className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 z-0 hidden lg:block rounded-full"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        />

        <div
          className={`flex overflow-x-auto gap-6 pb-6 pt-2 z-10 relative snap-x px-2 ${
            isDragging ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ scrollbarWidth: "none" }}
        >
          {scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>
      </div>

      {/* Business Only: Manual Upload */}
      <div
        className="p-6 rounded-xl border-2 border-dashed"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl mb-2" style={{ color: "var(--color-text-muted)" }}>
            cloud_upload
          </span>
          <p className="font-medium mb-1">
            Upload Your Own Assets
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Drag and drop images or click to browse • Business plan only
          </p>
        </div>
      </div>

      {/* Navigation */}
      <WizardNavigation
        currentStep={3}
        totalSteps={7}
        onPrevious={onPrevious}
        onNext={onNext}
        nextLabel="Continue to Voiceover"
        showRegenerateAll
        onRegenerateAll={handleRegenerateAll}
      />
    </div>
  );
}
