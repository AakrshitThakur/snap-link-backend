const CONTENT_TYPE: string[] = [
  "document",
  "image",
  "video",
  "audio",
  "website",
  "article",
  "others",
];

const FILTER_CONTENT_TYPE: Record<string, string> = {
  documents: "document",
  images: "image",
  videos: "video",
  audios: "audio",
  websites: "website",
  articles: "article",
  others: "others",
};

const CONTENT_TITLE_MAX_LENGTH = 35;
const CONTENT_TITLE_MIN_LENGTH = 3;

export {
  CONTENT_TYPE,
  CONTENT_TITLE_MAX_LENGTH,
  CONTENT_TITLE_MIN_LENGTH,
  FILTER_CONTENT_TYPE,
};
