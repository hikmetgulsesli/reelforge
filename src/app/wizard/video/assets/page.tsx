"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Asset {
  id: string;
  url: string;
  description: string;
  duration: number;
}

const SAMPLE_ASSETS: Asset[] = [
  { id: "1", url: "https://picsum.photos/seed/scene1/400/225", description: "Futuristic cityscape at dawn", duration: 5.0 },
  { id: "2", url: "https://picsum.photos/seed/scene2/400/225", description: "Glowing data core pulsing with energy", duration: 4.5 },
  { id: "3", url: "https://picsum.photos/seed/scene3/400/225", description: "Neon light trails through the grid", duration: 6.0 },
  { id: "4", url: "https://picsum.photos/seed/scene4/400/225", description: "Fluid transformation sequence", duration: 3.5 },
  { id: "5", url: "https://picsum.photos/seed/scene5/400/225", description: "Metallic texture with abstract patterns", duration: 5.5 },
  { id: "6", url: "https://picsum.photos/seed/scene6/400/225", description: "Abstract geometric shapes", duration: 4.0 },
];

export default function AssetsPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI image generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAssets: Asset[] = Array.from({ length: 4 }, (_, i) => ({
      id: `generated-${Date.now()}-${i}`,
      url: `https://picsum.photos/seed/${Date.now() + i}/400/225`,
      description: prompt,
      duration: 5.0,
    }));
    
    setAssets([...newAssets, ...assets]);
    setIsGenerating(false);
  };

  const handleRegenerate = async (id: string) => {
    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newUrl = `https://picsum.photos/seed/${Date.now()}/400/225`;
    setAssets(assets.map(a => a.id === id ? { ...a, url: newUrl } : a));
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAssets(newSelected);
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
    // Handle file upload - would integrate with actual upload logic
    alert("File upload would be handled here. This is a Business feature.");
  };

  const handlePrev = () => {
    // Navigate to previous step
    console.log("Navigate to Step 2 - Visuals");
  };

  const handleNext = () => {
    // Navigate to next step
    console.log("Navigate to Step 4 - Voice");
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-body">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-10 py-3 bg-background-light dark:bg-background-dark z-10 sticky top-0">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-text-light dark:text-text-dark">ReelForge</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-text-light dark:text-text-dark text-sm font-medium hover:text-primary" href="#">Dashboard</a>
            <a className="text-text-light dark:text-text-dark text-sm font-medium hover:text-primary" href="#">Projects</a>
            <a className="text-text-light dark:text-text-dark text-sm font-medium hover:text-primary" href="#">Templates</a>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-light dark:border-border-dark" />
        </div>
      </header>

      <div className="layout-container flex flex-col max-w-[1200px] mx-auto w-full px-6 py-8">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl font-bold text-text-light dark:text-text-dark">Project Creation Wizard</h3>
            <span className="text-sm text-text-muted font-medium">Step 3 of 7</span>
          </div>
          <div className="flex items-center w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              <span className="absolute top-10 text-xs font-medium text-primary whitespace-nowrap">Script</span>
            </div>
            <div className="flex-1 h-1 bg-primary/20 mx-2 rounded-full"><div className="h-full bg-primary rounded-full w-full"></div></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
              <span className="absolute top-10 text-xs font-medium text-primary whitespace-nowrap">Visuals</span>
            </div>
            <div className="flex-1 h-1 bg-primary/20 mx-2 rounded-full"><div className="h-full bg-primary rounded-full w-full"></div></div>
            
            {/* Step 3 - Current */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
              <span className="absolute top-10 text-xs font-medium text-primary whitespace-nowrap">Assets</span>
            </div>
            <div className="flex-1 h-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark mx-2 rounded-full"></div>
            
            {/* Steps 4-7 */}
            {[4, 5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-muted flex items-center justify-center font-bold text-sm">{step}</div>
                </div>
                {step < 7 && <div className="flex-1 h-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark mx-2 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <h1 className="text-3xl font-display font-bold text-text-light dark:text-text-dark">Generate & Review Assets</h1>
          </div>

          {/* Prompt Input Section */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 mb-6 border border-border-light dark:border-border-dark">
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Image Generation Prompt
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the visual assets you want to generate (e.g., 'futuristic cityscape at dawn, neon lights')"
                className="flex-1 px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span> Generating...
                  </span>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>

          {/* Generated Assets Grid */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Generated Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset, index) => (
                <div 
                  key={asset.id} 
                  className={cn(
                    "bg-white dark:bg-slate-800 rounded-xl shadow-lg border overflow-hidden flex flex-col transition-transform hover:scale-[1.02]",
                    selectedAssets.has(asset.id) && "ring-2 ring-primary"
                  )}
                >
                  <div className="relative group aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${asset.url})` }}>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-4xl cursor-pointer">zoom_in</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
                      {asset.duration}s
                    </div>
                    <button
                      onClick={() => toggleSelect(asset.id)}
                      className={cn(
                        "absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                        selectedAssets.has(asset.id) 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white/80 border-gray-300 hover:border-primary"
                      )}
                    >
                      {selectedAssets.has(asset.id) && "✓"}
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-text-light dark:text-text-dark">Scene {String(index + 1).padStart(2, '0')}</h3>
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2">{asset.description}</p>
                    <button 
                      onClick={() => handleRegenerate(asset.id)}
                      className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 py-2 rounded-lg font-medium transition-colors mt-auto"
                    >
                      <span className="material-symbols-outlined text-[18px]">autorenew</span>
                      Regenerate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Upload (Business Only) */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center mb-8 transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-border-light dark:border-border-dark",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">cloud_upload</span>
            <p className="text-text-light dark:text-text-dark font-medium mb-1">
              Manual Upload (Business Only)
            </p>
            <p className="text-sm text-text-muted">
              Drag and drop images here, or click to browse
            </p>
          </div>

          {/* Asset Timeline */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Asset Timeline</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {assets.slice(0, 6).map((asset, index) => (
                <div 
                  key={asset.id}
                  className="flex-none w-32 bg-surface-light dark:bg-surface-dark rounded-lg p-2 border border-border-light dark:border-border-dark cursor-grab active:cursor-grabbing"
                >
                  <div className="aspect-video bg-cover bg-center rounded mb-2" style={{ backgroundImage: `url(${asset.url})` }} />
                  <p className="text-xs font-medium text-text-light dark:text-text-dark truncate">
                    Scene {index + 1}
                  </p>
                  <p className="text-xs text-text-muted">{asset.duration}s</p>
                </div>
              ))}
              {/* Add Scene Button */}
              <div className="flex-none w-32 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-3xl text-text-muted">add</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handlePrev}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              Next Step
              <span className="material-symbols-outlined">arrow_forward</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
