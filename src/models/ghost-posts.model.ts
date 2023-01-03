export interface IGhostBaseResponse {
  meta: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
      next: number | null;
      prev: number | null;
    };
  };
}
export interface IGhostPostResponse {
  posts: IGhostPost[];
}
export interface IGhostPostsResponse extends IGhostBaseResponse {
  posts: IGhostPost[];
}


export interface IGhostPost {
  slug: string;
  id: string;
  uuid: string;
  title: string;
  html: string;
  comment_id: string;
  feature_image: string;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string;
  codeinjection_head: unknown;
  codeinjection_foot: unknown;
  custom_template: unknown;
  canonical_url: string;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  comments: boolean;
  og_image: string;
  og_title: string;
  og_description: string;
  twitter_image: string;
  twitter_title: string;
  twitter_description: string;
  meta_title: string;
  meta_description: string;
  email_subject: string;
  frontmatter: string;
  feature_image_alt: string;
  feature_image_caption: string;
  tags?: any;
  primary_tag?: any;
  authors?: any;
  primary_author?: any;
}