import { VideoItem, GraphicItem, MarketingItem } from './types';

export const PORTFOLIO_OWNER = {
  name: "Naeim Visual",
  creatorName: "Naeim Visual",
  role: "Senior Video Editor & Visual Motion Artist",
  subRole: "Video Editing • Motion Graphics • Meta Marketing",
  email: "mdnaeim997@gmail.com",
  behanceUrl: "https://www.behance.net/mdnaeim26",
  whatsappUrl: "https://wa.me/8801700000000",
  facebookUrl: "https://www.facebook.com/profile.php?id=100063908865848",
  youtubeChannel: "https://www.youtube.com/@MdNaeim-u8x",
  bio: "Passionate video editor and creative motion specialist dedicated to high-retention visual storytelling. Specializing in Premiere Pro, After Effects, dynamic typography, and high-converting Meta Ads creatives that maximize ROAS and viewer engagement."
};

// Featured / Best Work / Trailer (Channel Showreel)
export const FEATURED_VIDEO: VideoItem = {
  id: "featured-1",
  youtubeId: "Czw6vV-Eklk",
  title: "Ghorer Hat - Commercial Motion Graphics & Video Edit",
  category: "Best Work • Commercial Motion",
  description: "Official animation and commercial motion graphics showcase featuring dynamic transitions, fluid kinetic typography, and audio-reactive pacing.",
  duration: "Showreel (16:9)",
  tags: ["Showreel", "2D Animation", "Commercial Motion"]
};

// All curated video works provided by the user
export const PORTFOLIO_VIDEOS: VideoItem[] = [
  {
    id: "video-1",
    youtubeId: "Czw6vV-Eklk",
    title: "Ghorer Hat - Commercial Motion Graphics & Video Edit",
    category: "Commercial Motion",
    description: "Dynamic commercial motion graphics and promotional video editing with high-energy pacing and brand showcase.",
    duration: "1:20",
    platform: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/Czw6vV-Eklk/hqdefault.jpg",
    tags: ["Commercial", "Motion Graphics", "Video Editing"]
  },
  {
    id: "video-2",
    youtubeId: "kuIQFjypFSs",
    title: "Motion Graphics & Animation Showreel",
    category: "Motion Graphics & Animation",
    description: "Official animation and motion graphics showcase featuring dynamic transitions, fluid kinetic typography, and audio-reactive pacing.",
    duration: "1:15",
    platform: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/kuIQFjypFSs/hqdefault.jpg",
    tags: ["Motion Graphics", "Animation", "Showreel"]
  },
  {
    id: "video-3",
    youtubeId: "1u6Tp4tM2lY",
    title: "I went to Asunnai Skill today.",
    category: "Documentary & Story",
    description: "On-location storytelling cut capturing the vibrant environment of As-Sunnah Skill with natural sound foley and balanced narrative.",
    duration: "3:42",
    platform: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/1u6Tp4tM2lY/hqdefault.jpg",
    tags: ["Documentary", "Storytelling", "Vlog"]
  },
  {
    id: "video-4",
    youtubeId: "7d1hAfH7egc",
    title: "My 3 Months Experience at As-Sunnah Skill",
    category: "Documentary & Story",
    description: "Deep narrative journey sharing three months of immersive learning, edited with balanced dialogue, mood grading, and dynamic B-roll.",
    duration: "4:18",
    platform: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/7d1hAfH7egc/hqdefault.jpg",
    tags: ["Documentary", "Storytelling", "Experience"]
  },
  {
    id: "video-5",
    youtubeId: "loftNkx9sOs",
    title: "A One-Day Outdoor Adventure!",
    category: "Shorts & Adventure",
    description: "Fast-paced, hook-optimized vertical adventure edit utilizing speed ramps, punchy whooshes, and high retention.",
    duration: "0:58",
    isShort: true,
    platform: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/loftNkx9sOs/hqdefault.jpg",
    tags: ["Shorts", "Reels", "Adventure", "Vertical"]
  },
  {
    id: "video-6",
    youtubeId: "oZdRVLPeWlg",
    title: "Brand UI Motion Design Showcase",
    category: "Motion Graphics & Animation",
    description: "Sleek tech interface motion design showcasing crisp timing curves, smooth transitions, and modern corporate aesthetic.",
    duration: "1:45",
    platform: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/oZdRVLPeWlg/hqdefault.jpg",
    tags: ["UI Motion", "Showcase", "Corporate"]
  }
];

// Graphic works: only user's own uploads will appear
export const GRAPHIC_WORKS: GraphicItem[] = [];

export const EDITING_SKILLS = [
  {
    title: "Pacing & Rhythm",
    desc: "Harmonizing cut speed with emotion to maintain viewer retention from first hook to final frame."
  },
  {
    title: "Sound Design & Audio",
    desc: "Layering whooshes, impacts, ambient foley, and voice EQ for a punchy, immersive mix."
  },
  {
    title: "Color Grading & Mood",
    desc: "Transforming flat log profiles into rich, cinematic palettes with filmic contrast."
  },
  {
    title: "Motion & Visual FX",
    desc: "Smooth speed ramps, subtle zooms, kinetic typography, and seamless transitions."
  }
];

// Marketing works: only user's own uploads will appear
export const DEFAULT_MARKETING_WORKS: MarketingItem[] = [];


