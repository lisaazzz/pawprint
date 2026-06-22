"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bone,
  Check,
  ChevronRight,
  Download,
  Heart,
  Leaf,
  PawPrint,
  RefreshCw,
  Share2,
  Sparkles,
  SunMedium
} from "lucide-react";
import html2canvas from "html2canvas";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  disclaimer,
  energyQuestions,
  ownerGoals,
  traitGroups,
  wellnessOptions
} from "@/lib/quiz-data";
import { scoreQuiz } from "@/lib/scoring";
import { DogProfile, ElementType, QuizAnswers } from "@/lib/types";
import { cn } from "@/lib/utils";

const emptyAnswers: QuizAnswers = {
  profile: {
    name: "",
    breed: "",
    age: "",
    weight: "",
    sex: ""
  },
  traits: [],
  energy: {},
  wellness: [],
  goal: ""
};

const steps = ["Profile", "Personality", "Energy", "Wellness", "Goal", "Results"];
const storageKey = "pawprint-quiz-v1";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);
  const result = useMemo(() => scoreQuiz(answers), [answers]);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { answers: QuizAnswers; step: number; started: boolean };
      setAnswers(normalizeAnswers(parsed.answers));
      setStep(Number.isInteger(parsed.step) ? Math.min(Math.max(parsed.step, 0), steps.length - 1) : 0);
      setStarted(Boolean(parsed.started));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ answers, step, started }));
  }, [answers, step, started]);

  const progress = started ? ((step + 1) / steps.length) * 100 : 0;
  const dogName = answers.profile.name || "Your dog";

  function updateProfile(field: keyof DogProfile, value: string) {
    setAnswers((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value }
    }));
  }

  function toggleList(field: "traits" | "wellness", value: string) {
    setAnswers((current) => {
      const currentList = current[field];
      const withoutNone =
        field === "wellness" && value !== "None" ? currentList.filter((item) => item !== "None") : currentList;
      const next = withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : value === "None"
          ? ["None"]
          : [...withoutNone, value];
      return { ...current, [field]: next };
    });
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetQuiz() {
    setAnswers(emptyAnswers);
    setStarted(false);
    setStep(0);
    window.localStorage.removeItem(storageKey);
  }

  async function shareResults() {
    const text = `${dogName} is a ${result.primaryElement}-${result.secondaryElement} ${result.energyType} dog: ${result.archetype}.`;
    if (navigator.share) {
      await navigator.share({ title: "PawPrint Results", text });
      return;
    }
    await navigator.clipboard.writeText(text);
  }

  async function downloadShareCard() {
    if (!shareRef.current) return;
    const canvas = await html2canvas(shareRef.current, { backgroundColor: "#FAF8F5", scale: 2 });
    const link = document.createElement("a");
    link.download = `${dogName.toLowerCase().replace(/\s+/g, "-")}-pawprint.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-paw-background text-paw-text">
      <div className="fixed inset-0 -z-10 warm-grid opacity-70" />
      <div className="fixed -right-28 top-8 -z-10 h-72 w-72 rounded-full bg-paw-secondary blur-3xl" />
      <div className="fixed -left-28 bottom-0 -z-10 h-72 w-72 rounded-full bg-paw-accent/20 blur-3xl" />

      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-paw-primary text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span>PawPrint™</span>
        </div>
        {started && (
          <Button variant="ghost" size="sm" onClick={resetQuiz}>
            <RefreshCw className="h-4 w-4" />
            Restart
          </Button>
        )}
      </nav>

      {!started ? (
        <Landing onStart={() => setStarted(true)} />
      ) : (
        <section className="mx-auto w-full max-w-5xl px-5 pb-12">
          <div className="mb-6 rounded-2xl border border-[#ead9ca] bg-white/70 p-4 shadow-soft backdrop-blur">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span>{steps[step]}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <p className="mt-3 text-xs leading-relaxed text-neutral-600">{disclaimer}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <ProfileStep answers={answers} updateProfile={updateProfile} setAnswers={setAnswers} />
              )}
              {step === 1 && <TraitStep answers={answers} toggleTrait={(trait) => toggleList("traits", trait)} />}
              {step === 2 && (
                <EnergyStep
                  answers={answers}
                  select={(id, value) =>
                    setAnswers((current) => ({
                      ...current,
                      energy: { ...current.energy, [id]: value }
                    }))
                  }
                />
              )}
              {step === 3 && (
                <WellnessStep
                  answers={answers}
                  toggleWellness={(item) => toggleList("wellness", item)}
                />
              )}
              {step === 4 && (
                <GoalStep
                  answers={answers}
                  select={(goal) => setAnswers((current) => ({ ...current, goal }))}
                />
              )}
              {step === 5 && (
                <Results
                  answers={answers}
                  result={result}
                  shareRef={shareRef}
                  onShare={shareResults}
                  onDownload={downloadShareCard}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={previousStep} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={nextStep}>
                {step === 4 ? "Reveal Results" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={resetQuiz} variant="secondary">
                Start Over
              </Button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function normalizeAnswers(saved?: Partial<QuizAnswers>): QuizAnswers {
  return {
    profile: {
      ...emptyAnswers.profile,
      ...(saved?.profile || {})
    },
    traits: Array.isArray(saved?.traits) ? saved.traits : [],
    energy: saved?.energy && typeof saved.energy === "object" ? saved.energy : {},
    wellness: Array.isArray(saved?.wellness) ? saved.wellness : [],
    goal: typeof saved?.goal === "string" ? saved.goal : ""
  };
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-6xl items-center gap-10 px-5 pb-14 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ead9ca] bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm">
            <Sparkles className="h-4 w-4 text-paw-primary" />
            TCVM-inspired wellness profile
          </div>
          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-black leading-[0.98] tracking-normal text-paw-text sm:text-6xl lg:text-7xl">
              What Should Your Dog Really Eat?
            </h1>
            <p className="max-w-xl text-lg leading-8 text-neutral-700">
              Discover your dog's hidden TCVM element, Yin-Yang balance, and ideal foods in just 3 minutes.
            </p>
          </div>
          <Button size="lg" onClick={onStart}>
            Find My Dog's Ideal Diet
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="grid gap-3 text-sm font-semibold text-neutral-700 sm:grid-cols-2">
            {[
              "3-minute assessment",
              "Personalized food recommendations",
              "TCVM-inspired wellness profile",
              "Free results"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-paw-accent" />
                {item}
              </div>
            ))}
          </div>
          <p className="max-w-2xl text-sm text-neutral-600">
            Based on Traditional Chinese Veterinary Medicine (TCVM) constitutional theory.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#ead9ca] bg-[#f0dfcf] shadow-soft">
            <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_30%_15%,#fff8f0,transparent_38%),linear-gradient(145deg,#F6E7D8,#FAF8F5_52%,#dce8d4)] p-6">
              <div className="flex justify-end">
                <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-paw-primary">
                  PawPrint™
                </div>
              </div>
              <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-white/80 shadow-soft">
                <PawPrint className="h-24 w-24 text-paw-primary" />
              </div>
              <Card className="bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SunMedium className="h-5 w-5 text-paw-primary" />
                    Fire-Earth Yang Dog
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 text-center text-xs font-semibold">
                  <span className="rounded-xl bg-paw-secondary p-3">Element</span>
                  <span className="rounded-xl bg-paw-secondary p-3">Energy</span>
                  <span className="rounded-xl bg-paw-secondary p-3">Food</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>
      <HowItWorks />
    </>
  );
}

function HowItWorks() {
  const items = [
    ["1", "Tell us about your dog"],
    ["2", "Discover your dog's hidden element and energy type"],
    ["3", "Get personalized food and recipe recommendations"]
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-16">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(([number, title]) => (
          <Card key={number} className="bg-white/75">
            <CardContent className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paw-primary font-bold text-white">
                {number}
              </span>
              <p className="font-semibold leading-6">{title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function StepShell({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-paw-primary">{eyebrow}</p>
        <CardTitle className="font-serif text-3xl sm:text-4xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ProfileStep({
  answers,
  updateProfile,
  setAnswers
}: {
  answers: QuizAnswers;
  updateProfile: (field: keyof DogProfile, value: string) => void;
  setAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;
}) {
  const fields: Array<[keyof DogProfile, string, string]> = [
    ["name", "Dog Name", "Cocoy"],
    ["breed", "Breed", "Golden Retriever"],
    ["age", "Age", "5"],
    ["weight", "Weight", "42 lb"],
    ["sex", "Sex", "Female"]
  ];

  return (
    <StepShell eyebrow="Step 1" title="Tell us about your dog">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([field, label, placeholder]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              value={answers.profile[field] || ""}
              placeholder={placeholder}
              onChange={(event) => updateProfile(field, event.target.value)}
            />
          </div>
        ))}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="photo">Upload photo, optional</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () =>
                setAnswers((current) => ({
                  ...current,
                  profile: { ...current.profile, photo: String(reader.result) }
                }));
              reader.readAsDataURL(file);
            }}
          />
          <p className="text-xs text-neutral-500">Stored locally in this browser only. No image analysis yet.</p>
        </div>
      </div>
    </StepShell>
  );
}

function TraitStep({
  answers,
  toggleTrait
}: {
  answers: QuizAnswers;
  toggleTrait: (trait: string) => void;
}) {
  return (
    <StepShell eyebrow="Step 2" title="Select all personality traits that apply">
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.entries(traitGroups) as Array<[ElementType, string[]]>).map(([element, traits]) => (
          <div key={element} className="rounded-xl border border-[#ead9ca] bg-white/70 p-4">
            <h3 className="mb-3 font-serif text-2xl font-bold">{element}</h3>
            <div className="flex flex-wrap gap-2">
              {traits.map((trait) => (
                <TogglePill
                  key={trait}
                  selected={answers.traits.includes(trait)}
                  onClick={() => toggleTrait(trait)}
                >
                  {trait}
                </TogglePill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StepShell>
  );
}

function EnergyStep({
  answers,
  select
}: {
  answers: QuizAnswers;
  select: (id: string, value: string) => void;
}) {
  return (
    <StepShell eyebrow="Step 3" title="Map your dog's Yin-Yang energy">
      <div className="space-y-5">
        {energyQuestions.map((question) => (
          <div key={question.id} className="rounded-xl border border-[#ead9ca] bg-white/70 p-4">
            <h3 className="mb-3 font-semibold">{question.question}</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {question.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => select(question.id, option.label)}
                  className={cn(
                    "rounded-xl border p-4 text-left text-sm font-semibold transition",
                    answers.energy[question.id] === option.label
                      ? "border-paw-primary bg-paw-secondary text-paw-text"
                      : "border-[#ead9ca] bg-white hover:border-paw-primary"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StepShell>
  );
}

function WellnessStep({
  answers,
  toggleWellness
}: {
  answers: QuizAnswers;
  toggleWellness: (item: string) => void;
}) {
  return (
    <StepShell eyebrow="Step 4" title="Add wellness tendencies">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {wellnessOptions.map((item) => (
          <TogglePill
            key={item}
            selected={answers.wellness.includes(item)}
            onClick={() => toggleWellness(item)}
            className="justify-start"
          >
            {item}
          </TogglePill>
        ))}
      </div>
    </StepShell>
  );
}

function GoalStep({
  answers,
  select
}: {
  answers: QuizAnswers;
  select: (goal: string) => void;
}) {
  return (
    <StepShell eyebrow="Step 5" title="What is your primary goal?">
      <div className="grid gap-3 sm:grid-cols-2">
        {ownerGoals.map((goal) => (
          <button
            key={goal}
            type="button"
            onClick={() => select(goal)}
            className={cn(
              "rounded-xl border p-5 text-left font-semibold transition",
              answers.goal === goal
                ? "border-paw-primary bg-paw-secondary"
                : "border-[#ead9ca] bg-white/70 hover:border-paw-primary"
            )}
          >
            {goal}
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function TogglePill({
  selected,
  onClick,
  className,
  children
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition",
        selected
          ? "border-paw-primary bg-paw-secondary text-paw-text"
          : "border-[#ead9ca] bg-white text-neutral-700 hover:border-paw-primary",
        className
      )}
    >
      {selected && <Check className="h-4 w-4 text-paw-primary" />}
      {children}
    </button>
  );
}

function Results({
  answers,
  result,
  shareRef,
  onShare,
  onDownload
}: {
  answers: QuizAnswers;
  result: ReturnType<typeof scoreQuiz>;
  shareRef: React.RefObject<HTMLDivElement | null>;
  onShare: () => void;
  onDownload: () => void;
}) {
  const dogName = answers.profile.name || "Your dog";
  const sortedElements = Object.entries(result.elementPercents).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-paw-secondary p-6">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-paw-primary">PawPrint Results</p>
            <h2 className="font-serif text-4xl font-black">{dogName}'s Wellness Profile</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ResultMetric label="Primary" value={result.primaryElement} />
              <ResultMetric label="Secondary" value={result.secondaryElement} />
              <ResultMetric label="Yin-Yang" value={result.energyType} />
              <ResultMetric label="Confidence" value={`${result.confidence}%`} />
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-paw-primary text-white">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-500">Archetype</p>
                <h3 className="font-serif text-3xl font-bold">{result.archetype}</h3>
              </div>
            </div>
            <div className="space-y-3">
              {sortedElements.map(([element, percent]) => (
                <div key={element}>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{element}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-paw-secondary">
                    <div className="h-full rounded-full bg-paw-primary" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What This Means</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-8 text-neutral-700">{result.explanation}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-paw-accent" />
              Ideal Food Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <FoodList title="Recommended" items={result.foodProfile.recommended} icon="check" />
            <FoodList title="Enjoy In Moderation" items={result.foodProfile.moderation} icon="warn" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-paw-primary" />
              Fun Fact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-8 text-neutral-700">{result.funFact}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-paw-accent" />
            Ingredient Ideas for {dogName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-xl bg-paw-secondary/55 p-4 text-sm leading-6 text-neutral-700">
            These are TCVM-inspired whole-food ideas to discuss with your veterinarian or canine
            nutrition professional. They are not a complete recipe, prescription, or substitute for a
            complete and balanced diet.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <IngredientGroup title="Proteins to Explore" items={result.ingredientProfile.bestProteins} />
            <IngredientGroup title="Vegetables" items={result.ingredientProfile.bestVegetables} />
            <IngredientGroup title="Healthy Fats" items={result.ingredientProfile.healthyFats} />
            <IngredientGroup title="Optional Toppers" items={result.ingredientProfile.boosters} />
            <IngredientGroup
              title="Use Moderately"
              items={result.ingredientProfile.useModerately}
              tone="warm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bone className="h-5 w-5 text-paw-primary" />
            Recommended Holistic PawFood Recipes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {result.recipes.map((recipe, index) => (
            <div key={recipe.name} className="rounded-xl border border-[#ead9ca] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-paw-secondary px-3 py-1 text-xs font-bold text-paw-primary">
                  {recipe.badge}
                </span>
                <span className="text-2xl font-black text-paw-primary">#{index + 1}</span>
              </div>
              <h3 className="mb-2 font-serif text-2xl font-bold">{recipe.name}</h3>
              <p className="mb-4 text-sm leading-6 text-neutral-600">{recipe.reason}</p>
              <div className="space-y-2 text-sm font-semibold">
                <p>Thermal Nature: {recipe.thermal}</p>
                <p>Element Match: {recipe.elements.join(", ")}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            ref={shareRef}
            className="rounded-2xl border border-[#ead9ca] bg-paw-background p-6 text-center"
          >
            <p className="mb-3 text-4xl">🔥🌎☀️</p>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-paw-primary">PawPrint™</p>
            <h3 className="mx-auto mt-2 max-w-lg font-serif text-3xl font-black">
              {dogName} is a {result.primaryElement}-{result.secondaryElement} {result.energyType} Dog
            </h3>
            <p className="mt-3 font-semibold text-neutral-600">{result.archetype}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onShare}>
              <Share2 className="h-4 w-4" />
              Share Button
            </Button>
            <Button variant="secondary" onClick={onDownload}>
              <Download className="h-4 w-4" />
              Download Image Button
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="rounded-xl bg-white/75 p-4 text-sm leading-6 text-neutral-600">{disclaimer}</p>
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/80 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-1 font-serif text-2xl font-black">{value}</p>
    </div>
  );
}

function FoodList({
  title,
  items,
  icon
}: {
  title: string;
  items: string[];
  icon: "check" | "warn";
}) {
  return (
    <div>
      <h3 className="mb-3 font-bold">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-sm leading-6 text-neutral-700">
            {icon === "check" ? (
              <Check className="mt-1 h-4 w-4 shrink-0 text-paw-accent" />
            ) : (
              <Heart className="mt-1 h-4 w-4 shrink-0 text-paw-primary" />
            )}
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IngredientGroup({
  title,
  items,
  tone = "fresh"
}: {
  title: string;
  items: string[];
  tone?: "fresh" | "warm";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "warm"
          ? "border-[#ead9ca] bg-paw-secondary/55"
          : "border-[#dce8d4] bg-white"
      )}
    >
      <h3 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-neutral-600">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-neutral-700">
            <span
              className={cn(
                "mt-2 h-2 w-2 shrink-0 rounded-full",
                tone === "warm" ? "bg-paw-primary" : "bg-paw-accent"
              )}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
