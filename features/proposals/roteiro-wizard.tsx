"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  ArrowRightIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  buildDestinoSuggestionPayload,
  buildRoteiroRequestPayload,
  isDestinoVago,
  pollRoteiroStatus,
  submitDestinoSuggestionRequest,
  submitRoteiroRequest,
  type DestinoSuggestion,
  type WizardAnswers,
} from "@/features/proposals/roteiro-request";

/* -------------------------------------------------------------------------
 * Types & static question data
 * ---------------------------------------------------------------------- */

const TOTAL_STEPS = 9;
type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type WizardStep =
  | StepNumber
  | "summary"
  | "aguardando-sugestoes"
  | "sugestoes-destino"
  | "aguardando-roteiro"
  | "roteiro-pronto"
  | "erro-geracao";

const STEP_TITLES: Record<StepNumber, string> = {
  1: "Grupo",
  2: "Faixa etária",
  3: "Destino",
  4: "Duração",
  5: "Padrão / orçamento",
  6: "Hospedagem",
  7: "Ritmo & estilo",
  8: "Imperdíveis",
  9: "Outros detalhes",
};

type ChipOption = { id: string; icon: string; label: string; value: string };

const COMPOSICAO_OPTIONS: ChipOption[] = [
  { id: "comp-casal", icon: "💑", label: "Casal", value: "Casal" },
  {
    id: "comp-familia",
    icon: "👨‍👩‍👧",
    label: "Com crianças",
    value: "Família com crianças",
  },
  {
    id: "comp-amigos",
    icon: "🧑‍🤝‍🧑",
    label: "Amigos",
    value: "Grupo de amigos",
  },
  {
    id: "comp-multi",
    icon: "👴",
    label: "Multigeracional",
    value: "Multigeracional (avós/pais/filhos)",
  },
  { id: "comp-solo", icon: "🎒", label: "Solo", value: "Viagem solo" },
  {
    id: "comp-pcd",
    icon: "♿",
    label: "Mobilidade reduzida",
    value: "Alguém com mobilidade reduzida ou necessidade especial",
  },
];

const IDADE_OPTIONS: ChipOption[] = [
  { id: "idade-bebe", icon: "", label: "Bebês (0–2)", value: "Bebês (0–2 anos)" },
  {
    id: "idade-crianca",
    icon: "",
    label: "Crianças (3–11)",
    value: "Crianças (3–11 anos)",
  },
  {
    id: "idade-adolescente",
    icon: "",
    label: "Adolescentes (12–17)",
    value: "Adolescentes (12–17 anos)",
  },
  {
    id: "idade-jovemadulto",
    icon: "",
    label: "Jovens adultos (18–29)",
    value: "Jovens adultos (18–29 anos)",
  },
  {
    id: "idade-adulto",
    icon: "",
    label: "Adultos (30–59)",
    value: "Adultos (30–59 anos)",
  },
  { id: "idade-idoso", icon: "", label: "60+", value: "60 anos ou mais" },
];

const HOTEL_OPTIONS: ChipOption[] = [
  {
    id: "hotel-central",
    icon: "📍",
    label: "Localização central",
    value: "Localização central / andando",
  },
  {
    id: "hotel-boutique",
    icon: "🏛️",
    label: "Boutique",
    value: "Hotel boutique / charmoso",
  },
  {
    id: "hotel-rede",
    icon: "🏨",
    label: "Rede conhecida",
    value: "Rede internacional conhecida",
  },
  {
    id: "hotel-vista",
    icon: "🌄",
    label: "Com vista",
    value: "Vista relevante (mar, cidade, montanha)",
  },
  {
    id: "hotel-piscina",
    icon: "🏊",
    label: "Piscina/spa",
    value: "Piscina / spa / lazer",
  },
  {
    id: "hotel-cafe",
    icon: "🥐",
    label: "Café incluso",
    value: "Café da manhã incluso",
  },
  { id: "hotel-pet", icon: "🐾", label: "Pet friendly", value: "Pet friendly" },
  {
    id: "hotel-acessivel",
    icon: "♿",
    label: "Acessível",
    value: "Estrutura acessível",
  },
];

const ESTILO_OPTIONS: ChipOption[] = [
  {
    id: "estilo-tradicional",
    icon: "🏛️",
    label: "Tradicionais",
    value: "Passeios tradicionais / pontos turísticos",
  },
  {
    id: "estilo-natureza",
    icon: "🏞️",
    label: "Natureza",
    value: "Natureza e paisagens",
  },
  {
    id: "estilo-esportivo",
    icon: "🚴",
    label: "Esportivo/aventura",
    value: "Viés esportivo / aventura",
  },
  {
    id: "estilo-gastronomia",
    icon: "🍽️",
    label: "Gastronomia",
    value: "Gastronomia e vida local",
  },
  {
    id: "estilo-cultura",
    icon: "🎨",
    label: "Cultura/arte",
    value: "Cultura, arte e museus",
  },
  { id: "estilo-vidanoturna", icon: "🌙", label: "Vida noturna", value: "Vida noturna" },
  { id: "estilo-compras", icon: "🛍️", label: "Compras", value: "Compras" },
  {
    id: "estilo-bemestar",
    icon: "🧘",
    label: "Bem-estar",
    value: "Bem-estar / relaxamento",
  },
];

type RadioOption = { id: string; title: string; desc: string; value: string };

const PADRAO_OPTIONS: RadioOption[] = [
  {
    id: "padrao-essential",
    title: "Essential",
    desc: "Conforto e eficiência, com localização central e itens prioritários.",
    value: "Essential — conforto e eficiência, localização central",
  },
  {
    id: "padrao-comfort",
    title: "Comfort",
    desc: "Hospedagens boutique, passeios guiados e experiências gastronômicas.",
    value: "Comfort — hospedagens selecionadas e passeios guiados",
  },
  {
    id: "padrao-premium",
    title: "Premium",
    desc: "Hospedagens 5★, primeira classe e acompanhamento dedicado.",
    value: "Premium — hospedagens icônicas e acompanhamento dedicado",
  },
  {
    id: "padrao-valor",
    title: "Prefiro definir por valor total",
    desc: "Informe abaixo o orçamento de referência para a viagem inteira.",
    value: "Definir por valor total",
  },
];

const RITMO_OPTIONS: RadioOption[] = [
  {
    id: "ritmo-intenso",
    title: "Intenso",
    desc: "Agenda cheia, aproveitando o máximo de passeios possível em cada dia.",
    value: "Intenso — quero aproveitar o máximo de passeios possível",
  },
  {
    id: "ritmo-moderado",
    title: "Moderado",
    desc: "Passeios principais bem escolhidos, com tempo livre intercalado.",
    value: "Moderado — passeios principais intercalados com tempo livre",
  },
  {
    id: "ritmo-leve",
    title: "Leve",
    desc: "Só os passeios essenciais, com bastante tempo livre para descanso.",
    value: "Leve — só os passeios essenciais, bastante tempo livre",
  },
];

const MUST_DO_SUGGESTIONS = [
  { label: "+ Show com data marcada", value: "Show / evento com data marcada" },
  {
    label: "+ Jogo/evento esportivo",
    value: "Jogo de futebol / evento esportivo",
  },
  { label: "+ Museu específico", value: "Museu ou ponto turístico específico" },
  {
    label: "+ Celebração especial",
    value: "Celebração especial (aniversário, lua de mel)",
  },
];

const INITIAL_ANSWERS: WizardAnswers = {
  groupSize: 2,
  composicao: [],
  idade: [],
  destino: "",
  destinoJaVisitado: "",
  totalDays: 8,
  periodoViagem: "",
  padrao: PADRAO_OPTIONS[1].value,
  orcamentoValor: "",
  padraoObs: "",
  hotelPref: [],
  hotelObs: "",
  ritmo: RITMO_OPTIONS[1].value,
  estilo: [],
  mustDo: [],
  outrosDetalhes: "",
};

/* -------------------------------------------------------------------------
 * Small shared UI pieces
 * ---------------------------------------------------------------------- */

function FieldLabel({
  children,
  sublabel,
}: {
  children: React.ReactNode;
  sublabel?: string;
}) {
  return (
    <span className="mb-2.5 block text-[0.78rem] font-bold tracking-wide text-foreground">
      {children}{" "}
      {sublabel && (
        <span className="font-medium tracking-normal text-muted-foreground">
          {sublabel}
        </span>
      )}
    </span>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex w-fit items-center gap-4 rounded-full border border-border bg-secondary p-1.5">
      <button
        type="button"
        aria-label="Diminuir"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-bold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
      >
        <MinusIcon aria-hidden="true" className="size-4" />
      </button>
      <output className="min-w-12 text-center font-serif text-xl font-bold">
        {value}
      </output>
      <button
        type="button"
        aria-label="Aumentar"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-9 items-center justify-center rounded-full border border-border bg-card font-bold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
      >
        <PlusIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function ChipGrid({
  name,
  options,
  selected,
  onToggle,
}: {
  name: string;
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
      {options.map((option) => {
        const checked = selected.includes(option.value);
        return (
          <div key={option.id} className="relative h-full">
            <input
              type="checkbox"
              id={option.id}
              name={name}
              checked={checked}
              onChange={() => onToggle(option.value)}
              className="peer absolute opacity-0"
            />
            <label
              htmlFor={option.id}
              className="flex h-full min-h-[3.1rem] min-w-0 cursor-pointer items-center gap-2 text-wrap-break-word rounded-xl border-[1.5px] border-border bg-card px-3.5 py-2.5 text-[0.78rem] leading-tight font-semibold text-foreground transition-colors peer-checked:border-primary peer-checked:bg-accent peer-checked:shadow-[inset_0_0_0_1px_var(--primary)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
            >
              {option.icon && (
                <span className="shrink-0 text-base leading-none">
                  {option.icon}
                </span>
              )}
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

function OptionCardList({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <div key={option.id} className="relative">
            <input
              type="radio"
              id={option.id}
              name={name}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="peer absolute opacity-0"
            />
            <label
              htmlFor={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] border-border bg-card px-4 py-3.5 transition-colors peer-checked:border-primary peer-checked:bg-accent peer-checked:shadow-[inset_0_0_0_1px_var(--primary)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-[1.1rem] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border",
                  checked && "border-primary",
                )}
              >
                <span
                  className={cn(
                    "size-[0.55rem] scale-40 rounded-full bg-primary opacity-0 transition-all",
                    checked && "scale-100 opacity-100",
                  )}
                />
              </span>
              <span className="flex flex-col">
                <span className="text-[0.88rem] font-bold">{option.title}</span>
                <span className="mt-0.5 text-[0.78rem] leading-relaxed text-muted-foreground">
                  {option.desc}
                </span>
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

function EmptyValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium text-[#b8b2a4] italic">{children}</span>
  );
}

function SummaryTags({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (!items.length) return <EmptyValue>{emptyLabel}</EmptyValue>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border bg-accent px-2.5 py-1 text-[0.76rem] font-semibold"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-t border-dashed border-border py-1.5 first:border-t-0 first:pt-0">
      <span className="shrink-0 font-semibold text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function SummaryCard({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: StepNumber;
  onEdit: (step: StepNumber) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3.5 overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between bg-secondary px-4 py-3 text-[0.72rem] font-bold tracking-wider text-[#a3813f] uppercase">
        {title}
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-[0.72rem] font-bold tracking-normal text-muted-foreground uppercase-none normal-case underline"
        >
          Editar
        </button>
      </div>
      <div className="px-4 pt-3.5 pb-4 text-[0.86rem] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Main wizard component
 * ---------------------------------------------------------------------- */

type RoteiroWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function RoteiroWizard({ open, onOpenChange }: RoteiroWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [answers, setAnswers] = useState<WizardAnswers>(INITIAL_ANSWERS);
  const [mustDoDraft, setMustDoDraft] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [destinoSuggestions, setDestinoSuggestions] = useState<
    DestinoSuggestion[]
  >([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null,
  );
  const [ajustesLivres, setAjustesLivres] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [roteiroUrl, setRoteiroUrl] = useState<string | null>(null);
  const titleId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const pollTimeoutRef = useRef<number | null>(null);

  function stopPolling() {
    if (pollTimeoutRef.current !== null) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }

  // Garante que nenhum polling continue rodando depois que o componente
  // sair da árvore (ex: navegação para outra página com o wizard aberto).
  useEffect(() => stopPolling, []);

  function resetAndClose(next: boolean) {
    onOpenChange(next);
    if (!next) {
      stopPolling();
      // Reset for next time the wizard is opened, after the close animation.
      window.setTimeout(() => {
        setStep(1);
        setAnswers(INITIAL_ANSWERS);
        setMustDoDraft("");
        setConfirming(false);
        setPendingRequestId(null);
        setDestinoSuggestions([]);
        setSelectedSuggestion(null);
        setAjustesLivres("");
        setGenerationError(null);
        setRoteiroUrl(null);
      }, 200);
    }
  }

  function scrollBodyToTop() {
    bodyRef.current?.scrollTo({ top: 0 });
  }

  function goToStep(next: WizardStep) {
    setStep(next);
    scrollBodyToTop();
  }

  function goNext() {
    if (typeof step === "number" && step < TOTAL_STEPS) {
      goToStep((step + 1) as StepNumber);
    } else if (step !== "summary") {
      goToStep("summary");
    }
  }

  function goBack() {
    if (typeof step === "number" && step > 1) {
      goToStep((step - 1) as StepNumber);
    }
  }

  function toggleInList(key: "composicao" | "idade" | "hotelPref" | "estilo", value: string) {
    setAnswers((prev) => {
      const list = prev[key];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  function addMustDoTag(raw: string) {
    const trimmed = raw.trim();
    if (trimmed && !answers.mustDo.includes(trimmed)) {
      setAnswers((prev) => ({ ...prev, mustDo: [...prev.mustDo, trimmed] }));
    }
    setMustDoDraft("");
  }

  function removeMustDoTag(value: string) {
    setAnswers((prev) => ({
      ...prev,
      mustDo: prev.mustDo.filter((item) => item !== value),
    }));
  }

  function handleMustDoKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addMustDoTag(mustDoDraft);
    }
  }

  const POLL_INTERVAL_MS = 4000;

  function pollForSuggestions(id: string) {
    pollTimeoutRef.current = window.setTimeout(async () => {
      const result = await pollRoteiroStatus(id);
      if (result.status === "respondido-sugestoes") {
        setDestinoSuggestions(result.sugestoes);
        goToStep("sugestoes-destino");
        return;
      }
      if (result.status === "erro") {
        setGenerationError(result.error);
        goToStep("erro-geracao");
        return;
      }
      pollForSuggestions(id);
    }, POLL_INTERVAL_MS);
  }

  function pollForRoteiro(id: string) {
    pollTimeoutRef.current = window.setTimeout(async () => {
      const result = await pollRoteiroStatus(id);
      if (result.status === "respondido-roteiro") {
        setRoteiroUrl(result.url);
        goToStep("roteiro-pronto");
        return;
      }
      if (result.status === "erro") {
        setGenerationError(result.error);
        goToStep("erro-geracao");
        return;
      }
      pollForRoteiro(id);
    }, POLL_INTERVAL_MS);
  }

  async function handleConfirmGenerate() {
    setConfirming(true);
    setGenerationError(null);

    const destinoVago = isDestinoVago(answers.destino);

    if (destinoVago) {
      const payload = buildDestinoSuggestionPayload(answers);
      const result = await submitDestinoSuggestionRequest(payload);
      setConfirming(false);
      if (!result.ok) {
        setGenerationError(result.error);
        goToStep("erro-geracao");
        return;
      }
      setPendingRequestId(result.id);
      goToStep("aguardando-sugestoes");
      pollForSuggestions(result.id);
      return;
    }

    const payload = buildRoteiroRequestPayload(answers);
    const result = await submitRoteiroRequest(payload);
    setConfirming(false);
    if (!result.ok) {
      setGenerationError(result.error);
      goToStep("erro-geracao");
      return;
    }
    setPendingRequestId(result.id);
    goToStep("aguardando-roteiro");
    pollForRoteiro(result.id);
  }

  async function handleConfirmDestinoEscolhido() {
    if (!selectedSuggestion) return;
    setConfirming(true);
    setGenerationError(null);

    const payload = buildRoteiroRequestPayload(answers, {
      destinoEscolhido: selectedSuggestion,
      ajustesLivres: ajustesLivres || undefined,
    });
    const result = await submitRoteiroRequest(payload);
    setConfirming(false);
    if (!result.ok) {
      setGenerationError(result.error);
      goToStep("erro-geracao");
      return;
    }
    setPendingRequestId(result.id);
    goToStep("aguardando-roteiro");
    pollForRoteiro(result.id);
  }

  const progressPercent =
    typeof step === "number" ? Math.round((step / TOTAL_STEPS) * 100) : 100;

  // Telas "especiais" (fora das 9 perguntas) não mostram o cabeçalho padrão
  // com barra de progresso nem o rodapé Voltar/Próximo — cada uma define
  // sua própria navegação.
  const isQuestionStep = typeof step === "number";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={resetAndClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          aria-labelledby={titleId}
          className="fixed top-1/2 left-1/2 z-50 flex h-full max-h-[100vh] w-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border-0 bg-card outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:h-auto sm:max-h-[min(88vh,760px)] sm:max-w-[640px] sm:rounded-3xl sm:border sm:border-border sm:shadow-[0_30px_70px_-20px_rgba(18,18,18,0.35)]"
        >
          {isQuestionStep ? (
            <div className="border-b border-border px-7 pt-6 pb-4.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1.5 text-[0.68rem] font-bold tracking-widest text-[#a3813f] uppercase">
                    Etapa {step} de {TOTAL_STEPS}
                  </p>
                  <h2
                    id={titleId}
                    className="font-serif text-[1.4rem] leading-tight font-semibold"
                  >
                    Novo Roteiro
                  </h2>
                </div>
                <DialogPrimitive.Close
                  aria-label="Fechar"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:bg-border hover:text-foreground"
                >
                  <XIcon aria-hidden="true" className="size-4" />
                </DialogPrimitive.Close>
              </div>
              <div className="mt-4.5 h-[5px] overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[#8a7040] transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[0.72rem] font-semibold tracking-wide text-muted-foreground">
                Pergunta {step} de {TOTAL_STEPS} · {STEP_TITLES[step as StepNumber]}
              </p>
            </div>
          ) : null}

          <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
            {step === 1 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Qual o tamanho total do grupo?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Conte todas as pessoas que vão viajar, incluindo crianças. Isso
                  define quartos, veículos e capacidade dos passeios.
                </p>

                <div>
                  <FieldLabel>Total de viajantes</FieldLabel>
                  <NumberStepper
                    value={answers.groupSize}
                    min={1}
                    max={40}
                    onChange={(next) =>
                      setAnswers((prev) => ({ ...prev, groupSize: next }))
                    }
                  />
                </div>

                <div className="mt-6">
                  <FieldLabel sublabel="(selecione quantas se aplicarem)">
                    Composição do grupo
                  </FieldLabel>
                  <ChipGrid
                    name="composicao"
                    options={COMPOSICAO_OPTIONS}
                    selected={answers.composicao}
                    onToggle={(value) => toggleInList("composicao", value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Qual a faixa etária do grupo?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Selecione todas as faixas presentes na viagem — ajuda a calibrar
                  ritmo, acessibilidade e tipo de passeio.
                </p>
                <div>
                  <FieldLabel>Faixas etárias presentes</FieldLabel>
                  <ChipGrid
                    name="idade"
                    options={IDADE_OPTIONS}
                    selected={answers.idade}
                    onToggle={(value) => toggleInList("idade", value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Para onde vocês querem ir?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Pode ser um destino já decidido ou apenas uma direção — descreva
                  como preferir. Nós refinamos a partir daí.
                </p>

                <div>
                  <FieldLabel>Destino desejado</FieldLabel>
                  <textarea
                    rows={4}
                    value={answers.destino}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setAnswers((prev) => ({
                        ...prev,
                        destino: event.target.value,
                      }))
                    }
                    placeholder='Ex.: "Quero ir para Londres, Holanda, França e Madri" ou "Gostaria de um roteiro pela Europa, com foco no leste europeu" ou ainda "Praia, clima quente, sem voo muito longo".'
                    className="w-full resize-y rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                  <p className="mt-1.5 text-[0.72rem] text-muted-foreground">
                    Quanto mais detalhes (cidades, região, clima desejado, o que
                    quer evitar), melhor o roteiro fica.
                  </p>
                </div>

                <div className="mt-6">
                  <FieldLabel sublabel="(opcional)">
                    Já esteve em algum desses lugares?
                  </FieldLabel>
                  <input
                    type="text"
                    value={answers.destinoJaVisitado}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setAnswers((prev) => ({
                        ...prev,
                        destinoJaVisitado: event.target.value,
                      }))
                    }
                    placeholder="Ex.: já fomos a Paris em 2022, gostaríamos de conhecer lugares novos"
                    className="w-full rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Quantos dias de viagem?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Considere do embarque ao retorno. Se ainda não houver datas
                  fechadas, um período aproximado já ajuda.
                </p>

                <div>
                  <FieldLabel>Total de dias</FieldLabel>
                  <NumberStepper
                    value={answers.totalDays}
                    min={1}
                    max={60}
                    onChange={(next) =>
                      setAnswers((prev) => ({ ...prev, totalDays: next }))
                    }
                  />
                </div>

                <div className="mt-6">
                  <FieldLabel sublabel="(opcional)">Período previsto</FieldLabel>
                  <input
                    type="text"
                    value={answers.periodoViagem}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setAnswers((prev) => ({
                        ...prev,
                        periodoViagem: event.target.value,
                      }))
                    }
                    placeholder='Ex.: primeira quinzena de julho de 2027, ou "ainda flexível"'
                    className="w-full rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Qual o padrão da viagem?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Pode descrever um padrão geral (econômico, conforto, luxo) ou já
                  indicar um valor total de referência para a viagem toda.
                </p>

                <div>
                  <FieldLabel>Padrão desejado</FieldLabel>
                  <OptionCardList
                    name="padrao"
                    options={PADRAO_OPTIONS}
                    value={answers.padrao}
                    onChange={(value) =>
                      setAnswers((prev) => ({ ...prev, padrao: value }))
                    }
                  />
                </div>

                {answers.padrao === "Definir por valor total" && (
                  <div className="mt-6">
                    <FieldLabel>Valor total de referência (R$)</FieldLabel>
                    <input
                      type="text"
                      value={answers.orcamentoValor}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setAnswers((prev) => ({
                          ...prev,
                          orcamentoValor: event.target.value,
                        }))
                      }
                      placeholder="Ex.: R$ 45.000 para o grupo todo"
                      className="w-full rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                    />
                  </div>
                )}

                <div className="mt-4 flex gap-2.5 rounded-xl bg-secondary px-3.5 py-3 text-[0.78rem] leading-relaxed text-muted-foreground">
                  <span className="shrink-0">💡</span>
                  <span>
                    Se preferir, descreva livremente em vez de escolher uma opção —
                    use o campo abaixo para nuances (ex.: &ldquo;conforto na
                    hospedagem, mas econômico nos deslocamentos&rdquo;).
                  </span>
                </div>
                <div className="mt-6">
                  <input
                    type="text"
                    value={answers.padraoObs}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setAnswers((prev) => ({
                        ...prev,
                        padraoObs: event.target.value,
                      }))
                    }
                    placeholder="Observações sobre padrão/orçamento (opcional)"
                    className="w-full rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Alguma preferência de hospedagem?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Se deixar em branco, usamos o padrão definido na etapa anterior
                  como referência para selecionar as opções.
                </p>

                <div>
                  <FieldLabel sublabel="(selecione quantas fizerem sentido)">
                    Tipo de hospedagem
                  </FieldLabel>
                  <ChipGrid
                    name="hotelPref"
                    options={HOTEL_OPTIONS}
                    selected={answers.hotelPref}
                    onToggle={(value) => toggleInList("hotelPref", value)}
                  />
                </div>

                <div className="mt-6">
                  <FieldLabel sublabel="(opcional)">
                    Outras exigências de hospedagem
                  </FieldLabel>
                  <input
                    type="text"
                    value={answers.hotelObs}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setAnswers((prev) => ({
                        ...prev,
                        hotelObs: event.target.value,
                      }))
                    }
                    placeholder='Ex.: preferimos sempre 2 quartos separados, ou "nada acima do 3º andar sem elevador"'
                    className="w-full rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Qual ritmo a viagem deve ter?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Isso define quantos compromissos entram por dia e quanto tempo
                  livre sobra na agenda.
                </p>

                <div>
                  <FieldLabel>Ritmo dos passeios</FieldLabel>
                  <OptionCardList
                    name="ritmo"
                    options={RITMO_OPTIONS}
                    value={answers.ritmo}
                    onChange={(value) =>
                      setAnswers((prev) => ({ ...prev, ritmo: value }))
                    }
                  />
                </div>

                <div className="mt-6">
                  <FieldLabel sublabel="(selecione quantos fizerem sentido)">
                    Estilo de passeio preferido
                  </FieldLabel>
                  <ChipGrid
                    name="estilo"
                    options={ESTILO_OPTIONS}
                    selected={answers.estilo}
                    onToggle={(value) => toggleInList("estilo", value)}
                  />
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Algum passeio ou evento indispensável?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Liste o que definitivamente deve entrar no roteiro — vamos montar
                  a agenda ao redor disso.
                </p>

                <div>
                  <FieldLabel>Passeios e eventos obrigatórios</FieldLabel>
                  <div className="flex min-h-12 flex-wrap gap-1.5 rounded-xl border-[1.5px] border-border bg-card p-2.5 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(197,160,89,0.18)]">
                    {answers.mustDo.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-accent py-1 pr-1 pl-2.5 text-[0.78rem] font-semibold"
                      >
                        {tag}
                        <button
                          type="button"
                          aria-label="Remover"
                          onClick={() => removeMustDoTag(tag)}
                          className="flex size-[1.1rem] items-center justify-center rounded-full bg-foreground/8 text-[0.7rem] leading-none text-foreground"
                        >
                          <XIcon aria-hidden="true" className="size-2.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={mustDoDraft}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setMustDoDraft(event.target.value)
                      }
                      onKeyDown={handleMustDoKeyDown}
                      placeholder="Digite e pressione Enter para adicionar…"
                      className="min-w-[120px] flex-1 border-0 bg-transparent p-1.5 text-[0.85rem] outline-none focus:ring-0"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {MUST_DO_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion.value}
                        type="button"
                        onClick={() => addMustDoTag(suggestion.value)}
                        className="rounded-full border border-dashed border-border px-2.5 py-1.5 text-[0.74rem] font-semibold text-muted-foreground transition hover:border-primary hover:text-[#a3813f]"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Mais algum detalhe importante?
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Restrições alimentares, questões de saúde, datas fixas,
                  documentação, medos ou qualquer coisa que ajude a montar um
                  roteiro sob medida.
                </p>

                <div>
                  <FieldLabel sublabel="(opcional)">
                    Detalhes adicionais
                  </FieldLabel>
                  <textarea
                    rows={5}
                    value={answers.outrosDetalhes}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setAnswers((prev) => ({
                        ...prev,
                        outrosDetalhes: event.target.value,
                      }))
                    }
                    placeholder="Ex.: um dos viajantes tem restrição alimentar a glúten, preferimos evitar voos com mais de uma conexão, é uma viagem de lua de mel…"
                    className="w-full resize-y rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === "summary" && (
              <div>
                <div className="mb-6 flex items-center gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#3f7d5c] text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="mb-0.5 text-[0.68rem] font-bold tracking-widest text-[#a3813f] uppercase">
                      Revisão final
                    </p>
                    <h2
                      id={titleId}
                      className="font-serif text-[1.2rem] font-semibold"
                    >
                      Confira antes de gerar o roteiro
                    </h2>
                  </div>
                  <DialogPrimitive.Close
                    aria-label="Fechar"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:bg-border hover:text-foreground"
                  >
                    <XIcon aria-hidden="true" className="size-4" />
                  </DialogPrimitive.Close>
                </div>

                <SummaryCard title="Grupo" step={1} onEdit={goToStep}>
                  <SummaryRow
                    label="Tamanho"
                    value={`${answers.groupSize} pessoa${answers.groupSize > 1 ? "s" : ""}`}
                  />
                  <SummaryRow
                    label="Composição"
                    value={
                      answers.composicao.length ? (
                        answers.composicao.join(", ")
                      ) : (
                        <EmptyValue>não informado</EmptyValue>
                      )
                    }
                  />
                </SummaryCard>

                <SummaryCard title="Faixa etária" step={2} onEdit={goToStep}>
                  <SummaryTags items={answers.idade} emptyLabel="não informado" />
                </SummaryCard>

                <SummaryCard title="Destino" step={3} onEdit={goToStep}>
                  <p className="mb-2">
                    {answers.destino || (
                      <EmptyValue>nenhum destino descrito</EmptyValue>
                    )}
                  </p>
                  {answers.destinoJaVisitado && (
                    <SummaryRow
                      label="Já visitou"
                      value={answers.destinoJaVisitado}
                    />
                  )}
                </SummaryCard>

                <SummaryCard title="Duração" step={4} onEdit={goToStep}>
                  <SummaryRow label="Total de dias" value={`${answers.totalDays} dias`} />
                  <SummaryRow
                    label="Período previsto"
                    value={
                      answers.periodoViagem || (
                        <EmptyValue>flexível / não informado</EmptyValue>
                      )
                    }
                  />
                </SummaryCard>

                <SummaryCard title="Padrão / orçamento" step={5} onEdit={goToStep}>
                  <SummaryRow
                    label="Padrão"
                    value={answers.padrao || <EmptyValue>não informado</EmptyValue>}
                  />
                  {answers.orcamentoValor && (
                    <SummaryRow
                      label="Valor de referência"
                      value={answers.orcamentoValor}
                    />
                  )}
                  {answers.padraoObs && (
                    <SummaryRow label="Observações" value={answers.padraoObs} />
                  )}
                </SummaryCard>

                <SummaryCard title="Hospedagem" step={6} onEdit={goToStep}>
                  <SummaryTags
                    items={answers.hotelPref}
                    emptyLabel="sem preferência — usar padrão da etapa anterior"
                  />
                  {answers.hotelObs && (
                    <p className="mt-2.5">{answers.hotelObs}</p>
                  )}
                </SummaryCard>

                <SummaryCard title="Ritmo & estilo" step={7} onEdit={goToStep}>
                  <SummaryRow
                    label="Ritmo"
                    value={answers.ritmo || <EmptyValue>não informado</EmptyValue>}
                  />
                  <p className="mt-2.5 mb-1.5 text-[0.78rem] font-bold text-muted-foreground">
                    Estilo preferido
                  </p>
                  <SummaryTags items={answers.estilo} emptyLabel="não informado" />
                </SummaryCard>

                <SummaryCard title="Imperdíveis" step={8} onEdit={goToStep}>
                  <SummaryTags
                    items={answers.mustDo}
                    emptyLabel="nenhum item obrigatório informado"
                  />
                </SummaryCard>

                <SummaryCard title="Outros detalhes" step={9} onEdit={goToStep}>
                  {answers.outrosDetalhes || (
                    <EmptyValue>nenhum detalhe adicional</EmptyValue>
                  )}
                </SummaryCard>
              </div>
            )}

            {step === "aguardando-sugestoes" && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <SparklesIcon aria-hidden="true" className="size-6 animate-pulse" />
                </span>
                <h3 className="mb-2 font-serif text-xl font-semibold">
                  Buscando os melhores destinos para vocês
                </h3>
                <p className="max-w-sm text-[0.88rem] leading-relaxed text-muted-foreground">
                  Como o destino ainda está em aberto, nosso consultor está
                  preparando 3 sugestões com base no perfil da viagem que vocês
                  descreveram. Isso pode levar alguns minutos.
                </p>
              </div>
            )}

            {step === "sugestoes-destino" && (
              <div>
                <h3 className="mb-1.5 font-serif text-xl font-semibold">
                  Para onde vocês vão? Preparamos 3 opções
                </h3>
                <p className="mb-5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Escolha a sugestão que mais combina com vocês. Se quiser
                  ajustar alguma coisa, use o campo abaixo antes de confirmar.
                </p>

                <div className="flex flex-col gap-2.5">
                  {destinoSuggestions.map((suggestion) => {
                    const checked = selectedSuggestion === suggestion.titulo;
                    return (
                      <button
                        key={suggestion.titulo}
                        type="button"
                        onClick={() => setSelectedSuggestion(suggestion.titulo)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-2xl border-[1.5px] border-border bg-card px-4 py-3.5 text-left transition-colors",
                          checked &&
                            "border-primary bg-accent shadow-[inset_0_0_0_1px_var(--primary)]",
                        )}
                      >
                        <span className="flex w-full items-center justify-between gap-2">
                          <span className="font-serif text-base font-semibold">
                            {suggestion.titulo}
                          </span>
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border",
                              checked && "border-primary bg-primary text-primary-foreground",
                            )}
                          >
                            {checked && <CheckIcon aria-hidden="true" className="size-3" />}
                          </span>
                        </span>
                        <span className="text-[0.82rem] leading-relaxed text-muted-foreground">
                          {suggestion.motivo}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <FieldLabel sublabel="(opcional)">
                    Quer ajustar algo nessas opções?
                  </FieldLabel>
                  <textarea
                    rows={3}
                    value={ajustesLivres}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setAjustesLivres(event.target.value)
                    }
                    placeholder="Ex.: gostaríamos da opção 2, mas preferimos menos dias na capital e mais tempo na costa."
                    className="w-full resize-y rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 text-[0.9rem] text-foreground placeholder:text-[#b8b2a4] focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.18)] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === "aguardando-roteiro" && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <SparklesIcon aria-hidden="true" className="size-6 animate-pulse" />
                </span>
                <h3 className="mb-2 font-serif text-xl font-semibold">
                  Montando o roteiro completo
                </h3>
                <p className="max-w-sm text-[0.88rem] leading-relaxed text-muted-foreground">
                  Estamos organizando o dia a dia, verificando horários e
                  valores de ingressos e preparando as opções de hospedagem.
                  Isso pode levar alguns minutos.
                </p>
              </div>
            )}

            {step === "roteiro-pronto" && (
              <div>
                <div className="mb-5 flex items-center gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#3f7d5c] text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="mb-0.5 text-[0.68rem] font-bold tracking-widest text-[#a3813f] uppercase">
                      Roteiro pronto
                    </p>
                    <h2 className="font-serif text-[1.2rem] font-semibold">
                      Seu roteiro foi gerado
                    </h2>
                  </div>
                </div>
                <p className="mb-4 text-[0.85rem] leading-relaxed text-muted-foreground">
                  O roteiro completo foi preparado, com dia a dia, hospedagens
                  e fotos reais. Abra a proposta completa para revisar com o
                  cliente.
                </p>
                {roteiroUrl && (
                  <a
                    href={roteiroUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-4 flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-primary bg-accent px-4 py-3.5 text-[0.85rem] font-bold text-foreground transition hover:bg-primary"
                  >
                    Abrir proposta completa
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </a>
                )}
                {pendingRequestId && (
                  <p className="rounded-xl bg-secondary px-3.5 py-3 text-[0.76rem] text-muted-foreground">
                    Referência da solicitação:{" "}
                    <span className="font-mono">{pendingRequestId}</span>
                  </p>
                )}
              </div>
            )}

            {step === "erro-geracao" && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <XIcon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="mb-2 font-serif text-xl font-semibold">
                  Não conseguimos enviar a solicitação
                </h3>
                <p className="max-w-sm text-[0.88rem] leading-relaxed text-muted-foreground">
                  {generationError ||
                    "Ocorreu um erro inesperado. Tente novamente em instantes."}
                </p>
              </div>
            )}
          </div>

          {isQuestionStep ? (
            <div className="flex items-center justify-between gap-4 border-t border-border px-7 pt-4.5 pb-5.5">
              <div className="flex gap-1.5">
                {Array.from({ length: TOTAL_STEPS }, (_, idx) => idx + 1).map(
                  (dot) => (
                    <span
                      key={dot}
                      className={cn(
                        "h-1.5 rounded-full bg-border transition-all",
                        dot < step && "bg-primary",
                        dot === step && "w-4 bg-primary",
                        dot >= step && dot !== step && "w-1.5",
                        dot < step && "w-1.5",
                      )}
                    />
                  ),
                )}
              </div>
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-4.5 font-bold"
                  disabled={step === 1}
                  onClick={goBack}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="gap-1.5 rounded-full px-5 font-bold"
                  onClick={goNext}
                >
                  {step === TOTAL_STEPS ? "Revisar respostas" : "Próximo"}
                  <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : step === "summary" ? (
            <div className="flex items-center justify-between gap-4 border-t border-border px-7 pt-4.5 pb-5.5">
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-4.5 font-bold"
                onClick={() => goToStep(1)}
              >
                Voltar e editar
              </Button>
              <Button
                type="button"
                className="gap-1.5 rounded-full px-5 font-bold"
                disabled={confirming}
                onClick={handleConfirmGenerate}
              >
                {confirming ? (
                  "Enviando…"
                ) : (
                  <>
                    Confirmar e gerar roteiro
                    <SparklesIcon aria-hidden="true" className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          ) : step === "sugestoes-destino" ? (
            <div className="flex items-center justify-between gap-4 border-t border-border px-7 pt-4.5 pb-5.5">
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-4.5 font-bold"
                onClick={() => goToStep(3)}
              >
                Voltar
              </Button>
              <Button
                type="button"
                className="gap-1.5 rounded-full px-5 font-bold"
                disabled={confirming || !selectedSuggestion}
                onClick={handleConfirmDestinoEscolhido}
              >
                {confirming ? (
                  "Enviando…"
                ) : (
                  <>
                    Confirmar destino e gerar roteiro
                    <SparklesIcon aria-hidden="true" className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          ) : step === "roteiro-pronto" ? (
            <div className="flex items-center justify-end gap-4 border-t border-border px-7 pt-4.5 pb-5.5">
              <DialogPrimitive.Close
                render={
                  <Button
                    type="button"
                    className="gap-1.5 rounded-full px-5 font-bold"
                  />
                }
              >
                Fechar
              </DialogPrimitive.Close>
            </div>
          ) : step === "erro-geracao" ? (
            <div className="flex items-center justify-between gap-4 border-t border-border px-7 pt-4.5 pb-5.5">
              <DialogPrimitive.Close
                render={
                  <Button type="button" variant="outline" className="rounded-full px-4.5 font-bold" />
                }
              >
                Fechar
              </DialogPrimitive.Close>
              <Button
                type="button"
                className="gap-1.5 rounded-full px-5 font-bold"
                onClick={() => goToStep("summary")}
              >
                Tentar novamente
              </Button>
            </div>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* -------------------------------------------------------------------------
 * Trigger button — placed next to the brand logo in the header
 * ---------------------------------------------------------------------- */

function NewRoteiroButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-primary bg-accent px-3.5 py-2.5 text-[0.82rem] font-bold text-foreground transition hover:bg-primary hover:shadow-[0_4px_14px_-4px_rgba(197,160,89,0.55)] active:translate-y-px sm:px-4.5"
    >
      <PlusIcon aria-hidden="true" className="size-4 shrink-0" />
      <span className="hidden sm:inline">Novo Roteiro</span>
      <span className="sm:hidden">Roteiro</span>
    </button>
  );
}

function useRoteiroWizard() {
  const [open, setOpen] = useState(false);
  return useMemo(
    () => ({
      open,
      openWizard: () => setOpen(true),
      closeWizard: () => setOpen(false),
      setOpen,
    }),
    [open],
  );
}

export { RoteiroWizard, NewRoteiroButton, useRoteiroWizard };
