// YouTube API Response Types
export interface VideoSnippet {
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
  tags?: string[];
  categoryId: string;
}

export interface VideoItem {
  id: string;
  snippet: VideoSnippet;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  tags: string[];
  categoryId: string;
}

export interface SearchResultItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

export interface RelatedVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  description: string;
}

export interface ChannelMetadata {
  id: string;
  title: string;
  customUrl: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  viewCount?: string;
}
