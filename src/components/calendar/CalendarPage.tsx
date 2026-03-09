'use client';

import React, { useState, useMemo } from 'react';
import { useCalendarStore } from '@/lib/calendar-store';
import { ScheduledVideo, VideoStatus, Platform } from '@/types/calendar';

// Icons as SVG components (using material symbols style)
const Icons = {
  chevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  add: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  calendar: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
  videoLibrary: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  analytics: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  person: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  playCircle: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  ),
  schedule: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  moreVert: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),
  close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  expandMore: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  ),
  addCircle: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  ),
  movieFilter: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
    </svg>
  ),
};

const statusColors: Record<VideoStatus, string> = {
  planned: 'bg-gray-500',
  processing: 'bg-yellow-500',
  ready: 'bg-red-500',
  published: 'bg-green-500',
};

const platformIcons: Record<Platform, string> = {
  youtube: 'Y',
  tiktok: 'T',
  instagram: 'I',
};

interface CalendarDayCellProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  videos: ScheduledVideo[];
  onClick: () => void;
  onVideoClick: (video: ScheduledVideo) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  isDragTarget: boolean;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  isCurrentMonth,
  isToday,
  videos,
  onClick,
  onVideoClick,
  onDrop,
  onDragOver,
  isDragTarget,
}) => {
  return (
    <div
      className={`
        border-b border-r border-border p-2 min-h-[120px] relative group cursor-pointer
        transition-colors
        ${!isCurrentMonth ? 'bg-surface-darker/30' : ''}
        ${isToday ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''}
        ${isDragTarget ? 'bg-primary/10 ring-2 ring-primary ring-inset' : ''}
        hover:bg-surface-darker/50
      `}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <span
        className={`
          text-sm font-medium
          ${!isCurrentMonth ? 'text-text-muted/50' : isToday ? 'flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white' : 'text-text-muted'}
        `}
      >
        {day}
      </span>
      
      <div className="flex flex-col gap-1 mt-1">
        {videos.map((video) => (
          <div
            key={video.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('videoId', video.id);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onVideoClick(video);
            }}
            className={`
              bg-surface rounded border border-border p-1.5 flex flex-col gap-1 cursor-grab hover:border-primary/50 transition-colors
              ${video.status === 'processing' ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full shrink-0 ${statusColors[video.status]}`} />
              <span className="text-xs text-white truncate font-medium">
                {video.title}
              </span>
            </div>
            <span className="text-[10px] text-text-muted ml-3.5">
              {video.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      {/* Add button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Icons.addCircle />
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { videos } = useCalendarStore();
  
  const upcomingVideos = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return videos
      .filter(v => v.scheduledAt >= today)
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
      .slice(0, 10);
  }, [videos]);

  const formatDateHeader = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <aside className="w-80 border-l border-border bg-surface-darker flex flex-col shrink-0">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold font-display text-white">Upcoming Posts</h3>
        <button className="text-text-muted hover:text-white transition-colors">
          <Icons.filter />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {upcomingVideos.length === 0 ? (
          <div className="text-center text-text-muted py-8">
            <p className="text-sm">No scheduled videos</p>
          </div>
        ) : (
          upcomingVideos.map((video, idx) => {
            const prevVideo = idx > 0 ? upcomingVideos[idx - 1] : null;
            const showDateHeader = !prevVideo || 
              video.scheduledAt.toDateString() !== prevVideo.scheduledAt.toDateString();
            
            return (
              <React.Fragment key={video.id}>
                {showDateHeader && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-white uppercase tracking-wider">
                      {formatDateHeader(video.scheduledAt)}
                    </div>
                    <div className="h-px bg-border flex-1" />
                  </div>
                )}
                <div className="bg-surface border border-border rounded-xl p-3 flex gap-3 hover:border-primary/50 transition-colors group cursor-pointer">
                  <div className="w-16 h-20 bg-background-dark rounded-lg overflow-hidden shrink-0 border border-border relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-surface-darker" />
                    <span className="material-symbols-outlined absolute inset-0 m-auto w-fit h-fit text-white/50 group-hover:text-white transition-colors">
                      play_circle
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 justify-center py-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                        {video.title}
                      </h4>
                      <button className="text-text-muted hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icons.moreVert />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="flex items-center gap-1 text-xs text-text-muted bg-surface-darker px-1.5 py-0.5 rounded">
                        <Icons.schedule />
                        {video.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {video.platforms.map((platform) => (
                        <div
                          key={platform}
                          className={`
                            w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold
                            ${platform === 'youtube' ? 'bg-red-500' : platform === 'tiktok' ? 'bg-black ring-1 ring-white/20' : 'bg-purple-500'}
                          `}
                        >
                          {platformIcons[platform]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </aside>
  );
};

const QuickAddModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}> = ({ isOpen, onClose, selectedDate }) => {
  const { videos, addVideo } = useCalendarStore();
  const [formData, setFormData] = useState({
    date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    time: '12:00',
    videoId: '',
    platforms: ['youtube'] as Platform[],
  });

  const handleSubmit = () => {
    if (!formData.videoId) return;
    
    const video = videos.find(v => v.id === formData.videoId);
    if (!video) return;

    const [hours, minutes] = formData.time.split(':').map(Number);
    const newDate = new Date(formData.date);
    newDate.setHours(hours, minutes, 0, 0);

    addVideo({
      ...video,
      id: `new-${Date.now()}`,
      scheduledAt: newDate,
      status: 'planned',
      platforms: formData.platforms,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface-darker border border-border rounded-2xl w-full max-w-md shadow-2xl shadow-primary/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-white">Quick Schedule</h3>
          <button className="text-text-muted hover:text-white" onClick={onClose}>
            <Icons.close />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Date & Time</label>
            <div className="flex gap-3">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-white w-full text-sm focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-white w-full text-sm focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Select Video from Library</label>
            <div className="relative">
              <select
                value={formData.videoId}
                onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg pl-3 pr-10 py-2.5 text-white text-sm appearance-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a generated video...</option>
                {videos.map((v) => (
                  <option key={v.id} value={v.id}>{v.title} ({v.status})</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Icons.expandMore />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Platforms</label>
            <div className="flex gap-4">
              {(['youtube', 'tiktok', 'instagram'] as Platform[]).map((platform) => (
                <label key={platform} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, platforms: [...formData.platforms, platform] });
                      } else {
                        setFormData({ ...formData, platforms: formData.platforms.filter(p => p !== platform) });
                      }
                    }}
                    className="rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-background-dark"
                  />
                  <span className="text-sm text-white capitalize">{platform}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-border bg-surface/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white hover:bg-surface rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const {
    currentDate,
    view,
    setView,
    videos,
    statusFilter,
    setStatusFilter,
    goToToday,
    goToPrevious,
    goToNext,
    moveVideo,
  } = useCalendarStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: Array<{
      date: Date;
      dayOfMonth: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      videos: ScheduledVideo[];
    }> = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filteredVideos = statusFilter === 'all' 
      ? videos 
      : videos.filter(v => v.status === statusFilter);
    
    const searchFiltered = searchQuery
      ? filteredVideos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : filteredVideos;
    
    const current = new Date(startDate);
    while (current <= endDate) {
      const dayVideos = searchFiltered.filter(v => 
        v.scheduledAt.toDateString() === current.toDateString()
      );
      
      days.push({
        date: new Date(current),
        dayOfMonth: current.getDate(),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.getTime() === today.getTime(),
        videos: dayVideos,
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, videos, statusFilter, searchQuery]);

  const monthYearLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setModalDate(date);
    setIsModalOpen(true);
  };

  const handleVideoClick = (video: ScheduledVideo) => {
    console.log('Video clicked:', video.id);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDragTarget(date.toISOString());
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const videoId = e.dataTransfer.getData('videoId');
    if (videoId) {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        const newDate = new Date(date);
        newDate.setHours(video.scheduledAt.getHours(), video.scheduledAt.getMinutes());
        moveVideo(videoId, newDate);
      }
    }
    setDragTarget(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background dark">
      {/* Left Sidebar */}
      <aside className="w-64 bg-surface-darker border-r border-border flex flex-col h-screen shrink-0 font-display">
        <div className="p-6 flex items-center gap-3">
          <div className="text-primary" style={{ fontSize: '1.875rem' }}>movie_filter</div>
          <h1 className="text-2xl font-bold tracking-tight text-white">ReelForge</h1>
        </div>
        <div className="px-4 py-2 flex items-center gap-3">
          <div className="bg-surface aspect-square rounded-full w-10 h-10 border border-border flex items-center justify-center text-text-muted">
            <Icons.person />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">Creator Studio</span>
            <span className="text-text-muted text-xs">Pro Plan</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-4 py-6 mt-4">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:bg-surface hover:text-white transition-colors">
            <Icons.dashboard />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a href="/calendar" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary">
            <Icons.calendar />
            <span className="text-sm font-medium">Calendar</span>
          </a>
          <a href="/library" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:bg-surface hover:text-white transition-colors">
            <Icons.videoLibrary />
            <span className="text-sm font-medium">Library</span>
          </a>
          <a href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:bg-surface hover:text-white transition-colors">
            <Icons.analytics />
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <a href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:bg-surface hover:text-white transition-colors">
            <Icons.settings />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="bg-surface rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted">Storage</span>
              <span className="text-white font-medium">75%</span>
            </div>
            <div className="h-1.5 bg-surface-darker rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full" />
            </div>
            <span className="text-xs text-text-muted">15GB / 20GB used</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-display text-white">{monthYearLabel}</h2>
            <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
              <button 
                onClick={goToPrevious}
                className="p-1 rounded text-text-muted hover:text-white hover:bg-surface-darker transition-colors"
              >
                <Icons.chevronLeft />
              </button>
              <button 
                onClick={goToToday}
                className="px-3 py-1 text-sm font-medium text-white hover:bg-surface-darker rounded transition-colors"
              >
                Today
              </button>
              <button 
                onClick={goToNext}
                className="p-1 rounded text-text-muted hover:text-white hover:bg-surface-darker transition-colors"
              >
                <Icons.chevronRight />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-surface rounded-lg p-1">
              {(['month', 'week', 'list'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`
                    px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${view === v 
                      ? 'bg-surface-darker text-white shadow-sm' 
                      : 'text-text-muted hover:text-white'}
                  `}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="relative w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Icons.search />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schedule..."
                className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VideoStatus | 'all')}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="published">Published</option>
            </select>
            <button
              onClick={() => {
                setModalDate(undefined);
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
            >
              <Icons.add />
              New Schedule
            </button>
          </div>
        </header>

        {/* Calendar Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col bg-background overflow-y-auto">
            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-border bg-surface-darker/50 shrink-0">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Cells */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 auto-rows-fr">
              {calendarDays.map((day, idx) => (
                <CalendarDayCell
                  key={idx}
                  day={day.dayOfMonth}
                  isCurrentMonth={day.isCurrentMonth}
                  isToday={day.isToday}
                  videos={day.videos}
                  onClick={() => handleDayClick(day.date)}
                  onVideoClick={handleVideoClick}
                  onDrop={(e) => handleDrop(e, day.date)}
                  onDragOver={(e) => handleDragOver(e, day.date)}
                  isDragTarget={dragTarget === day.date.toISOString()}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={modalDate}
      />
    </div>
  );
};

export default CalendarPage;
