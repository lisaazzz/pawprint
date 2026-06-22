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
  {
    name: "GC Beef Greens",
    thermal: "Neutral-Warming",
    elements: ["Earth", "Metal", "Water"],
    keyIngredients: ["Beef", "Beef heart", "Mackerel", "Broccoli", "Butternut squash"],
    ingredients: ["Beef", "Beef heart", "Beef lung", "Beef liver", "Mackerel", "Broccoli", "Green beans", "Butternut squash", "Egg", "Pumpkin seeds", "Nutritional yeast", "Kelp", "Eggshell", "Vitamin E", "Manganese", "Sea salt"]
  },
  {
    name: "GC Chicken Harmony",
    thermal: "Warming",
    elements: ["Earth", "Water"],
    keyIngredients: ["Chicken thigh", "Omega-3 egg", "Pak choi", "Japanese sweet potato", "Ginger root"],
    ingredients: ["Chicken thigh", "Chicken liver", "Chicken heart", "Omega-3 egg", "Pak choi", "Japanese sweet potato", "Button mushroom", "Ginger root", "Cod liver oil", "Kelp", "Eggshell", "Cinnamon", "Flaxseed", "Zinc picolinate", "Vitamin E"]
  },
  {
    name: "GC Porky Beefy",
    thermal: "Neutral-Warming",
    elements: ["Earth", "Water"],
    keyIngredients: ["Lean pork", "Pork kidney", "Beef liver", "Sardines", "Shiitake mushroom"],
    ingredients: ["Lean pork", "Pork heart", "Pork kidney", "Beef liver", "Sardines", "Broccoli", "Green beans", "Shiitake mushroom", "Blueberries", "Turmeric", "Kelp", "Flaxseed", "Eggshell", "Zinc picolinate", "Vitamin E", "Sea salt"]
  },
  {
    name: "GC Rabbit Sockeye",
    thermal: "Cooling-Neutral",
    elements: ["Fire", "Wood", "Water"],
    keyIngredients: ["Rabbit", "Sockeye salmon", "Green beans", "Cauliflower", "Cranberry"],
    ingredients: ["Rabbit", "Duck liver", "Sockeye salmon", "Egg", "Green beans", "Cauliflower", "Shiitake mushroom", "Cranberry", "Kelp", "Eggshell", "Vitamin E", "Nutritional yeast", "Zinc", "Ginger", "Manganese", "Flaxseed"]
  },
  {
    name: "GC Pork Complete",
    thermal: "Cooling-Neutral",
    elements: ["Fire", "Metal", "Water"],
    keyIngredients: ["Pork", "Pork heart", "Sardines", "Kale", "Zucchini"],
    ingredients: ["Pork", "Pork heart", "Pork liver", "Pork kidney", "Sardines", "Kale", "Romaine lettuce", "Zucchini", "Sea salt", "Turmeric", "Eggshell", "Flaxseed", "Kelp", "Manganese", "Vitamin E"]
  },
  {
    name: "GC Turkey Recipe",
    thermal: "Neutral-Warming",
    elements: ["Earth", "Wood"],
    keyIngredients: ["Ground turkey", "Turkey heart", "Butternut squash", "Pak choi", "Green beans"],
    ingredients: ["Ground turkey", "Turkey heart", "Turkey liver", "Butternut squash", "Pak choi", "Green beans", "Mushroom", "Ginger", "Flaxseed", "Eggshell", "Kelp", "Turmeric"]
  },
  {
    name: "Raw Chicken Recipe",
    thermal: "Warming",
    elements: ["Earth", "Metal"],
    keyIngredients: ["Chicken", "Egg", "Chicken liver", "Spinach", "Cod liver oil"],
    ingredients: ["Chicken", "Egg", "Chicken liver", "Mushroom", "Spinach", "Chia seed", "Pumpkin seeds", "Eggshell", "Ginger", "Zinc", "Sea salt", "Kelp", "Cod liver oil", "Nutritional yeast"]
  },
  {
    name: "Raw Pork Red",
    thermal: "Neutral-Cooling",
    elements: ["Fire", "Wood", "Water"],
    keyIngredients: ["Pork", "Sardines", "Red cabbage", "Dandelion greens", "Celery"],
    ingredients: ["Pork", "Sardines", "Pork liver", "Pork heart", "Pork spleen", "Shiitake mushroom", "Celery", "Butternut squash", "Red cabbage", "Coriander", "Dandelion greens", "Zinc", "Kelp", "Vitamin E", "Manganese", "Eggshell"]
  },
  {
    name: "Raw Beef Dandelion Zucchini",
    thermal: "Neutral-Warming",
    elements: ["Earth", "Wood", "Water"],
    keyIngredients: ["Beef", "Mackerel", "Dandelion greens", "Zucchini", "Sweet potato"],
    ingredients: ["Beef", "Beef heart", "Beef liver", "Mackerel", "Broccoli", "Zucchini", "Dandelion greens", "Mushroom", "Turmeric", "Black pepper", "Eggshell", "Sweet potato", "Sea salt", "Manganese", "Kelp", "Wheatgrass", "Beef MDM", "Sunflower seeds"]
  },
  {
    name: "Raw Duck Recipe",
    thermal: "Cooling",
    elements: ["Fire", "Wood", "Metal"],
    keyIngredients: ["Duck", "Duck heart", "Dandelion greens", "Cucumber", "Cod liver oil"],
    ingredients: ["Duck", "Duck gizzard", "Duck heart", "Beef liver", "Egg", "Broccoli", "Dandelion greens", "Cucumber", "Shiitake mushroom", "Cod liver oil", "Eggshell", "Cinnamon", "Kelp", "Pumpkin seeds", "Black pepper", "Zinc", "Sea salt"]
  },
  {
    name: "Raw Lamb Recipe",
    thermal: "Warming",
    elements: ["Water", "Earth"],
    keyIngredients: ["Lamb", "Lamb heart", "Mackerel", "Carrot", "Pak choi"],
    ingredients: ["Lamb", "Lamb heart", "Lamb lung", "Beef liver", "Mackerel", "Egg", "Carrot", "Pak choi", "Sunflower seeds", "Eggshell", "Oregano", "Manganese", "Zinc", "Kelp", "Wheat germ oil"]
  }
];

export const baseRecommendations: Record<ElementType, string[]> = {
  Fire: ["GC Rabbit Sockeye", "Raw Duck Recipe", "GC Pork Complete"],
  Earth: ["GC Turkey Recipe", "GC Chicken Harmony", "GC Beef Greens"],
  Metal: ["Raw Duck Recipe", "GC Pork Complete", "GC Beef Greens"],
  Water: ["Raw Lamb Recipe", "GC Porky Beefy", "GC Chicken Harmony"],
  Wood: ["GC Rabbit Sockeye", "Raw Duck Recipe", "Raw Beef Dandelion Zucchini"]
};
