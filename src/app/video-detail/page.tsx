'use client';

import { useState } from 'react';
import { 
  Play, 
  Volume2, 
  Settings, 
  Maximize, 
  Download, 
  Trash2, 
  Copy, 
  Clock, 
  Calendar,
  Timer,
  Palette,
  Mic,
  CreditCard,
  Youtube,
  Music,
  Camera,
  Save
} from 'lucide-react';

// Mock video data
const mockVideo = {
  id: 'x7b9q2p',
  title: 'Anime Style Exploration',
  description: 'Exploring neon cityscapes with anime-inspired aesthetics. Generated using the v4 rendering engine with detailed background prompts.',
  createdAt: 'Oct 24, 2023',
  project: 'Personal',
  duration: '60s',
  style: 'Anime Style',
  voice: 'Sarah',
  creditsUsed: 1,
  views: 1243,
  likes: 89,
  tags: 'anime, cyberpunk, neon, city, exploration',
  thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDlKe-SEXeLV8D3osxBIPdU9s8MyVzpoQ9uTWyB81-zQS0JByq9RTN-Gbb6OAM2hCv09tapX0jLkHhOmB6FRIsVYyzY54PUKaBsc5nG6ntpDzm0dMB8UuL_LvuIThG8Px0OMtQcILMFw0PeZ8Cmcg67CGnBYHcZsDMTC9cncqZA0HTA2b1kSC6AiGIfek4aaRTCmSCuLyQ1CMzAOClDNsX-wQUFQ86vdsgzw60XrkTtw9XZdNj1XF8VqolkH0tlYmJyhNkztXL',
  shareLink: 'reelforge.ai/v/x7b9q2p'
};

export default function VideoDetailPage() {
  const [title, setTitle] = useState(mockVideo.title);
  const [description, setDescription] = useState(mockVideo.description);
  const [tags, setTags] = useState(mockVideo.tags);
  const [views, setViews] = useState(mockVideo.views);
  const [likes, setLikes] = useState(mockVideo.likes);
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleSave = () => {
    console.log('Saving:', { title, description, tags });
  };

  const handleDelete = () => {
    console.log('Deleting video');
    setShowDeleteConfirm(false);
  };

  const handleDuplicate = () => {
    console.log('Duplicating video');
  };

  const handleDownload = (quality: 'hd' | '4k') => {
    console.log('Downloading:', quality);
  };

  const handlePublish = (platform: 'youtube' | 'tiktok' | 'instagram') => {
    console.log('Publishing to:', platform);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(mockVideo.shareLink);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Center Column: Video & Details */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-100 font-display text-2xl sm:text-3xl font-bold leading-tight truncate">
              {title}
            </h2>
            <p className="text-text-muted text-sm font-normal">
              Created on {mockVideo.createdAt} • Project: {mockVideo.project}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleDuplicate}
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-surface-dark hover:bg-surface-dark/80 text-slate-100 text-sm font-medium transition-colors"
            >
              <Copy className="mr-2 w-4 h-4" />
              Duplicate
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-surface-dark hover:bg-surface-dark/80 text-primary text-sm font-medium transition-colors"
            >
              <Trash2 className="mr-2 w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div 
          className="relative bg-surface-dark rounded-xl overflow-hidden aspect-video shadow-lg border border-border-dark group flex items-center justify-center"
          style={{ backgroundImage: `url(${mockVideo.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Big Play Button overlay */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute z-10 flex items-center justify-center rounded-full size-16 bg-black/50 text-slate-100 backdrop-blur-sm hover:bg-primary/80 transition-all transform hover:scale-105"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>

          {/* Controls bar */}
          <div 
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity flex flex-col gap-2 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Progress */}
            <div className="flex h-4 items-center cursor-pointer group/progress relative">
              <div className="h-1.5 w-full rounded-full bg-slate-500/50 flex overflow-hidden">
                <div className="h-full bg-primary w-1/3 rounded-full relative"></div>
              </div>
              <div className="absolute left-1/3 -ml-2 size-4 rounded-full bg-slate-100 shadow scale-0 group-hover/progress:scale-100 transition-transform"></div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between text-slate-100">
              <div className="flex items-center gap-4">
                <button className="hover:text-primary transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 group/vol">
                  <button className="hover:text-primary transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div className="w-16 h-1 bg-slate-500/50 rounded-full hidden group-hover/vol:block cursor-pointer">
                    <div className="w-2/3 h-full bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs font-medium">0:20 / {mockVideo.duration}</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="hover:text-primary transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="hover:text-primary transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 py-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs text-slate-300 font-medium">
            <Timer className="w-3 h-3 mr-1" /> {mockVideo.duration}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs text-slate-300 font-medium">
            <Palette className="w-3 h-3 mr-1" /> {mockVideo.style}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-dark border border-border-dark text-xs text-slate-300 font-medium">
            <Mic className="w-3 h-3 mr-1" /> Voice: {mockVideo.voice}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary font-medium">
            <CreditCard className="w-3 h-3 mr-1" /> {mockVideo.creditsUsed} Credit Used
          </span>
        </div>

        {/* Statistics Section */}
        <div className="flex flex-wrap gap-4 py-4 border-b border-border-dark pb-6">
          <div className="flex-1 min-w-[120px] bg-surface-dark border border-border-dark rounded-lg p-4">
            <p className="text-text-muted text-xs font-medium mb-1">Views</p>
            <p className="text-slate-100 text-2xl font-bold">{views.toLocaleString()}</p>
            <input
              type="number"
              value={views}
              onChange={(e) => setViews(parseInt(e.target.value) || 0)}
              className="mt-2 w-full bg-background-dark border border-border-dark rounded px-2 py-1 text-sm text-slate-100"
              placeholder="Update views"
            />
          </div>
          <div className="flex-1 min-w-[120px] bg-surface-dark border border-border-dark rounded-lg p-4">
            <p className="text-text-muted text-xs font-medium mb-1">Likes</p>
            <p className="text-slate-100 text-2xl font-bold">{likes.toLocaleString()}</p>
            <input
              type="number"
              value={likes}
              onChange={(e) => setLikes(parseInt(e.target.value) || 0)}
              className="mt-2 w-full bg-background-dark border border-border-dark rounded px-2 py-1 text-sm text-slate-100"
              placeholder="Update likes"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap gap-3 py-2">
          <button 
            onClick={() => handleDownload('hd')}
            className="flex-1 sm:flex-none flex items-center justify-center rounded-lg h-10 px-6 bg-surface-dark hover:bg-surface-dark/80 border border-border-dark text-slate-100 text-sm font-medium transition-colors"
          >
            <Download className="mr-2 w-4 h-4" />
            Download HD
          </button>
          <button 
            onClick={() => handleDownload('4k')}
            className="flex-1 sm:flex-none flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 text-slate-100 text-sm font-bold transition-colors shadow-lg shadow-primary/20"
          >
            <Download className="mr-2 w-4 h-4" />
            Download 4K
          </button>
        </div>

        {/* Editable Details */}
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <label className="text-slate-100 text-sm font-medium font-display" htmlFor="video-title">
              Video Title
            </label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input w-full rounded-lg bg-surface-dark border-border-dark text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 placeholder:text-text-muted transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-slate-100 text-sm font-medium font-display" htmlFor="video-desc">
              Description
            </label>
            <textarea
              id="video-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="form-textarea w-full rounded-lg bg-surface-dark border-border-dark text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted transition-colors resize-y"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-slate-100 text-sm font-medium font-display" htmlFor="video-tags">
              Tags
            </label>
            <input
              id="video-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-input w-full rounded-lg bg-surface-dark border-border-dark text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 placeholder:text-text-muted transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">Separate tags with commas</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Publishing */}
      <aside className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col gap-5">
          <h3 className="text-slate-100 font-display text-lg font-bold border-b border-border-dark pb-3">
            Publishing & Sharing
          </h3>

          {/* Social Integration */}
          <div className="flex flex-col gap-3">
            <h4 className="text-slate-300 text-sm font-medium">Quick Publish</h4>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handlePublish('youtube')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-background-dark border border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-300 hover:text-primary"
              >
                <Youtube className="w-6 h-6" />
                <span className="text-xs font-medium">YouTube</span>
              </button>
              <button 
                onClick={() => handlePublish('tiktok')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-background-dark border border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-300 hover:text-primary"
              >
                <Music className="w-6 h-6" />
                <span className="text-xs font-medium">TikTok</span>
              </button>
              <button 
                onClick={() => handlePublish('instagram')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-background-dark border border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-300 hover:text-primary"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-medium">Instagram</span>
              </button>
            </div>
          </div>

          {/* Scheduling */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border-dark">
            <div className="flex items-center justify-between">
              <h4 className="text-slate-300 text-sm font-medium">Schedule Release</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isScheduleEnabled}
                  onChange={(e) => setIsScheduleEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-background-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border-dark"></div>
              </label>
            </div>
            <div className={`flex flex-col gap-2 ${!isScheduleEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-4 h-4 text-text-muted" />
                </div>
                <input 
                  type="date" 
                  className="form-input bg-background-dark border border-border-dark text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                  disabled={!isScheduleEnabled}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock className="w-4 h-4 text-text-muted" />
                </div>
                <input 
                  type="time" 
                  className="form-input bg-background-dark border border-border-dark text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                  disabled={!isScheduleEnabled}
                />
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border-dark">
            <h4 className="text-slate-300 text-sm font-medium">Share Link</h4>
            <div className="flex relative">
              <input 
                className="form-input w-full bg-background-dark border border-border-dark text-slate-400 text-sm rounded-l-lg rounded-r-none focus:ring-primary focus:border-primary p-2.5 pr-12" 
                readOnly 
                type="text" 
                value={mockVideo.shareLink} 
              />
              <button 
                onClick={copyShareLink}
                className="absolute right-0 top-0 bottom-0 px-3 bg-surface-dark border-y border-r border-border-dark rounded-r-lg hover:bg-surface-dark/80 text-slate-300 hover:text-primary transition-colors flex items-center justify-center"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center rounded-lg h-11 bg-primary hover:bg-primary/90 text-slate-100 text-sm font-bold mt-2 transition-all"
          >
            <Save className="mr-2 w-4 h-4" />
            Save Changes
          </button>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-slate-100 font-display text-xl font-bold mb-4">Delete Video?</h3>
            <p className="text-text-muted mb-6">
              Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-surface-dark border border-border-dark text-slate-100 text-sm font-medium transition-colors hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-red-600 hover:bg-red-700 text-slate-100 text-sm font-medium transition-colors"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
