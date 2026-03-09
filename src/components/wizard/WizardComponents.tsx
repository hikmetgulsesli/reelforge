"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export interface Scene {
  id: string;
  number: number;
  image: string;
  description: string;
  duration: number;
}

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
}

export function WizardProgress({
  currentStep,
  totalSteps,
  stepNames = [
    "Script",
    "Visuals",
    "Assets",
    "Voice",
    "Subtitles",
    "Music",
    "Review",
  ],
}: WizardProgressProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          Step {currentStep} of {totalSteps}: {stepNames[currentStep - 1]}
        </p>
        <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
          {progress}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-primary-light)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--color-primary)",
          }}
        />
      </div>
    </div>
  );
}

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showPrevious?: boolean;
  showRegenerateAll?: boolean;
  onRegenerateAll?: () => void;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  nextLabel = "Continue",
  showPrevious = true,
  showRegenerateAll = false,
  onRegenerateAll,
}: WizardNavigationProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-end items-center gap-4 mt-auto pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
      {showPrevious && currentStep > 1 && (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-3 rounded-lg font-bold"
          style={{
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
          }}
        >
          Previous
        </Button>
      )}
      {showRegenerateAll && (
        <Button
          variant="outline"
          onClick={onRegenerateAll}
          className="px-6 py-3 rounded-lg font-bold"
          style={{
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
          }}
        >
          Regenerate All
        </Button>
      )}
      <Button
        onClick={onNext}
        className="px-6 py-3 rounded-lg font-bold flex items-center gap-2"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "white",
        }}
      >
        {nextLabel}
        <span className="material-symbols-outlined text-[20px]">
          arrow_forward
        </span>
      </Button>
    </div>
  );
}

export function SceneCard({
  scene,
  onRegenerate,
}: {
  scene: Scene;
  onRegenerate?: (sceneId: string) => void;
}) {
  return (
    <div
      className="flex-none w-72 rounded-xl shadow-lg overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="w-full aspect-video bg-cover bg-center relative group"
        style={{ backgroundImage: `url("${scene.image}")` }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <span className="material-symbols-outlined text-white text-4xl cursor-pointer">
            zoom_in
          </span>
        </div>
        <div
          className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          {scene.duration.toFixed(1)}s
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Scene {scene.number.toString().padStart(2, "0")}</h3>
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
          >
            {scene.number}
          </span>
        </div>
        <p
          className="text-sm line-clamp-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          {scene.description}
        </p>
        <Button
          variant="outline"
          onClick={() => onRegenerate?.(scene.id)}
          className="flex items-center justify-center gap-2 w-full mt-auto"
          style={{
            backgroundColor: "var(--color-surface-hover)",
          }}
        >
          <span className="material-symbols-outlined text-[18px]">autorenew</span>
          Regenerate
        </Button>
      </div>
    </div>
  );
}
