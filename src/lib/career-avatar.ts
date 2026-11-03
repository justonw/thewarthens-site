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
  { id: "afro", label: "Afro" },
  { id: "locs", label: "Locs" },
  { id: "twists", label: "Twists" },
  { id: "cornrows", label: "Braids" },
] as const;

export type BoyHairStyle = (typeof boyHairStyles)[number]["id"];
export type GirlHairStyle = (typeof girlHairStyles)[number]["id"];
export type HairStyle = BoyHairStyle | GirlHairStyle;

// Things a child can add to their character: just like real kids, some have freckles or wear
// glasses, headphones, or hearing aids. "none" is the plain look. Keep this list to everyday things;
// nothing that signals a particular religion.
export const avatarAccessories = [
  { id: "none", label: "Plain" },
  { id: "freckles", label: "Freckles" },
  { id: "glasses", label: "Glasses" },
  { id: "headphones", label: "Headphones" },
  { id: "hearing-aids", label: "Hearing aids" },
] as const;

export type AccessoryId = (typeof avatarAccessories)[number]["id"];

export type AvatarLook = {
  gender: AvatarGender;
  skin: string; // an avatarSkins id
  hair: HairStyle;
  hairColor: string; // an avatarHairColors id
  accessory?: AccessoryId;
};

export const hairStylesFor = (gender: AvatarGender) =>
  gender === "boy" ? boyHairStyles : girlHairStyles;

export const defaultLook: AvatarLook = {
  gender: "boy",
  skin: "tan",
  hair: "short",
  hairColor: "brown",
};

// The Tech Crew: friendly kids who show up around the game and the Tech Jr. pages. They are
// drawn with the same pieces a child can pick, so every child can find someone who looks like
// them. Names come from many backgrounds.
export type CrewMember = { id: string; name: string; look: AvatarLook };

export const crew: CrewMember[] = [
  { id: "maya", name: "Maya", look: { gender: "girl", skin: "brown", hair: "puffs", hairColor: "black" } },
  {
    id: "kai",
    name: "Kai",
    look: { gender: "boy", skin: "light", hair: "short", hairColor: "black", accessory: "glasses" },
  },
  {
    id: "amira",
    name: "Amira",
    look: { gender: "girl", skin: "olive", hair: "long-straight", hairColor: "black" },
  },
  { id: "jamal", name: "Jamal", look: { gender: "boy", skin: "deep", hair: "cornrows", hairColor: "black" } },
  {
    id: "sofia",
    name: "Sofia",
    look: { gender: "girl", skin: "caramel", hair: "long-wavy", hairColor: "brown" },
  },
  {
    id: "zuri",
    name: "Zuri",
    look: { gender: "girl", skin: "dark", hair: "box-braids", hairColor: "black", accessory: "headphones" },
  },
  {
    id: "diego",
    name: "Diego",
    look: { gender: "boy", skin: "tan", hair: "curly-top", hairColor: "black", accessory: "glasses" },
  },
  {
    id: "naya",
    name: "Naya",
    look: { gender: "girl", skin: "caramel", hair: "pigtail-braids", hairColor: "black" },
  },
  {
    id: "arjun",
    name: "Arjun",
    look: { gender: "boy", skin: "caramel", hair: "short", hairColor: "black", accessory: "hearing-aids" },
  },
  {
    id: "elijah",
    name: "Elijah",
    look: { gender: "boy", skin: "brown", hair: "locs", hairColor: "black", accessory: "freckles" },
  },
  { id: "noah", name: "Noah", look: { gender: "boy", skin: "fair", hair: "shaggy", hairColor: "blonde" } },
];

export const crewById = (id: string) => crew.find((c) => c.id === id);
