'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
  Upload,
  X,
  Clock,
  GripVertical,
  Play,
  Plus,
  Trash2,
  ZoomIn,
  Loader2,
  Crown,
} from 'lucide-react';

interface AssetsStepProps {
  initialData?: AssetsStepData;
  onDataChange?: (data: AssetsStepData) => void;
  isBusinessUser?: boolean;
}

export interface Asset {
  id: string;
  url: string;
  thumbnail: string;
  duration: number; // in seconds
  description: string;
  order: number;
  isUploading?: boolean;
  isGenerating?: boolean;
}

export interface Scene {
  id: string;
  name: string;
  assets: Asset[];
  description: string;
}

export interface AssetsStepData {
  prompt: string;
  scenes: Scene[];
  uploadedAssets: Asset[];
  totalDuration: number;
}

// Mock scene data - in real app this would come from the script generation
const INITIAL_SCENES: Scene[] = [
  {
    id: 'scene-1',
    name: 'Sahne 01',
    description: 'Futuristik sehir silueti safakta.',
    assets: [],
  },
  {
    id: 'scene-2',
    name: 'Sahne 02',
    description: 'Parlayan veri cekirdegi yakindan goruntuleniyor.',
    assets: [],
  },
  {
    id: 'scene-3',
    name: 'Sahne 03',
    description: 'Neon izikleri hizli takip shot.',
    assets: [],
  },
  {
    id: 'scene-4',
    name: 'Sahne 04',
    description: 'Sivi donusum sekansi, marka logosuna morfoloji.',
    assets: [],
  },
];

const MAX_PROMPT_LENGTH = 500;

export function AssetsStep({
  initialData,
  onDataChange,
  isBusinessUser = false,
}: AssetsStepProps) {
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [scenes, setScenes] = useState<Scene[]>(initialData?.scenes || INITIAL_SCENES);
  const [uploadedAssets, setUploadedAssets] = useState<Asset[]>(
    initialData?.uploadedAssets || []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [draggedScene, setDraggedScene] = useState<string | null>(null);
  const [dragOverScene, setDragOverScene] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  const characterCount = prompt.length;
  const isOverLimit = characterCount > MAX_PROMPT_LENGTH;

  const totalDuration = useMemo(() => {
    return scenes.reduce((total, scene) => {
      return (
        total +
        scene.assets.reduce((sceneTotal, asset) => sceneTotal + asset.duration, 0)
      );
    }, 0);
  }, [scenes]);

  const handlePromptChange = useCallback((value: string) => {
    setPrompt(value);
  }, []);

  const generateMockAsset = useCallback(
    (sceneId: string, index: number): Asset => {
      const mockImages = [
        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=225&fit=crop',
      ];

      return {
        id: `asset-${sceneId}-${Date.now()}-${index}`,
        url: mockImages[index % mockImages.length],
        thumbnail: mockImages[index % mockImages.length],
        duration: 3 + Math.random() * 3,
        description: `AI generated image for ${sceneId}`,
        order: index,
        isGenerating: false,
      };
    },
    []
  );

  const handleGenerateAssets = useCallback(async () => {
    if (!prompt.trim() && scenes.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progressive generation
      const newScenes = [...scenes];
      const totalSteps = newScenes.length * 4; // 4 images per scene

      for (let sceneIndex = 0; sceneIndex < newScenes.length; sceneIndex++) {
        const newAssets: Asset[] = [];

        for (let assetIndex = 0; assetIndex < 4; assetIndex++) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          setGenerationProgress(
            Math.round(((sceneIndex * 4 + assetIndex + 1) / totalSteps) * 100)
          );

          newAssets.push(generateMockAsset(newScenes[sceneIndex].id, assetIndex));
        }

        newScenes[sceneIndex] = {
          ...newScenes[sceneIndex],
          assets: newAssets,
        };
        setScenes([...newScenes]);
      }

      onDataChange?.({
        prompt,
        scenes: newScenes,
        uploadedAssets,
        totalDuration: newScenes.reduce(
          (t, s) => t + s.assets.reduce((st, a) => st + a.duration, 0),
          0
        ),
      });
    } catch (error) {
      console.error('Error generating assets:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [prompt, scenes, uploadedAssets, onDataChange, generateMockAsset]);

  const handleRegenerateScene = useCallback(
    async (sceneId: string) => {
      setScenes((prevScenes) =>
        prevScenes.map((scene) =>
          scene.id === sceneId
            ? {
                ...scene,
                assets: scene.assets.map((a) => ({ ...a, isGenerating: true })),
              }
            : scene
        )
      );

      // Simulate regeneration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAssets = Array.from({ length: 4 }, (_, i) =>
        generateMockAsset(sceneId, i + Date.now())
      );

      setScenes((prevScenes) =>
        prevScenes.map((scene) =>
          scene.id === sceneId ? { ...scene, assets: newAssets } : scene
        )
      );

      onDataChange?.({
        prompt,
        scenes: scenes.map((s) =>
          s.id === sceneId ? { ...s, assets: newAssets } : s
        ),
        uploadedAssets,
        totalDuration,
      });
    },
    [prompt, scenes, uploadedAssets, totalDuration, onDataChange, generateMockAsset]
  );

  const handleDeleteAsset = useCallback(
    (sceneId: string, assetId: string) => {
      const newScenes = scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              assets: scene.assets.filter((a) => a.id !== assetId),
            }
          : scene
      );

      setScenes(newScenes);
      onDataChange?.({
        prompt,
        scenes: newScenes,
        uploadedAssets,
        totalDuration: newScenes.reduce(
          (t, s) => t + s.assets.reduce((st, a) => st + a.duration, 0),
          0
        ),
      });
    },
    [prompt, scenes, uploadedAssets, onDataChange]
  );

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || !isBusinessUser) return;

      const newAssets: Asset[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const asset: Asset = {
          id: `uploaded-${Date.now()}-${i}`,
          url: URL.createObjectURL(file),
          thumbnail: URL.createObjectURL(file),
          duration: 5,
          description: file.name,
          order: uploadedAssets.length + i,
          isUploading: true,
        };
        newAssets.push(asset);
      }

      setUploadedAssets((prev) => [...prev, ...newAssets]);

      // Simulate upload completion
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUploadedAssets((prev) =>
        prev.map((a) => (a.isUploading ? { ...a, isUploading: false } : a))
      );

      onDataChange?.({
        prompt,
        scenes,
        uploadedAssets: [...uploadedAssets, ...newAssets],
        totalDuration,
      });
    },
    [isBusinessUser, prompt, scenes, uploadedAssets, totalDuration, onDataChange]
  );

  // Drag and drop handlers for scene reordering
  const handleDragStart = useCallback((sceneId: string) => {
    setDraggedScene(sceneId);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, sceneId: string) => {
      e.preventDefault();
      if (draggedScene && draggedScene !== sceneId) {
        setDragOverScene(sceneId);
      }
    },
    [draggedScene]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedScene(null);
    setDragOverScene(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSceneId: string) => {
      e.preventDefault();
      if (!draggedScene || draggedScene === targetSceneId) {
        setDraggedScene(null);
        setDragOverScene(null);
        return;
      }

      const draggedIndex = scenes.findIndex((s) => s.id === draggedScene);
      const targetIndex = scenes.findIndex((s) => s.id === targetSceneId);

      const newScenes = [...scenes];
      const [draggedSceneData] = newScenes.splice(draggedIndex, 1);
      newScenes.splice(targetIndex, 0, draggedSceneData);

      setScenes(newScenes);
      onDataChange?.({
        prompt,
        scenes: newScenes,
        uploadedAssets,
        totalDuration,
      });

      setDraggedScene(null);
      setDragOverScene(null);
    },
    [draggedScene, scenes, prompt, uploadedAssets, totalDuration, onDataChange]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Varlik Secimi
        </h1>
        <p className="text-muted-foreground text-lg">
          AI ile gorsel uretin veya kendi varliklarinizi yukleyin. Her sahne icin
          birden fazla gorsel secilebilir.
        </p>
      </div>

      {/* Image Generation Prompt */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <label className="flex flex-col w-full mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground text-sm font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Gorsel Uretim Promptu
            </span>
            <span
              className={`text-sm font-medium ${
                isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'
              }`}
            >
              {characterCount}/{MAX_PROMPT_LENGTH}
            </span>
          </div>
          <textarea
            className={`w-full resize-y rounded-lg bg-background border-2 min-h-[100px] p-4 text-sm placeholder:text-muted-foreground/60 transition-colors ${
              isOverLimit
                ? 'border-destructive focus:ring-destructive'
                : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
            }`}
            placeholder="Ornek: Neon isikli futuristik sehir manzarasi, cyberpunk stili, koyu renkler..."
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
          />
        </label>

        <button
          onClick={handleGenerateAssets}
          disabled={isGenerating || isOverLimit}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uretiliyor... {generationProgress}%
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gorsel Uret
            </>
          )}
        </button>

        {/* Progress bar */}
        {isGenerating && (
          <div className="mt-4 h-2 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Manual Upload Zone (Business Only) */}
      {isBusinessUser && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-lg flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Upload className="w-5 h-5 text-primary" />
              Manuel Yukleme
            </h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Business
            </span>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Tiklayip yukleyin</span> veya surukle
                birak
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF, MP4 (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>

          {/* Uploaded Assets */}
          {uploadedAssets.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {uploadedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="relative aspect-video rounded-lg overflow-hidden border border-border group"
                >
                  <img
                    src={asset.thumbnail}
                    alt={asset.description}
                    className="w-full h-full object-cover"
                  />
                  {asset.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setUploadedAssets((prev) =>
                        prev.filter((a) => a.id !== asset.id)
                      );
                    }}
                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scene Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3
            className="font-bold text-lg flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Clock className="w-5 h-5 text-primary" />
            Sahne Zaman Cizgisi
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Toplam: {totalDuration.toFixed(1)}s
            </span>
            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-semibold transition-colors">
              <Play className="w-4 h-4" />
              Onizleme
            </button>
          </div>
        </div>

        {/* Timeline Line (Desktop) */}
        <div className="hidden lg:block relative mb-6">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-primary/20 -translate-y-1/2 rounded-full" />
        </div>

        {/* Scene Cards */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {scenes.map((scene, index) => {
            const hasAssets = scene.assets.length > 0;
            const isDragging = draggedScene === scene.id;
            const isDragOver = dragOverScene === scene.id;

            return (
              <div
                key={scene.id}
                draggable
                onDragStart={() => handleDragStart(scene.id)}
                onDragOver={(e) => handleDragOver(e, scene.id)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, scene.id)}
                className={`flex-none w-72 bg-background rounded-xl shadow-sm border-2 overflow-hidden flex flex-col snap-center transform transition-all hover:shadow-md ${
                  isDragging
                    ? 'opacity-50 scale-95'
                    : isDragOver
                      ? 'border-primary scale-105'
                      : 'border-border hover:border-primary/40'
                }`}
              >
                {/* Drag Handle */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/50">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <h4 className="font-bold text-sm">{scene.name}</h4>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                </div>

                {/* Asset Preview */}
                <div className="relative w-full aspect-video bg-surface">
                  {hasAssets ? (
                    <img
                      src={scene.assets[0].thumbnail}
                      alt={scene.name}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setPreviewAsset(scene.assets[0])}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Duration Badge */}
                  {hasAssets && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
                      {scene.assets[0].duration.toFixed(1)}s
                    </div>
                  )}

                  {/* Zoom Overlay */}
                  {hasAssets && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white cursor-pointer" />
                    </div>
                  )}
                </div>

                {/* Scene Info */}
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {scene.description}
                  </p>

                  {/* Asset Thumbnails Grid */}
                  {hasAssets && (
                    <div className="grid grid-cols-4 gap-1">
                      {scene.assets.slice(0, 4).map((asset, i) => (
                        <div
                          key={asset.id}
                          className="relative aspect-video rounded overflow-hidden border border-border group"
                        >
                          <img
                            src={asset.thumbnail}
                            alt={`${scene.name} - ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {asset.isGenerating && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAsset(scene.id, asset.id);
                            }}
                            className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Regenerate Button */}
                  {hasAssets && (
                    <button
                      onClick={() => handleRegenerateScene(scene.id)}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-2 w-full bg-surface hover:bg-surface-hover text-foreground py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Yeniden Uret
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewAsset(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setPreviewAsset(null)}
              className="absolute -top-10 right-0 text-white hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewAsset.url}
              alt={previewAsset.description}
              className="w-full rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <p className="font-medium">{previewAsset.description}</p>
              <p className="text-sm text-white/70">Sure: {previewAsset.duration.toFixed(1)}s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetsStep;