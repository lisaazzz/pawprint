import {
  baseRecommendations,
  energyQuestions,
  recipes,
  traitGroups
} from "@/lib/quiz-data";
import { ElementType, EnergyType, QuizAnswers, Recipe, Result } from "@/lib/types";

const elements: ElementType[] = ["Fire", "Earth", "Metal", "Water", "Wood"];

const wellnessModifiers: Record<string, Partial<Record<ElementType, number>>> = {
  "Itchy skin": { Fire: 2 },
  "Hot spots": { Fire: 2 },
  "Ear infections": { Fire: 1, Earth: 1 },
  "Excessive thirst": { Fire: 1, Water: 1 },
  Anxiety: { Fire: 1, Water: 1 },
  "Digestive sensitivity": { Earth: 2 },
  "Weight gain": { Earth: 2 },
  Arthritis: { Water: 2 },
  "Cold intolerance": { Water: 2 }
};

const archetypes: Array<{
  element: ElementType;
  energy?: EnergyType;
  secondary?: ElementType;
  name: string;
}> = [
  { element: "Fire", energy: "Yang", name: "The Social Butterfly" },
  { element: "Fire", secondary: "Earth", name: "The Family Favorite" },
  { element: "Earth", energy: "Yin", name: "The Comfort Seeker" },
  { element: "Wood", energy: "Yang", name: "The Athlete" },
  { element: "Water", energy: "Yin", name: "The Wise Observer" },
  { element: "Metal", energy: "Yin", name: "The Gentle Guardian" }
];

const elementCopy: Record<ElementType, string> = {
  Fire: "social, expressive, enthusiastic, and often happiest when the whole room is paying attention",
  Earth: "steady, food-loving, nurturing, and comforted by routine",
  Metal: "loyal, sensitive, observant, and comforted by predictability",
  Water: "thoughtful, cautious, strategic, and quietly wise",
  Wood: "athletic, determined, protective, and naturally driven"
};

const foodProfiles: Record<ElementType, { recommended: string[]; moderation: string[] }> = {
  Fire: {
    recommended: [
      "Cooling proteins",
      "Omega-3 rich foods",
      "Moisture-rich meals",
      "Green vegetables",
      "Antioxidant-rich ingredients"
    ],
    moderation: ["Highly warming proteins", "Excess treats", "Overfeeding"]
  },
  Earth: {
    recommended: [
      "Balanced neutral proteins",
      "Digestive-friendly meals",
      "Cooked vegetables",
      "Gentle fiber",
      "Simple, consistent recipes"
    ],
    moderation: ["Heavy fats", "Too many new foods at once", "Large treat portions"]
  },
  Metal: {
    recommended: [
      "Moisture-rich meals",
      "Balanced cooling-to-neutral proteins",
      "Skin and coat supportive fats",
      "Simple ingredient lists",
      "Mineral-rich vegetables"
    ],
    moderation: ["Dry foods", "Highly processed treats", "Overly rich meals"]
  },
  Water: {
    recommended: [
      "Warming proteins",
      "Joint-supportive foods",
      "Slow-cooked meals",
      "Mineral-rich ingredients",
      "Comforting, energy-building recipes"
    ],
    moderation: ["Very cooling meals", "Skipping meals", "Cold straight-from-fridge portions"]
  },
  Wood: {
    recommended: [
      "Cooling-to-neutral proteins",
      "Green vegetables",
      "Lean meals",
      "Omega-3 rich foods",
      "Antioxidant-rich ingredients"
    ],
    moderation: ["Very rich foods", "Excess warming proteins", "Too many high-drive treats"]
  }
};

const ingredientProfiles: Record<
  ElementType,
  {
    bestProteins: string[];
    bestVegetables: string[];
    healthyFats: string[];
    boosters: string[];
    useModerately: string[];
  }
> = {
  Fire: {
    bestProteins: ["Rabbit", "Duck", "Pork", "White fish", "Sockeye salmon"],
    bestVegetables: ["Zucchini", "Spinach", "Celery", "Cucumber", "Broccoli"],
    healthyFats: ["Salmon oil", "Sardines", "Ground flaxseed"],
    boosters: ["Blueberries", "Dandelion greens", "Kelp", "Turmeric"],
    useModerately: ["Lamb", "Venison", "Heavy warming spices", "Too many rich treats"]
  },
  Earth: {
    bestProteins: ["Turkey", "Chicken", "Beef", "Pork", "Eggs"],
    bestVegetables: ["Pumpkin", "Carrot", "Sweet potato", "Green beans", "Squash"],
    healthyFats: ["Salmon oil", "Egg yolk", "Hemp seed oil"],
    boosters: ["Parsley", "Probiotic-rich toppers", "Bone broth"],
    useModerately: ["Very fatty cuts", "Too many ingredient changes", "Large starch portions"]
  },
  Metal: {
    bestProteins: ["Duck", "Pork", "Beef", "Turkey", "White fish"],
    bestVegetables: ["Daikon", "Cauliflower", "Zucchini", "Mushrooms", "Leafy greens"],
    healthyFats: ["Salmon oil", "Sardines", "Hemp seed oil"],
    boosters: ["Pear in small amounts", "Kelp", "Parsley", "Bone broth"],
    useModerately: ["Dry crunchy foods", "Very rich meals", "Excess dairy-style treats"]
  },
  Water: {
    bestProteins: ["Lamb", "Beef", "Pork", "Chicken", "Turkey"],
    bestVegetables: ["Black beans", "Kidney beans", "Kale", "Sweet potato", "Carrot"],
    healthyFats: ["Egg yolk", "Salmon oil", "Hemp seed oil"],
    boosters: ["Bone broth", "Green-lipped mussel", "Kelp", "Turmeric"],
    useModerately: ["Very cooling proteins", "Cold meals from the fridge", "Excess raw watery foods"]
  },
  Wood: {
    bestProteins: ["Rabbit", "Duck", "Turkey", "White fish", "Lean beef"],
    bestVegetables: ["Dandelion greens", "Zucchini", "Spinach", "Broccoli", "Green beans"],
    healthyFats: ["Salmon oil", "Sardines", "Ground flaxseed"],
    boosters: ["Blueberries", "Parsley", "Turmeric"],
    useModerately: ["Very fatty meals", "Excess lamb", "Overly rich treats"]
  }
};

const funFacts: Record<string, string> = {
  "The Social Butterfly":
    "Many Fire-Yang dogs naturally seek cool floors and are often the first to greet visitors.",
  "The Family Favorite":
    "Fire-Earth dogs often combine big feelings with a serious talent for becoming everyone's favorite dinner companion.",
  "The Comfort Seeker":
    "Earth-Yin dogs may treat a favorite blanket, routine, or meal time like a tiny personal wellness ritual.",
  "The Athlete":
    "Wood-Yang dogs often love having a job, even if that job is proudly supervising every walk.",
  "The Wise Observer":
    "Water-Yin dogs can seem quiet at first, then surprise you with how much they noticed.",
  "The Gentle Guardian":
    "Metal-Yin dogs often show affection through loyalty, consistency, and staying close without demanding the spotlight.",
  Explorer:
    "Mixed-profile dogs are often beautifully adaptable, borrowing strengths from several elemental patterns."
};

export function scoreQuiz(answers: QuizAnswers): Result {
  const scores = Object.fromEntries(elements.map((element) => [element, 1])) as Record<
    ElementType,
    number
  >;

  for (const trait of answers.traits) {
    const element = elements.find((candidate) => traitGroups[candidate].includes(trait));
    if (element) scores[element] += 4;
  }

  for (const item of answers.wellness) {
    const modifier = wellnessModifiers[item];
    if (!modifier || item === "None") continue;
    for (const [element, points] of Object.entries(modifier) as Array<[ElementType, number]>) {
      scores[element] += points;
    }
  }

  if (answers.goal === "Better digestion") scores.Earth += 2;
  if (answers.goal === "Skin & coat support") scores.Fire += 1, scores.Metal += 1;
  if (answers.goal === "More energy") scores.Wood += 1, scores.Water += 1;
  if (answers.goal === "Healthy aging") scores.Water += 1, scores.Earth += 1;
  if (answers.goal === "Weight management") scores.Earth += 1, scores.Wood += 1;

  const sorted = [...elements].sort((a, b) => scores[b] - scores[a]);
  const primaryElement = sorted[0];
  const secondaryElement = sorted[1];
  const total = elements.reduce((sum, element) => sum + scores[element], 0);
  const elementPercents = Object.fromEntries(
    elements.map((element) => [element, Math.round((scores[element] / total) * 100)])
  ) as Record<ElementType, number>;

  let yang = 0;
  let yin = 0;
  for (const question of energyQuestions) {
    const selected = question.options.find((option) => option.label === answers.energy[question.id]);
    yang += selected?.yang ?? 0;
    yin += selected?.yin ?? 0;
  }
  if (answers.wellness.includes("Cold intolerance")) yin += 2;
  if (
    answers.wellness.some((item) =>
      ["Itchy skin", "Hot spots", "Excessive thirst"].includes(item)
    )
  ) {
    yang += 1;
  }

  const energyType: EnergyType = Math.abs(yang - yin) <= 2 ? "Balanced" : yang > yin ? "Yang" : "Yin";
  const confidence = Math.min(
    94,
    Math.max(68, Math.round(elementPercents[primaryElement] + Math.abs(yang - yin) * 5 + 42))
  );
  const archetype = getArchetype(primaryElement, secondaryElement, energyType);

  return {
    primaryElement,
    secondaryElement,
    energyType,
    archetype,
    confidence,
    elementPercents,
    recipes: recommendRecipes(primaryElement, secondaryElement, energyType, answers.goal),
    explanation: buildExplanation(answers.profile.name, primaryElement, secondaryElement, energyType),
    foodProfile: buildFoodProfile(primaryElement, energyType),
    ingredientProfile: buildIngredientProfile(primaryElement, secondaryElement, energyType, answers.goal),
    funFact: funFacts[archetype] || funFacts.Explorer
  };
}

function getArchetype(
  primaryElement: ElementType,
  secondaryElement: ElementType,
  energyType: EnergyType
) {
  const exact =
    archetypes.find(
      (item) =>
        item.element === primaryElement &&
        (item.energy === energyType || item.secondary === secondaryElement)
    ) || archetypes.find((item) => item.element === primaryElement);

  return exact?.name || "The Elemental Explorer";
}

function recommendRecipes(
  primaryElement: ElementType,
  secondaryElement: ElementType,
  energyType: EnergyType,
  goal: string
) {
  const preferred = new Set<string>(baseRecommendations[primaryElement]);
  for (const name of baseRecommendations[secondaryElement].slice(0, 2)) preferred.add(name);

  const energyPriority =
    energyType === "Yang"
      ? ["GC Rabbit Sockeye", "Duck Recipe", "GC Pork Complete"]
      : energyType === "Yin"
        ? ["Lamb Recipe", "GC Porky Beefy", "GC Chicken Harmony"]
        : ["GC Turkey Recipe", "GC Chicken Harmony", "GC Beef Greens"];

  energyPriority.forEach((name) => preferred.add(name));

  const scored = recipes.map((recipe) => ({
    recipe,
    score: scoreRecipe(recipe, preferred, primaryElement, secondaryElement, energyType, goal)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ recipe }, index) => ({
      ...recipe,
      badge: index === 0 ? "Best Match" : index === 1 ? "Great Fit" : "Smart Rotation",
      reason: recipeReason(recipe, primaryElement, energyType, goal)
    }));
}

function scoreRecipe(
  recipe: Recipe,
  preferred: Set<string>,
  primaryElement: ElementType,
  secondaryElement: ElementType,
  energyType: EnergyType,
  goal: string
) {
  let score = 0;
  if (preferred.has(recipe.name)) score += 6;
  if (recipe.elements.includes(primaryElement)) score += 5;
  if (recipe.elements.includes(secondaryElement)) score += 2;
  if (energyType === "Yang" && recipe.thermal.toLowerCase().includes("cool")) score += 5;
  if (energyType === "Yin" && recipe.thermal.toLowerCase().includes("warm")) score += 5;
  if (energyType === "Balanced" && recipe.thermal.includes("Neutral")) score += 4;
  if (goal === "Skin & coat support" && ["GC Rabbit Sockeye", "Duck Recipe"].includes(recipe.name)) {
    score += 2;
  }
  if (goal === "Better digestion" && recipe.elements.includes("Earth")) score += 2;
  if (goal === "Weight management" && recipe.thermal.toLowerCase().includes("cool")) score += 1;
  return score;
}

function recipeReason(
  recipe: Recipe,
  primaryElement: ElementType,
  energyType: EnergyType,
  goal: string
) {
  const energyPhrase =
    energyType === "Yang"
      ? "helps balance warmer, active dogs"
      : energyType === "Yin"
        ? "brings gentle warmth and steadiness"
        : "keeps meals centered and easy to rotate";
  const goalPhrase = goal === "Just curious" ? "your dog's profile" : goal.toLowerCase();
  return `${recipe.thermal} and aligned with ${recipe.elements.join(", ")} patterns, so it ${energyPhrase} while supporting ${goalPhrase}.`;
}

function buildExplanation(
  name: string,
  primaryElement: ElementType,
  secondaryElement: ElementType,
  energyType: EnergyType
) {
  const dogName = name.trim() || "Your dog";
  const energyCopy =
    energyType === "Yang"
      ? "also shows a Yang tendency, meaning they may naturally run warmer, enjoy activity, and benefit from cooling balance"
      : energyType === "Yin"
        ? "also shows a Yin tendency, meaning they may seek warmth, softness, and steady nourishment"
        : "shows a balanced Yin-Yang tendency, meaning they may do best with steady, neutral support";

  return `${dogName} is primarily ${articleFor(primaryElement)} ${primaryElement} dog with ${secondaryElement} tendencies. ${primaryElement} dogs are ${elementCopy[primaryElement]}. ${secondaryElement} traits add a layer that is ${elementCopy[secondaryElement]}. ${dogName} ${energyCopy}.`;
}

function buildFoodProfile(primaryElement: ElementType, energyType: EnergyType) {
  const base = foodProfiles[primaryElement];
  if (energyType === "Yang") {
    return {
      recommended: Array.from(new Set(["Cooling proteins", "Moisture-rich meals", ...base.recommended])).slice(0, 5),
      moderation: Array.from(new Set(["Highly warming proteins", ...base.moderation])).slice(0, 4)
    };
  }
  if (energyType === "Yin") {
    return {
      recommended: Array.from(new Set(["Warming proteins", "Slow-cooked meals", ...base.recommended])).slice(0, 5),
      moderation: Array.from(new Set(["Very cooling meals", ...base.moderation])).slice(0, 4)
    };
  }
  return base;
}

function buildIngredientProfile(
  primaryElement: ElementType,
  secondaryElement: ElementType,
  energyType: EnergyType,
  goal: string
) {
  const primary = ingredientProfiles[primaryElement];
  const secondary = ingredientProfiles[secondaryElement];
  const energyAdditions =
    energyType === "Yang"
      ? {
          bestProteins: ["Rabbit", "Duck", "White fish"],
          bestVegetables: ["Cucumber", "Zucchini", "Leafy greens"],
          useModerately: ["Warming proteins", "Heavy fats"]
        }
      : energyType === "Yin"
        ? {
            bestProteins: ["Lamb", "Beef", "Chicken"],
            bestVegetables: ["Sweet potato", "Carrot", "Kale"],
            useModerately: ["Very cooling meals", "Cold toppers"]
          }
        : {
            bestProteins: ["Turkey", "Chicken", "Beef"],
            bestVegetables: ["Pumpkin", "Green beans", "Zucchini"],
            useModerately: ["Excess treats", "Sudden food changes"]
          };

  const goalBoosters: Record<string, string[]> = {
    "Healthy aging": ["Green-lipped mussel", "Blueberries", "Bone broth"],
    "Weight management": ["Green beans", "Zucchini", "Lean turkey"],
    "Better digestion": ["Pumpkin", "Bone broth", "Probiotic-rich toppers"],
    "Skin & coat support": ["Sardines", "Salmon oil", "Ground flaxseed"],
    "More energy": ["Egg yolk", "Lean beef", "Sweet potato"],
    "Just curious": ["Blueberries", "Parsley", "Bone broth"]
  };

  return {
    bestProteins: uniqueFirst([
      ...energyAdditions.bestProteins,
      ...primary.bestProteins,
      ...secondary.bestProteins
    ], 6),
    bestVegetables: uniqueFirst([
      ...energyAdditions.bestVegetables,
      ...primary.bestVegetables,
      ...secondary.bestVegetables
    ], 6),
    healthyFats: uniqueFirst([...primary.healthyFats, ...secondary.healthyFats], 4),
    boosters: uniqueFirst([...(goalBoosters[goal] || []), ...primary.boosters, ...secondary.boosters], 5),
    useModerately: uniqueFirst([
      ...energyAdditions.useModerately,
      ...primary.useModerately,
      ...secondary.useModerately
    ], 5)
  };
}

function uniqueFirst(items: string[], limit: number) {
  return Array.from(new Set(items)).slice(0, limit);
}

function articleFor(word: string) {
  return /^[AEIOU]/.test(word) ? "an" : "a";
}
