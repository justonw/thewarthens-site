// Options for the "Make a character" step of the Make a Show mission.
// Nothing here is saved or sent anywhere; it only decides how the cartoon is drawn.

export type AvatarGender = "boy" | "girl";

export const avatarSkins = [
  { id: "fair", hex: "#FBE3D2", label: "Fair skin" },
  { id: "light", hex: "#F3CDAE", label: "Light skin" },
  { id: "tan", hex: "#E5B48A", label: "Tan skin" },
  { id: "olive", hex: "#CC9966", label: "Olive skin" },
  { id: "caramel", hex: "#B97F55", label: "Caramel skin" },
  { id: "brown", hex: "#8F5A3A", label: "Brown skin" },
  { id: "deep", hex: "#64402A", label: "Deep brown skin" },
  { id: "dark", hex: "#45281A", label: "Dark brown skin" },
] as const;

export const avatarHairColors = [
  { id: "black", hex: "#1F1815", label: "Black hair" },
  { id: "brown", hex: "#5B3A26", label: "Brown hair" },
  { id: "blonde", hex: "#D8B04A", label: "Blonde hair" },
  { id: "red", hex: "#B2472B", label: "Red hair" },
  { id: "purple", hex: "#7C3AED", label: "Purple hair" },
] as const;

// The first style in each list is what shows when a child picks boy or girl, so it stays plain.
export const boyHairStyles = [
  { id: "short", label: "Short" },
  { id: "low-cut", label: "Low cut" },
  { id: "fade", label: "Fade" },
  { id: "shaggy", label: "Shaggy" },
  { id: "wavy", label: "Wavy" },
  { id: "spiky", label: "Spiky" },
  { id: "curly-top", label: "Curly top" },
  { id: "high-top", label: "High top" },
  { id: "twists", label: "Twists" },
  { id: "cornrows", label: "Braids" },
  { id: "locs", label: "Locs" },
  { id: "afro", label: "Afro" },
] as const;

export const girlHairStyles = [
  { id: "long-straight", label: "Long hair" },
  { id: "ponytail", label: "Ponytail" },
  { id: "bob", label: "Bob" },
  { id: "long-wavy", label: "Long wavy" },
  { id: "bun", label: "Bun" },
  { id: "space-buns", label: "Two buns" },
  { id: "braid", label: "One braid" },
  { id: "pigtail-braids", label: "Pigtails" },
  { id: "puffs", label: "Puffs" },
  { id: "big-curls", label: "Big curls" },
  { id: "bantu-knots", label: "Knots" },
  { id: "box-braids", label: "Long braids" },
] as const;

export type BoyHairStyle = (typeof boyHairStyles)[number]["id"];
export type GirlHairStyle = (typeof girlHairStyles)[number]["id"];
export type HairStyle = BoyHairStyle | GirlHairStyle;

export type AvatarLook = {
  gender: AvatarGender;
  skin: string; // an avatarSkins id
  hair: HairStyle;
  hairColor: string; // an avatarHairColors id
};

export const hairStylesFor = (gender: AvatarGender) =>
  gender === "boy" ? boyHairStyles : girlHairStyles;

export const defaultLook: AvatarLook = {
  gender: "boy",
  skin: "tan",
  hair: "short",
  hairColor: "brown",
};
