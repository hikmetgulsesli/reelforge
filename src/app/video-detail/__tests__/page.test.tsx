import { render, screen, fireEvent } from '@testing-library/react';
import VideoDetailPage from '../page';

describe('VideoDetailPage', () => {
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
    shareLink: 'reelforge.ai/v/x7b9q2p'
  };

  beforeEach(() => {
    render(<VideoDetailPage />);
  });

  it('renders video title', () => {
    expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
  });

  it('renders video metadata badges', () => {
    // Duration badge
    expect(screen.getAllByText(/60s/)[0]).toBeInTheDocument();
    // Style badge - there might be multiple matches, use first
    expect(screen.getAllByText(/Anime Style/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Voice: Sarah/)).toBeInTheDocument();
    expect(screen.getByText(/1 Credit Used/)).toBeInTheDocument();
  });

  it('renders statistics section with views and likes', () => {
    expect(screen.getByText(/Views/)).toBeInTheDocument();
    expect(screen.getByText(/Likes/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(1243)).toBeInTheDocument();
    expect(screen.getByDisplayValue(89)).toBeInTheDocument();
  });

  it('renders download buttons', () => {
    expect(screen.getByText(/Download HD/)).toBeInTheDocument();
    expect(screen.getByText(/Download 4K/)).toBeInTheDocument();
  });

  it('renders editable title and description fields', () => {
    const titleInput = screen.getByLabelText(/Video Title/);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(mockVideo.title);

    const descInput = screen.getByLabelText(/Description/);
    expect(descInput).toBeInTheDocument();
    expect(descInput).toHaveValue(mockVideo.description);
  });

  it('renders tags input', () => {
    const tagsInput = screen.getByLabelText(/Tags/);
    expect(tagsInput).toBeInTheDocument();
    expect(tagsInput).toHaveValue(mockVideo.tags);
  });

  it('renders publishing section with social buttons', () => {
    expect(screen.getByText(/Publishing & Sharing/)).toBeInTheDocument();
    expect(screen.getByText(/YouTube/)).toBeInTheDocument();
    expect(screen.getByText(/TikTok/)).toBeInTheDocument();
    expect(screen.getByText(/Instagram/)).toBeInTheDocument();
  });

  it('renders schedule release toggle', () => {
    expect(screen.getByText(/Schedule Release/)).toBeInTheDocument();
  });

  it('renders share link input', () => {
    expect(screen.getByDisplayValue(mockVideo.shareLink)).toBeInTheDocument();
  });

  it('renders save changes button', () => {
    expect(screen.getByText(/Save Changes/)).toBeInTheDocument();
  });

  it('renders duplicate and delete buttons in header', () => {
    expect(screen.getByText(/Duplicate/)).toBeInTheDocument();
    expect(screen.getByText(/Delete/)).toBeInTheDocument();
  });

  it('opens delete confirmation dialog when delete is clicked', () => {
    const deleteButton = screen.getByText(/Delete/);
    fireEvent.click(deleteButton);
    expect(screen.getByText(/Delete Video?/)).toBeInTheDocument();
  });

  it('closes delete confirmation dialog on cancel', () => {
    const deleteButton = screen.getByText(/Delete/);
    fireEvent.click(deleteButton);
    
    const cancelButton = screen.getByText(/Cancel/);
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText(/Delete Video?/)).not.toBeInTheDocument();
  });

  it('allows editing title', () => {
    const titleInput = screen.getByLabelText(/Video Title/);
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
  });

  it('allows editing description', () => {
    const descInput = screen.getByLabelText(/Description/);
    fireEvent.change(descInput, { target: { value: 'New description' } });
    expect(descInput).toHaveValue('New description');
  });

  it('allows editing views', () => {
    const viewsInput = screen.getByDisplayValue(1243);
    fireEvent.change(viewsInput, { target: { value: 2000 } });
    expect(screen.getByDisplayValue(2000)).toBeInTheDocument();
  });

  it('allows editing likes', () => {
    const likesInput = screen.getByDisplayValue(89);
    fireEvent.change(likesInput, { target: { value: 150 } });
    expect(screen.getByDisplayValue(150)).toBeInTheDocument();
  });
});
