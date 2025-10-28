export type FeedAuthor = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type FeedItem = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  author?: FeedAuthor | null;
};

export type FeedListResponse = {
  items: FeedItem[];
  nextCursor: string | null;
};
