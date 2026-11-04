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

// Clothes and eye colors, so a character can look like the child who made it.
export const avatarOutfits = [
  { id: "hoodie", label: "Hoodie" },
  { id: "tee", label: "T-shirt" },
  { id: "jacket", label: "Jacket" },
  { id: "stripes", label: "Stripes" },
] as const;

export const avatarOutfitColors = [
  { id: "blue", hex: "#3B82F6", label: "Blue" },
  { id: "red", hex: "#EF4444", label: "Red" },
  { id: "green", hex: "#10B981", label: "Green" },
  { id: "yellow", hex: "#F59E0B", label: "Yellow" },
  { id: "purple", hex: "#8B5CF6", label: "Purple" },
  { id: "pink", hex: "#EC4899", label: "Pink" },
  { id: "black", hex: "#374151", label: "Black" },
  { id: "orange", hex: "#F97316", label: "Orange" },
] as const;

export const avatarEyeColors = [
  { id: "brown", hex: "#5B3A22", label: "Brown eyes" },
  { id: "dark", hex: "#2A1A12", label: "Dark brown eyes" },
  { id: "hazel", hex: "#8A6A2F", label: "Hazel eyes" },
  { id: "green", hex: "#3F8F5A", label: "Green eyes" },
  { id: "blue", hex: "#3B82C4", label: "Blue eyes" },
] as const;

export type OutfitId = (typeof avatarOutfits)[number]["id"];

export type AvatarLook = {
  gender: AvatarGender;
  skin: string; // an avatarSkins id
  hair: HairStyle;
  hairColor: string; // an avatarHairColors id
  accessory?: AccessoryId;
  outfit?: OutfitId;
  outfitColor?: string; // an avatarOutfitColors id
  eyes?: string; // an avatarEyeColors id
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
  {
    id: "maya",
    name: "Maya",
    look: { gender: "girl", skin: "brown", hair: "puffs", hairColor: "black", eyes: "dark", outfit: "hoodie", outfitColor: "yellow" },
  },
  {
    id: "kenji",
    name: "Kenji",
    look: { gender: "boy", skin: "light", hair: "short", hairColor: "black", eyes: "dark", accessory: "glasses", outfit: "jacket", outfitColor: "green" },
  },
  {
    id: "emma",
    name: "Emma",
    look: { gender: "girl", skin: "fair", hair: "long-wavy", hairColor: "blonde", eyes: "blue", outfit: "tee", outfitColor: "pink" },
  },
  {
    id: "jamal",
    name: "Jamal",
    look: { gender: "boy", skin: "deep", hair: "cornrows", hairColor: "black", eyes: "dark", outfit: "stripes", outfitColor: "red" },
  },
  {
    id: "sofia",
    name: "Sofia",
    look: { gender: "girl", skin: "caramel", hair: "long-wavy", hairColor: "brown", eyes: "brown", outfit: "jacket", outfitColor: "purple" },
  },
  {
    id: "zuri",
    name: "Zuri",
    look: { gender: "girl", skin: "dark", hair: "box-braids", hairColor: "black", eyes: "dark", accessory: "headphones", outfit: "hoodie", outfitColor: "orange" },
  },
  {
    id: "diego",
    name: "Diego",
    look: { gender: "boy", skin: "tan", hair: "curly-top", hairColor: "black", eyes: "brown", accessory: "glasses", outfit: "tee", outfitColor: "blue" },
  },
  {
    id: "naya",
    name: "Naya",
    look: { gender: "girl", skin: "caramel", hair: "pigtail-braids", hairColor: "black", eyes: "dark", outfit: "stripes", outfitColor: "green" },
  },
  {
    id: "arjun",
    name: "Arjun",
    look: { gender: "boy", skin: "caramel", hair: "short", hairColor: "black", eyes: "dark", accessory: "hearing-aids", outfit: "hoodie", outfitColor: "purple" },
  },
  {
    id: "lily",
    name: "Lily",
    look: { gender: "girl", skin: "fair", hair: "braid", hairColor: "red", eyes: "green", accessory: "freckles", outfit: "jacket", outfitColor: "red" },
  },
  {
    id: "joshua",
    name: "Joshua",
    look: { gender: "boy", skin: "brown", hair: "low-cut", hairColor: "black", eyes: "dark", outfit: "hoodie", outfitColor: "blue" },
  },
  {
    id: "jackson",
    name: "Jackson",
    look: { gender: "boy", skin: "light", hair: "wavy", hairColor: "brown", eyes: "blue", accessory: "freckles", outfit: "tee", outfitColor: "red" },
  },
  {
    id: "joy",
    name: "Joy",
    look: { gender: "girl", skin: "deep", hair: "afro", hairColor: "black", eyes: "dark", outfit: "tee", outfitColor: "yellow" },
  },
  {
    id: "john",
    name: "John",
    look: { gender: "boy", skin: "olive", hair: "spiky", hairColor: "black", eyes: "brown", outfit: "stripes", outfitColor: "orange" },
  },
];

export const crewById = (id: string) => crew.find((c) => c.id === id);
