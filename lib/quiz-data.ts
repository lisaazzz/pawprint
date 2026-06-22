import { ElementType, Recipe } from "@/lib/types";

export const disclaimer =
  "This assessment is inspired by Traditional Chinese Veterinary Medicine (TCVM) constitutional theory and is intended for educational purposes only. It is not a veterinary diagnosis.";

export const traitGroups: Record<ElementType, string[]> = {
  Wood: ["Athletic", "Competitive", "Protective", "Determined", "Likes being in charge"],
  Fire: ["Affectionate", "Loves attention", "Very social", "Excitable", "Enthusiastic"],
  Earth: ["Food motivated", "Gentle", "Easy-going", "Loves routine", "Nurturing"],
  Metal: ["Loyal", "Sensitive", "Reserved", "Independent", "Predictable"],
  Water: ["Thoughtful", "Observant", "Cautious", "Shy", "Strategic"]
};

export const energyQuestions = [
  {
    id: "sleep",
    question: "Where does your dog prefer to sleep?",
    options: [
      { label: "Cool floor", yang: 2, yin: 0 },
      { label: "Anywhere", yang: 1, yin: 1 },
      { label: "Warm blanket", yang: 0, yin: 2 }
    ]
  },
  {
    id: "energy",
    question: "How would you describe your dog's energy?",
    options: [
      { label: "Always moving", yang: 2, yin: 0 },
      { label: "Balanced", yang: 1, yin: 1 },
      { label: "Relaxed", yang: 0, yin: 2 }
    ]
  },
  {
    id: "weather",
    question: "How does your dog handle warm weather?",
    options: [
      { label: "Seems uncomfortable", yang: 2, yin: 0 },
      { label: "Neutral", yang: 1, yin: 1 },
      { label: "Loves warmth", yang: 0, yin: 2 }
    ]
  },
  {
    id: "pant",
    question: "How often does your dog pant?",
    options: [
      { label: "Frequently", yang: 2, yin: 0 },
      { label: "Sometimes", yang: 1, yin: 1 },
      { label: "Rarely", yang: 0, yin: 2 }
    ]
  },
  {
    id: "runs",
    question: "Which sounds most like your dog?",
    options: [
      { label: "Runs hot", yang: 2, yin: 0 },
      { label: "Balanced", yang: 1, yin: 1 },
      { label: "Often seeks warmth", yang: 0, yin: 2 }
    ]
  }
];

export const wellnessOptions = [
  "Itchy skin",
  "Hot spots",
  "Ear infections",
  "Excessive thirst",
  "Anxiety",
  "Digestive sensitivity",
  "Weight gain",
  "Arthritis",
  "Cold intolerance",
  "None"
];

export const ownerGoals = [
  "Healthy aging",
  "Weight management",
  "Better digestion",
  "Skin & coat support",
  "More energy",
  "Just curious"
];

export const recipes: Recipe[] = [
  { name: "GC Beef Greens", thermal: "Neutral-Warming", elements: ["Earth", "Metal"] },
  { name: "GC Chicken Harmony", thermal: "Neutral-Warming", elements: ["Earth"] },
  { name: "GC Porky Beefy", thermal: "Neutral-Warming", elements: ["Earth", "Water"] },
  { name: "GC Rabbit Sockeye", thermal: "Cooling", elements: ["Fire", "Wood"] },
  { name: "GC Pork Complete", thermal: "Cooling-Neutral", elements: ["Fire", "Metal"] },
  { name: "GC Turkey Recipe", thermal: "Neutral", elements: ["Earth", "Wood"] },
  { name: "Chicken Recipe", thermal: "Neutral-Warming", elements: ["Earth"] },
  { name: "Pork Red", thermal: "Neutral-Cooling", elements: ["Fire", "Wood"] },
  { name: "Beef Dandelion Zucchini", thermal: "Neutral-Warming", elements: ["Earth", "Wood"] },
  { name: "Duck Recipe", thermal: "Cooling", elements: ["Fire", "Wood", "Metal"] },
  { name: "Lamb Recipe", thermal: "Warming", elements: ["Water"] }
];

export const baseRecommendations: Record<ElementType, string[]> = {
  Fire: ["GC Rabbit Sockeye", "Duck Recipe", "GC Pork Complete"],
  Earth: ["GC Turkey Recipe", "GC Chicken Harmony", "GC Beef Greens"],
  Metal: ["Duck Recipe", "GC Pork Complete", "GC Beef Greens"],
  Water: ["Lamb Recipe", "GC Porky Beefy", "GC Chicken Harmony"],
  Wood: ["GC Rabbit Sockeye", "Duck Recipe", "Beef Dandelion Zucchini"]
};
