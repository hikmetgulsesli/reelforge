// Calendar utility functions

export interface ScheduledVideo {
  id: string;
  title: string;
  scheduledTime: string;
  platform: "youtube" | "tiktok" | "instagram";
  status: "planned" | "processing" | "ready" | "published";
  thumbnail?: string;
}

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  videos: ScheduledVideo[];
}

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getMonthName = (month: number): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month];
};

export const generateCalendarDays = (
  year: number,
  month: number,
  videos: ScheduledVideo[]
): CalendarDay[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const today = new Date();
  const days: CalendarDay[] = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    days.push({
      date,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
      isToday: false,
      videos: [],
    });
  }
  
  // Current month days
  for (let date = 1; date <= daysInMonth; date++) {
    const isToday =
      today.getDate() === date &&
      today.getMonth() === month &&
      today.getFullYear() === year;
    
    days.push({
      date,
      month,
      year,
      isCurrentMonth: true,
      isToday,
      videos: videos.filter((_, idx) => {
        // Demo: assign videos to specific days
        if (date === 5 && idx < 2) return true;
        if (date === 9 && idx === 2) return true;
        if (date === 13 && idx === 3) return true;
        return false;
      }),
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length;
  for (let date = 1; date <= remainingDays; date++) {
    days.push({
      date,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
      isToday: false,
      videos: [],
    });
  }
  
  return days;
};

export const getStatusColor = (status: ScheduledVideo["status"]): string => {
  switch (status) {
    case "planned":
      return "bg-purple-500";
    case "processing":
      return "bg-yellow-500";
    case "ready":
      return "bg-red-500";
    case "published":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const getPlatformIcon = (platform: ScheduledVideo["platform"]): string => {
  switch (platform) {
    case "youtube":
      return "Y";
    case "tiktok":
      return "T";
    case "instagram":
      return "I";
    default:
      return "?";
  }
};
