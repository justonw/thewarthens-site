// Options for the "Make a character" step of the Make a Show mission.
// Nothing here is saved or sent anywhere; it only decides how the cartoon is drawn.

export type AvatarGender = "boy" | "girl";

export const avatarSkins = [
  { id: "light", hex: "#F6D5BF", label: "Light skin" },
  { id: "tan", hex: "#E8B48A", label: "Tan skin" },
  { id: "caramel", hex: "#C88A5E", label: "Caramel skin" },
  { id: "brown", hex: "#9A6240", label: "Brown skin" },
  { id: "deep", hex: "#6B4026", label: "Deep brown skin" },
  { id: "dark", hex: "#45281A", label: "Dark brown skin" },
] as const;

export const avatarHairColors = [
  { id: "black", hex: "#1F1815", label: "Black hair" },
  { id: "brown", hex: "#5B3A26", label: "Brown hair" },
  { id: "blonde", hex: "#D8B04A", label: "Blonde hair" },
  { id: "red", hex: "#B2472B", label: "Red hair" },
  { id: "purple", hex: "#7C3AED", label: "Purple hair" },
] as const;

export const boyHairStyles = [
  { id: "low-cut", label: "Low cut" },
  { id: "fade", label: "Fade" },
  { id: "high-top", label: "High top" },
  { id: "twists", label: "Twists" },
  { id: "cornrows", label: "Braids" },
  { id: "locs", label: "Locs" },
  { id: "afro", label: "Afro" },
  { id: "curly-top", label: "Curly top" },
] as const;

export const girlHairStyles = [
  { id: "puffs", label: "Puffs" },
  { id: "box-braids", label: "Long braids" },
  { id: "ponytail", label: "Ponytail" },
  { id: "bun", label: "Bun" },
  { id: "long-straight", label: "Long hair" },
  { id: "big-curls", label: "Big curls" },
  { id: "bantu-knots", label: "Knots" },
  { id: "pigtail-braids", label: "Pigtails" },
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
  skin: "brown",
  hair: "twists",
  hairColor: "black",
};
