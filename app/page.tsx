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
  FileDown,
  Heart,
  Leaf,
  MessageCircle,
  Moon,
  PawPrint,
  RefreshCw,
  Share2,
  Sparkles,
  SunMedium,
  Trophy
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
const recordEmail = "holisticpawfood@gmail.com";
const whatsappNumber = "628999009316";

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

  function downloadCustomerRecord() {
    const rows = buildCustomerRecordRows(answers, result);
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.download = `${dogName.toLowerCase().replace(/\s+/g, "-") || "pawprint"}-record.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function copyCustomerRecord() {
    const rows = buildCustomerRecordRows(answers, result);
    const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
    await navigator.clipboard.writeText(text);
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
                  onDownloadRecord={downloadCustomerRecord}
                  onCopyRecord={copyCustomerRecord}
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

function buildCustomerRecordRows(answers: QuizAnswers, result: ReturnType<typeof scoreQuiz>) {
  return [
    ["Dog name", answers.profile.name || ""],
    ["Breed", answers.profile.breed || ""],
    ["Age", answers.profile.age || ""],
    ["Weight kg", answers.profile.weight || ""],
    ["Sex", answers.profile.sex || ""],
    ["Owner goal", answers.goal || ""],
    ["Primary element", result.primaryElement],
    ["Secondary element", result.secondaryElement],
    ["Yin-Yang type", result.energyType],
    ["Archetype", result.archetype],
    ["Confidence", `${result.confidence}%`],
    ["Traits", answers.traits.join("; ")],
    ["Wellness tendencies", answers.wellness.join("; ")],
    ["Recommended recipes", result.recipes.map((recipe) => recipe.name).join("; ")],
    ["Recipe wellness reasons", result.recipes.flatMap((recipe) => recipe.wellnessReasons).join("; ")],
    ["Ingredient proteins", result.ingredientProfile.bestProteins.join("; ")],
    ["Ingredient vegetables", result.ingredientProfile.bestVegetables.join("; ")],
    ["Smart carbs", result.ingredientProfile.smartCarbs.join("; ")],
    ["Healthy fats", result.ingredientProfile.healthyFats.join("; ")],
    ["Optional toppers", result.ingredientProfile.boosters.join("; ")],
    ["Use moderately", result.ingredientProfile.useModerately.join("; ")],
    ["Heart-friendly ideas", result.ingredientProfile.heartFriendly.join("; ")],
    ["Kidney-friendly ideas", result.ingredientProfile.kidneyFriendly.join("; ")],
    ["Low-histamine friendly ideas", result.ingredientProfile.lowHistamineFriendly.join("; ")],
    ["Liver-friendly ideas", result.ingredientProfile.liverFriendly.join("; ")],
    ["Nutrition notes", result.ingredientProfile.notes.join("; ")]
  ];
}

function buildCustomerRecordPayload(answers: QuizAnswers, result: ReturnType<typeof scoreQuiz>) {
  return Object.fromEntries(buildCustomerRecordRows(answers, result));
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
    ["weight", "Weight in kg", "18"]
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
        <div className="space-y-2">
          <Label>Sex</Label>
          <div className="grid grid-cols-2 gap-2">
            {["Female", "Male"].map((sex) => (
              <button
                key={sex}
                type="button"
                onClick={() => updateProfile("sex", sex)}
                className={cn(
                  "h-12 rounded-xl border px-4 text-sm font-semibold transition",
                  answers.profile.sex === sex
                    ? "border-paw-primary bg-paw-secondary"
                    : "border-[#dec8b8] bg-white hover:border-paw-primary"
                )}
              >
                {sex}
              </button>
            ))}
          </div>
        </div>
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
  onDownload,
  onDownloadRecord,
  onCopyRecord
}: {
  answers: QuizAnswers;
  result: ReturnType<typeof scoreQuiz>;
  shareRef: React.RefObject<HTMLDivElement | null>;
  onShare: () => void;
  onDownload: () => void;
  onDownloadRecord: () => void;
  onCopyRecord: () => void;
}) {
  const dogName = answers.profile.name || "Your dog";
  const sortedElements = Object.entries(result.elementPercents).sort((a, b) => b[1] - a[1]);
  const [recordStatus, setRecordStatus] = useState<"idle" | "sending" | "sent" | "error" | "local">(
    "idle"
  );

  useEffect(() => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      setRecordStatus("local");
      return;
    }

    const recordId = `pawprint-record-${btoa(
      encodeURIComponent(JSON.stringify({ profile: answers.profile, result }))
    ).slice(0, 80)}`;

    if (window.localStorage.getItem(recordId)) {
      setRecordStatus("sent");
      return;
    }

    async function sendRecord() {
      setRecordStatus("sending");
      try {
        const payload = {
          _subject: `New PawPrint result: ${dogName}`,
          _template: "table",
          _captcha: "false",
          source: window.location.href,
          submittedAt: new Date().toISOString(),
          ...buildCustomerRecordPayload(answers, result)
        };

        const response = await fetch(`https://formsubmit.co/ajax/${recordEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Record email failed");
        window.localStorage.setItem(recordId, "sent");
        setRecordStatus("sent");
      } catch {
        setRecordStatus("error");
      }
    }

    void sendRecord();
  }, [answers, dogName, result]);

  const profileName = `${result.primaryElement}-${result.secondaryElement} ${result.energyType}`;
  const personalityWords = getPersonalityWords(result.primaryElement, result.secondaryElement);
  const energyDetails = getEnergyDetails(result.energyType);
  const practicalMeaning = getPracticalMeaning(result.primaryElement, result.energyType, answers.wellness);
  const personalizedSummary = buildPremiumSummary(dogName, result, answers);
  const whatsappText = encodeURIComponent(
    `Hi Holistic PawFood, I completed the PawPrint quiz for ${dogName}. ${dogName} is ${profileName} and ${result.archetype}. I would like a personalized feeding recommendation.`
  );

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-[#ead9ca] bg-[radial-gradient(circle_at_15%_10%,#fff7ee,transparent_34%),linear-gradient(135deg,#ffffff,#F6E7D8_52%,#e8f0e2)] shadow-soft"
      >
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-paw-primary">
              {dogName}'s PawPrint Profile
            </p>
            <div>
              <h2 className="font-serif text-5xl font-black leading-none sm:text-6xl">
                {result.archetype}
              </h2>
              <p className="mt-4 text-2xl font-bold text-neutral-700">{profileName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalityWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-neutral-700 shadow-sm"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="max-w-2xl text-lg leading-8 text-neutral-700">{personalizedSummary}</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-white/75 shadow-soft">
              <div className="absolute inset-5 rounded-full border border-paw-secondary" />
              <PawPrint className="h-24 w-24 text-paw-primary" />
              <div className="absolute -bottom-3 rounded-full bg-paw-primary px-5 py-3 text-sm font-black text-white shadow-soft">
                {result.confidence}% profile confidence
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-8 text-neutral-700">{personalizedSummary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Element Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {sortedElements.map(([element, percent]) => (
            <ElementCard key={element} element={element as ElementType} percent={percent} />
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-white/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.energyType === "Yin" ? (
                <Moon className="h-5 w-5 text-paw-primary" />
              ) : (
                <SunMedium className="h-5 w-5 text-paw-primary" />
              )}
              {energyDetails.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-7 text-neutral-700">{energyDetails.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {energyDetails.points.map((point) => (
                <IconNote key={point} text={point} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What This Means Day To Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {practicalMeaning.map((item) => (
                <IconNote key={item} text={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-paw-accent" />
              What Foods Tend To Suit {dogName}?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <IngredientGroup title="Proteins to Explore" items={result.ingredientProfile.bestProteins} />
            <IngredientGroup title="Vegetables" items={result.ingredientProfile.bestVegetables} />
            <IngredientGroup title="Smart Carbs" items={result.ingredientProfile.smartCarbs} />
            <IngredientGroup title="Healthy Fats" items={result.ingredientProfile.healthyFats} />
            <IngredientGroup title="Optional Toppers" items={result.ingredientProfile.boosters} />
            <IngredientGroup
              title="Use Moderately"
              items={result.ingredientProfile.useModerately}
              tone="warm"
            />
          </div>
          <div className="rounded-xl border border-[#ead9ca] bg-white p-4">
            <h3 className="mb-3 font-serif text-2xl font-bold">Special Support Filters</h3>
            <p className="mb-4 text-sm leading-6 text-neutral-600">
              Use these as conversation starters with a veterinarian, especially for dogs with known
              heart, kidney, liver, allergy, or histamine concerns.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <IngredientGroup
                title="Heart-Friendly Ideas"
                items={result.ingredientProfile.heartFriendly}
              />
              <IngredientGroup
                title="Kidney-Friendly Ideas"
                items={result.ingredientProfile.kidneyFriendly}
              />
              <IngredientGroup
                title="Low-Histamine Friendly"
                items={result.ingredientProfile.lowHistamineFriendly}
              />
              <IngredientGroup
                title="Liver-Friendly Ideas"
                items={result.ingredientProfile.liverFriendly}
              />
            </div>
          </div>
          <div className="rounded-xl bg-white/80 p-4">
            <h3 className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-paw-primary">
              Nutrition Notes
            </h3>
            <div className="space-y-2">
              {result.ingredientProfile.notes.map((note) => (
                <div key={note} className="flex gap-2 text-sm leading-6 text-neutral-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-paw-accent" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
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
        <CardContent className="grid gap-5 md:grid-cols-3">
          {result.recipes.map((recipe, index) => (
            <div
              key={recipe.name}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-white p-5 shadow-soft",
                index === 0 ? "border-paw-primary" : "border-[#ead9ca]"
              )}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-paw-secondary" />
              <div className="relative mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-paw-primary px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                  {recipeBadge(index)}
                </span>
                <Trophy className={cn("h-7 w-7", index === 0 ? "text-paw-primary" : "text-paw-accent")} />
              </div>
              <h3 className="relative mb-3 font-serif text-3xl font-black">{recipe.name}</h3>
              <p className="mb-4 text-sm font-bold text-paw-primary">Why this matches {dogName}</p>
              <div className="mb-5 space-y-3">
                {recipeMatchBullets(recipe, result, answers).map((reason) => (
                  <IconNote key={reason} text={reason} compact />
                ))}
              </div>
              <div className="mb-4 rounded-xl bg-paw-secondary/55 p-3">
                <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-paw-primary">
                  Key Ingredients
                </p>
                <p className="text-sm font-semibold leading-6 text-neutral-700">
                  {recipeIngredients(recipe.name).join(" • ")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
                <div className="rounded-xl border border-[#ead9ca] bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Thermal</p>
                  <p>{recipe.thermal}</p>
                </div>
                <div className="rounded-xl border border-[#ead9ca] bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Elements</p>
                  <p>{recipe.elements.join(", ")}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shareable Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            ref={shareRef}
            className="rounded-2xl border border-[#ead9ca] bg-[linear-gradient(135deg,#ffffff,#F6E7D8)] p-8 text-center shadow-soft"
          >
            <p className="mb-3 text-4xl">🔥🌎☀️</p>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-paw-primary">PawPrint™</p>
            <p className="mt-4 text-lg font-semibold text-neutral-600">{dogName} is</p>
            <h3 className="mx-auto mt-2 max-w-lg font-serif text-3xl font-black">
              {result.archetype}
            </h3>
            <p className="mt-3 text-xl font-bold text-neutral-700">{profileName}</p>
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

      <Card className="overflow-hidden bg-paw-primary text-white">
        <CardContent className="grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-white/75">
              Personalized Feeding Support
            </p>
            <h3 className="font-serif text-3xl font-black">Want a Personalized Feeding Plan?</h3>
            <p className="mt-2 max-w-2xl leading-7 text-white/85">
              Get a custom recommendation from Holistic PawFood based on {dogName}'s profile,
              wellness tendencies, and food goals.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer">
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-paw-primary" />
            Customer Record
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-neutral-600">
            A copy of this completed assessment is sent to Holistic PawFood for customer records.
            You can also download or copy the record manually.
          </p>
          <div className="rounded-xl bg-paw-secondary/55 p-4 text-sm font-semibold text-neutral-700">
            {recordStatus === "sending" && "Sending record to Holistic PawFood..."}
            {recordStatus === "sent" && `Record sent to ${recordEmail}.`}
            {recordStatus === "error" &&
              "Automatic record sending could not complete. Please use Download Record CSV or Copy Record."}
            {recordStatus === "local" &&
              "Local preview mode: automatic email sending will run on the live Vercel site."}
            {recordStatus === "idle" && "Preparing customer record..."}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onDownloadRecord}>
              <Download className="h-4 w-4" />
              Download Record CSV
            </Button>
            <Button variant="outline" onClick={onCopyRecord}>
              <FileDown className="h-4 w-4" />
              Copy Record
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

const elementVisuals: Record<ElementType, { color: string; bg: string; icon: string }> = {
  Fire: { color: "#C86A4A", bg: "#FBE7DF", icon: "Fire" },
  Earth: { color: "#A77C3B", bg: "#F6E7D8", icon: "Earth" },
  Metal: { color: "#7D8790", bg: "#EEF0F1", icon: "Metal" },
  Water: { color: "#5B89A6", bg: "#E6F1F6", icon: "Water" },
  Wood: { color: "#6E985B", bg: "#E7F0E2", icon: "Wood" }
};

function ElementCard({ element, percent }: { element: ElementType; percent: number }) {
  const visual = elementVisuals[element];
  return (
    <div className="rounded-2xl border border-[#ead9ca] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-black"
          style={{ backgroundColor: visual.bg, color: visual.color }}
        >
          {visual.icon}
        </span>
        <span className="font-serif text-3xl font-black" style={{ color: visual.color }}>
          {percent}%
        </span>
      </div>
      <p className="mb-3 text-lg font-black">{element}</p>
      <div className="h-3 overflow-hidden rounded-full bg-paw-secondary">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: visual.color }} />
      </div>
    </div>
  );
}

function IconNote({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div className={cn("flex gap-2 rounded-xl bg-white/75", compact ? "p-0" : "p-3")}>
      <Check className="mt-1 h-4 w-4 shrink-0 text-paw-accent" />
      <span className={cn("leading-6 text-neutral-700", compact ? "text-sm font-semibold" : "text-sm")}>
        {text}
      </span>
    </div>
  );
}

function getPersonalityWords(primary: ElementType, secondary: ElementType) {
  const words: Record<ElementType, string[]> = {
    Fire: ["Social", "Expressive", "Enthusiastic"],
    Earth: ["Gentle", "Food-loving", "Steady"],
    Metal: ["Loyal", "Sensitive", "Predictable"],
    Water: ["Thoughtful", "Observant", "Wise"],
    Wood: ["Athletic", "Determined", "Protective"]
  };
  return Array.from(new Set([...words[primary], ...words[secondary]])).slice(0, 4);
}

function getEnergyDetails(energyType: string) {
  if (energyType === "Yin") {
    return {
      title: "Yin Energy",
      description: "Your dog shows a stronger Yin tendency, so comfort, warmth, and steady nourishment may feel especially supportive.",
      points: ["Prefers warmth", "Enjoys comfort", "Calmer energy", "May be more sensitive to cold weather"]
    };
  }
  if (energyType === "Yang") {
    return {
      title: "Yang Energy",
      description: "Your dog shows a stronger Yang tendency, so cooling balance, hydration, and activity-aware meals may suit them well.",
      points: ["Naturally active", "May run warm", "Seeks cool resting spots", "Benefits from cooling balance"]
    };
  }
  return {
    title: "Balanced Energy",
    description: "Your dog shows a balanced Yin-Yang pattern, so neutral recipes and steady rotation are a good fit.",
    points: ["Flexible routine", "Balanced activity", "Neutral food profile", "Easy to rotate gently"]
  };
}

function getPracticalMeaning(primary: ElementType, energyType: string, wellness: string[]) {
  const base: Record<ElementType, string[]> = {
    Fire: ["Social interaction", "Cooling rest spaces", "Play with recovery time"],
    Earth: ["Consistent routines", "Predictable meal times", "Gentle transitions"],
    Metal: ["Quiet environments", "Trusted relationships", "Simple routines"],
    Water: ["Warm sleeping spots", "Patient encouragement", "Low-pressure exploration"],
    Wood: ["Purposeful activity", "Clear boundaries", "Mental challenges"]
  };
  const energy = energyType === "Yin" ? "Gentle exercise" : energyType === "Yang" ? "Cooling downtime" : "Balanced daily rhythm";
  const wellnessNote = wellness.includes("Arthritis")
    ? "Mobility-aware movement"
    : wellness.includes("Digestive sensitivity")
      ? "Slow food transitions"
      : wellness.includes("Anxiety")
        ? "Calm, predictable environments"
        : "Close family connection";
  return Array.from(new Set([...base[primary], energy, wellnessNote])).slice(0, 6);
}

function buildPremiumSummary(
  dogName: string,
  result: ReturnType<typeof scoreQuiz>,
  answers: QuizAnswers
) {
  const wellness = answers.wellness.filter((item) => item !== "None");
  const wellnessText =
    wellness.length > 0
      ? `Because ${dogName} also showed ${wellness.slice(0, 3).join(", ").toLowerCase()} tendencies`
      : `Because ${dogName}'s wellness answers were fairly balanced`;
  const goalText = answers.goal ? `and the selected goal was ${answers.goal.toLowerCase()}` : "and the goal is general wellness";
  return `${dogName}'s profile suggests a ${result.primaryElement}-${result.secondaryElement} ${result.energyType} constitution. Dogs with this profile often combine ${getPersonalityWords(result.primaryElement, result.secondaryElement).join(", ").toLowerCase()} traits with a distinctive food-energy pattern. ${wellnessText}, ${goalText}, we prioritized recipes and ingredients that fit both personality and day-to-day wellness needs.`;
}

function recipeBadge(index: number) {
  return index === 0 ? "Best Match" : index === 1 ? "Excellent Match" : "Good Match";
}

function recipeIngredients(name: string) {
  const ingredients: Record<string, string[]> = {
    "GC Beef Greens": ["Beef", "Leafy greens", "Zucchini", "Parsley", "Omega-rich oil"],
    "GC Chicken Harmony": ["Chicken", "Pumpkin", "Carrot", "Green beans", "Bone broth"],
    "GC Porky Beefy": ["Pork", "Beef", "Sweet potato", "Carrot", "Omega-rich oil"],
    "GC Rabbit Sockeye": ["Rabbit", "Sockeye salmon", "Zucchini", "Spinach", "Blueberries"],
    "GC Pork Complete": ["Pork", "Leafy greens", "Pumpkin", "Carrot", "Hemp seed oil"],
    "GC Turkey Recipe": ["Turkey", "Pumpkin", "Green beans", "Carrot", "Blueberries"],
    "Chicken Recipe": ["Chicken", "Pumpkin", "Carrot", "Green beans", "Egg"],
    "Pork Red": ["Pork", "Red vegetables", "Zucchini", "Leafy greens", "Omega-rich oil"],
    "Beef Dandelion Zucchini": ["Beef", "Dandelion greens", "Zucchini", "Carrot", "Parsley"],
    "Duck Recipe": ["Duck", "Zucchini", "Leafy greens", "Blueberries", "Omega-rich oil"],
    "Lamb Recipe": ["Lamb", "Carrot", "Sweet potato", "Kale", "Omega-rich oil"]
  };
  return ingredients[name] || ["Whole protein", "Vegetables", "Moisture", "Balanced fats"];
}

function recipeMatchBullets(
  recipe: ReturnType<typeof scoreQuiz>["recipes"][number],
  result: ReturnType<typeof scoreQuiz>,
  answers: QuizAnswers
) {
  const bullets = [
    `${recipe.thermal} thermal profile supports ${result.energyType} energy balance`,
    recipe.elements.includes(result.primaryElement)
      ? `Strong match for ${result.primaryElement} constitution`
      : `Supports ${result.secondaryElement} secondary tendencies`,
    ...recipe.wellnessReasons.map((reason) =>
      reason
        .replace("Skin and coat tendencies: prioritizes", "Supports skin and coat with")
        .replace("Digestive sensitivity: prioritizes", "Supports digestion with")
        .replace("Arthritis or mobility support: prioritizes", "Supports mobility with")
        .replace("Weight tendency: prioritizes", "Supports weight goals with")
        .replace("Anxiety tendency: prioritizes", "Supports calm energy with")
        .replace("Cold sensitivity: prioritizes", "Supports cold sensitivity with")
        .replace(".", "")
    ),
    answers.goal ? `Aligns with the goal of ${answers.goal.toLowerCase()}` : "Works as a thoughtful rotation option"
  ];
  return Array.from(new Set(bullets)).slice(0, 4);
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
