// A/B Testing Types

export type ABTestStatus = 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  status: ABTestStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  videoId?: string;
  winnerId?: string;
  variants?: ABVariant[];
}

export interface ABVariant {
  id: string;
  name: string;
  description?: string;
  testId: string;
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  retention: number;
  isControl: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateABTestInput {
  name: string;
  description?: string;
  videoId?: string;
  variants: {
    name: string;
    description?: string;
    isControl?: boolean;
  }[];
}

export interface UpdateABTestInput {
  name?: string;
  description?: string;
  status?: ABTestStatus;
  startDate?: Date;
  endDate?: Date;
  winnerId?: string;
}

export interface ABTestMetrics {
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  retention: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  statisticalSignificance: number;
}
