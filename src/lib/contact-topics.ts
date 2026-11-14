// Topics for the contact form. Shared by the form and the server route so they never drift apart.
export const contactTopics = [
  "A question about a video or resource",
  "Career change and 1:1 coaching",
  "Suggest a video or topic",
  "Share my testimony or my story",
  "Prayer or Faith Journey",
  "Something else",
] as const;

export const MESSAGE_MAX = 3000;
export const STORY_MAX = 5000;
