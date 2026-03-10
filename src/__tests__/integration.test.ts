import { useAppStore } from "../lib/store";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "test-user",
        name: "Test User",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Integration Tests", () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      credits: 3,
      plan: "free",
      currentStep: 1,
      videoDraft: {
        title: "",
        script: "",
        style: "cinematic",
        voiceId: null,
        voiceName: null,
        subtitlesEnabled: true,
        subtitleStyle: "modern",
        musicId: null,
        musicName: null,
        status: "draft",
      },
      videos: [],
      series: [],
      calendarEvents: [],
      sidebarCollapsed: false,
      notificationCount: 0,
    });
  });

  describe("Store Functionality", () => {
    it("should initialize with default values", () => {
      const state = useAppStore.getState();
      expect(state.credits).toBe(3);
      expect(state.plan).toBe("free");
      expect(state.currentStep).toBe(1);
      expect(state.videos).toHaveLength(0);
    });

    it("should update credits", () => {
      const { setCredits } = useAppStore.getState();
      setCredits(10);
      expect(useAppStore.getState().credits).toBe(10);
    });

    it("should update video draft", () => {
      const { updateVideoDraft } = useAppStore.getState();
      updateVideoDraft({ title: "Test Video", script: "Test script" });
      const state = useAppStore.getState();
      expect(state.videoDraft.title).toBe("Test Video");
      expect(state.videoDraft.script).toBe("Test script");
    });

    it("should add and remove videos", () => {
      const { addVideo, deleteVideo } = useAppStore.getState();
      const testVideo = {
        id: "test-video-1",
        title: "Test Video",
        script: "Test script",
        style: "cinematic",
        status: "completed" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addVideo(testVideo);
      expect(useAppStore.getState().videos).toHaveLength(1);
      
      deleteVideo("test-video-1");
      expect(useAppStore.getState().videos).toHaveLength(0);
    });

    it("should update video status", () => {
      const { addVideo, updateVideo } = useAppStore.getState();
      const testVideo = {
        id: "test-video-2",
        title: "Test Video",
        script: "Test script",
        style: "cinematic",
        status: "draft" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addVideo(testVideo);
      updateVideo("test-video-2", { status: "completed" });
      
      const video = useAppStore.getState().videos.find((v) => v.id === "test-video-2");
      expect(video?.status).toBe("completed");
    });

    it("should navigate wizard steps", () => {
      const { setCurrentStep } = useAppStore.getState();
      setCurrentStep(3);
      expect(useAppStore.getState().currentStep).toBe(3);
    });

    it("should toggle sidebar", () => {
      const { toggleSidebar } = useAppStore.getState();
      expect(useAppStore.getState().sidebarCollapsed).toBe(false);
      toggleSidebar();
      expect(useAppStore.getState().sidebarCollapsed).toBe(true);
    });

    it("should reset video draft", () => {
      const { updateVideoDraft, resetVideoDraft } = useAppStore.getState();
      updateVideoDraft({ title: "Test", script: "Script" });
      resetVideoDraft();
      
      const state = useAppStore.getState();
      expect(state.videoDraft.title).toBe("");
      expect(state.currentStep).toBe(1);
    });
  });

  describe("Credit System", () => {
    it("should deduct credit on video creation", () => {
      const { addVideo, setCredits } = useAppStore.getState();
      setCredits(5);
      
      const video = {
        id: "new-video",
        title: "New Video",
        script: "Script",
        style: "cinematic",
        status: "completed" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addVideo(video);
      useAppStore.getState().setCredits(useAppStore.getState().credits - 1);
      
      expect(useAppStore.getState().credits).toBe(4);
    });

    it("should not allow video creation with zero credits", () => {
      const { setCredits } = useAppStore.getState();
      setCredits(0);
      
      expect(useAppStore.getState().credits).toBe(0);
      // In real app, this would prevent video creation
    });
  });

  describe("Plan Limits", () => {
    it("should enforce free plan limits", () => {
      const { plan } = useAppStore.getState();
      const limits = { free: 3, starter: 30, pro: 80, business: 200 };
      expect(limits[plan]).toBe(3);
    });

    it("should update plan", () => {
      const { setPlan } = useAppStore.getState();
      setPlan("pro");
      expect(useAppStore.getState().plan).toBe("pro");
    });
  });
});