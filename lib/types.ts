export type ElementType = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type EnergyType = "Yin" | "Yang" | "Balanced";

export type DogProfile = {
  name: string;
  breed: string;
  age: string;
  weight: string;
  sex: string;
  photo?: string;
};

export type QuizAnswers = {
  profile: DogProfile;
  traits: string[];
  energy: Record<string, string>;
  wellness: string[];
  goal: string;
};

export type Recipe = {
  name: string;
  thermal: string;
  elements: ElementType[];
  ingredients: string[];
  keyIngredients: string[];
};

export type Result = {
  primaryElement: ElementType;
  secondaryElement: ElementType;
  energyType: EnergyType;
  archetype: string;
  confidence: number;
  elementPercents: Record<ElementType, number>;
  recipes: Array<Recipe & { reason: string; badge: string; wellnessReasons: string[] }>;
  explanation: string;
  foodProfile: {
    recommended: string[];
    moderation: string[];
  };
  ingredientProfile: {
    bestProteins: string[];
    bestVegetables: string[];
    smartCarbs: string[];
    healthyFats: string[];
    boosters: string[];
    useModerately: string[];
    heartFriendly: string[];
    kidneyFriendly: string[];
    lowHistamineFriendly: string[];
    liverFriendly: string[];
    notes: string[];
  };
  funFact: string;
};
