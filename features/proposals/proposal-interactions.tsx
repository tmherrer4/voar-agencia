"use client";

import { useId, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  CheckIcon,
  CheckCircle2Icon,
  ChevronsDownIcon,
  ChevronsUpIcon,
  ClipboardIcon,
  MapPinIcon,
  MessageCircleIcon,
  PlusIcon,
  RouteIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  accommodations,
  experiences,
  itineraryStages,
  pricingTiers,
  type ExperienceCategory,
  type TierKey,
} from "@/features/proposals/proposal-data";

const experienceCategories = [
  { value: "todas", label: "Todas" },
  { value: "cultura", label: "Cultura" },
  { value: "gastronomia", label: "Gastronomia" },
  { value: "natureza", label: "Natureza" },
] as const;

const rhythmStyles: Record<string, string> = {
  Leve: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  Moderado: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  Intenso: "border-red-500/30 bg-red-500/10 text-red-700",
};

function OptionalActivities({ activities }: { activities: readonly string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
      >
        <PlusIcon
          aria-hidden="true"
          className={cn("size-3 transition-transform", open && "rotate-45")}
        />
        {open ? "Ocultar opções extras" : "Mais opções de passeios"}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Passeios e experiências opcionais
          </p>
          <ul className="space-y-1.5">
            {activities.map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-sm">
                <StarIcon
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                />
                <span className="text-muted-foreground">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ItineraryAccordion() {
  const [openStages, setOpenStages] = useState<string[]>([
    itineraryStages[0].id,
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() =>
            setOpenStages(itineraryStages.map((stage) => stage.id))
          }
          className="flex items-center gap-1.5 text-primary transition-colors hover:text-primary/80"
        >
          <ChevronsDownIcon aria-hidden="true" className="size-3.5" />
          Expandir todos
        </button>
        <span className="text-border">•</span>
        <button
          type="button"
          onClick={() => setOpenStages([])}
          className="flex items-center gap-1.5 text-primary transition-colors hover:text-primary/80"
        >
          <ChevronsUpIcon aria-hidden="true" className="size-3.5" />
          Recolher todos
        </button>
      </div>

      <Accordion
        multiple
        value={openStages}
        onValueChange={(value) => setOpenStages(value as string[])}
        className="gap-4"
      >
        {itineraryStages.map((stage, index) => (
          <AccordionItem
            key={stage.id}
            value={stage.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <AccordionTrigger className="items-center gap-4 px-5 py-4 hover:no-underline sm:px-6">
              <span className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/70 font-serif text-sm font-bold text-primary-foreground shadow-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-left">
                  <span className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase">
                    {stage.city}
                    <span className="text-border">•</span>
                    <span className="font-normal tracking-normal text-muted-foreground normal-case">
                      {stage.period}
                    </span>
                  </span>
                  <span className="block font-serif text-lg leading-snug font-semibold text-foreground sm:text-xl">
                    {stage.title}
                  </span>
                </span>
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "mr-3 hidden shrink-0 sm:inline-flex",
                  rhythmStyles[stage.rhythm],
                )}
              >
                Ritmo {stage.rhythm}
              </Badge>
            </AccordionTrigger>
            <AccordionContent
              keepMounted
              className="border-t border-border px-5 pt-5 pb-6 sm:px-6"
            >
              <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                <div className="relative aspect-video overflow-hidden rounded-xl lg:col-span-5">
                  <Image
                    src={stage.image}
                    alt={stage.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-500 motion-safe:hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-transparent to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4 text-background">
                    <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                      Destaque da etapa
                    </span>
                    <p className="mt-1 font-serif font-semibold">
                      {stage.highlight}
                    </p>
                  </div>
                </div>
                <div className="space-y-5 lg:col-span-7">
                  <p className="leading-7 text-muted-foreground">
                    {stage.summary}
                  </p>
                  <div className="flex gap-3 rounded-xl border border-border bg-secondary p-4">
                    <RouteIcon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <p className="text-sm">
                      <strong>Deslocamento:</strong> {stage.transport}
                    </p>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
                      Atividades incluídas
                    </p>
                    <ul className="space-y-2">
                      {stage.activities.map((activity) => (
                        <li
                          key={activity}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2Icon
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-primary"
                          />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <OptionalActivities activities={stage.optionalActivities} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function isExperienceCategory(value: string): value is ExperienceCategory {
  return experienceCategories.some((category) => category.value === value);
}

function ExperienceGallery() {
  const [activeCategory, setActiveCategory] =
    useState<ExperienceCategory>("todas");
  const filteredExperiences =
    activeCategory === "todas"
      ? experiences
      : experiences.filter(
          (experience) => experience.category === activeCategory,
        );

  return (
    <div>
      <ToggleGroup
        value={[activeCategory]}
        onValueChange={(values) => {
          const selected = values.at(-1);

          if (typeof selected === "string" && isExperienceCategory(selected)) {
            setActiveCategory(selected);
          }
        }}
        aria-label="Filtrar experiências por categoria"
        className="mb-8 flex w-full flex-wrap justify-center"
      >
        {experienceCategories.map((category) => (
          <ToggleGroupItem
            key={category.value}
            value={category.value}
            variant="outline"
            className="rounded-full border-primary/30 px-4 text-xs font-semibold tracking-wide uppercase aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {category.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="grid gap-5 sm:grid-cols-2">
        {filteredExperiences.map((experience) => (
          <Card
            key={experience.id}
            size="sm"
            className="flex-row items-center border border-border bg-card py-4 shadow-sm ring-0"
          >
            <div className="relative ml-4 size-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={experience.image}
                alt={experience.imageAlt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <CardContent className="gap-1 py-1 pr-4 pl-0">
              <span className="flex items-center gap-1 text-xs font-semibold tracking-widest text-primary uppercase">
                <MapPinIcon aria-hidden="true" className="size-3" />
                {experience.city}
              </span>
              <h3 className="font-serif text-lg leading-snug font-semibold">
                {experience.title}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {experience.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HotelGallery() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {accommodations.map((hotel) => (
        <Card
          key={hotel.id}
          className="flex flex-col justify-between border border-border bg-card py-0 shadow-sm ring-0"
        >
          <div>
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src={hotel.image}
                alt={hotel.imageAlt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 motion-safe:hover:scale-105"
              />
              <Badge className="absolute top-4 left-4 bg-foreground/85 text-background backdrop-blur-sm">
                {hotel.category}
              </Badge>
            </div>
            <CardContent className="gap-2 px-5 pt-5 pb-0">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {hotel.city}
              </p>
              <h3 className="font-serif text-xl leading-snug font-semibold">
                {hotel.title}
              </h3>
              <p className="leading-6 text-muted-foreground">
                {hotel.description}
              </p>
            </CardContent>
          </div>
          <CardContent className="px-5 pt-4 pb-5">
            <Dialog>
              <DialogTrigger
                render={<Button variant="outline" className="w-full" />}
              >
                Ver hospedagem
              </DialogTrigger>
              <DialogContent className="border border-primary/30 bg-card sm:max-w-lg">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={hotel.image}
                    alt={hotel.imageAlt}
                    fill
                    sizes="(min-width: 640px) 512px, 100vw"
                    className="object-cover"
                  />
                </div>
                <DialogHeader>
                  <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                    {hotel.city} • {hotel.category}
                  </span>
                  <DialogTitle className="font-serif text-2xl">
                    {hotel.title}
                  </DialogTitle>
                  <p className="text-xs font-medium text-muted-foreground">
                    {hotel.neighborhood}
                  </p>
                  <DialogDescription className="leading-6">
                    {hotel.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-xl border border-border bg-secondary p-4 text-sm">
                  <p className="mb-1 text-xs font-semibold tracking-widest text-primary uppercase">
                    Diferenciais
                  </p>
                  <p>{hotel.differentials}</p>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Fechar
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type PricingTiersProps = {
  selectedTier: TierKey;
  onSelectTier: (tier: TierKey) => void;
};

function PricingTiers({ selectedTier, onSelectTier }: PricingTiersProps) {
  return (
    <div className="grid items-stretch gap-8 md:grid-cols-3">
      {pricingTiers.map((tier) => {
        const isSelected = tier.key === selectedTier;

        return (
          <Card
            key={tier.key}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={() => onSelectTier(tier.key)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectTier(tier.key);
              }
            }}
            className={cn(
              "relative flex cursor-pointer flex-col justify-between border bg-card p-6 shadow-sm ring-0 transition-all focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isSelected
                ? "border-2 border-primary shadow-lg md:-translate-y-2"
                : "border-border hover:border-primary/50",
            )}
          >
            {tier.badge && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-br from-primary to-primary/70 px-4 py-1 text-[10px] font-bold tracking-widest text-primary-foreground uppercase shadow-sm">
                {tier.badge}
              </span>
            )}
            <div>
              <span className="mb-4 inline-block text-xs font-bold tracking-widest text-primary uppercase">
                {tier.name}
              </span>
              <h3 className="mb-2 font-serif text-xl font-semibold">
                {tier.title}
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <p className="mb-6 font-serif text-2xl font-semibold text-primary">
                {tier.price}
              </p>
              <ul className="mb-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckIcon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant={isSelected ? "default" : "outline"}
              className="w-full"
              onClick={(event) => {
                event.stopPropagation();
                onSelectTier(tier.key);
              }}
            >
              Selecionar {tier.name}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

type ConsultationDialogProps = {
  label?: string;
  variant?: "default" | "outline";
  className?: string;
  selectedTier?: TierKey;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function ConsultationDialog({
  label = "Solicitar atendimento",
  variant = "default",
  className,
  selectedTier,
  open,
  onOpenChange,
}: ConsultationDialogProps) {
  const formId = useId();
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");
  const tierInfo = pricingTiers.find((tier) => tier.key === selectedTier);

  async function handleCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopyStatus("copying");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();
    const message = [
      "Solicitação de atendimento — proposta demonstrativa VOAR VIAGENS",
      tierInfo ? `Categoria selecionada: ${tierInfo.name}` : null,
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `WhatsApp: ${phone}`,
      `Observações: ${notes || "Sem observações"}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard indisponível");
      }

      await navigator.clipboard.writeText(message);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {onOpenChange === undefined && (
        <DialogTrigger
          render={<Button variant={variant} className={className} size="lg" />}
        >
          <MessageCircleIcon aria-hidden="true" data-icon="inline-start" />
          {label}
        </DialogTrigger>
      )}
      <DialogContent className="border border-primary/30 bg-card sm:max-w-lg">
        <DialogHeader>
          <Badge className="mb-2 bg-primary/15 text-primary-foreground">
            Demonstração
          </Badge>
          <DialogTitle className="font-serif text-2xl">
            Prepare sua solicitação
          </DialogTitle>
          <DialogDescription className="leading-6">
            {tierInfo ? (
              <>
                Categoria <strong>{tierInfo.name}</strong> selecionada. Seus
                dados não serão enviados nem armazenados — vamos apenas montar
                uma mensagem para você copiar e encaminhar ao seu consultor.
              </>
            ) : (
              "Seus dados não serão enviados nem armazenados. Vamos apenas montar uma mensagem para você copiar e encaminhar ao seu consultor."
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleCopy}
          onInput={() => setCopyStatus("idle")}
        >
          <div className="space-y-2">
            <label htmlFor={`${formId}-name`} className="text-sm font-medium">
              Nome completo
            </label>
            <Input
              id={`${formId}-name`}
              name="name"
              autoComplete="name"
              required
              placeholder="Como podemos chamar você?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-email`}
                className="text-sm font-medium"
              >
                E-mail
              </label>
              <Input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="voce@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-phone`}
                className="text-sm font-medium"
              >
                WhatsApp
              </label>
              <Input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor={`${formId}-notes`} className="text-sm font-medium">
              Ajustes desejados
            </label>
            <Textarea
              id={`${formId}-notes`}
              name="notes"
              rows={3}
              placeholder="Conte o que gostaria de ajustar na proposta."
            />
          </div>

          <p className="min-h-5 text-sm" aria-live="polite">
            {copyStatus === "copied" && (
              <span className="flex items-center gap-2 text-foreground">
                <CheckIcon aria-hidden="true" className="size-4 text-primary" />
                Solicitação copiada. Agora envie ao seu consultor.
              </span>
            )}
            {copyStatus === "error" && (
              <span className="text-destructive">
                Não foi possível copiar. Revise a permissão do navegador.
              </span>
            )}
          </p>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Fechar
            </DialogClose>
            <Button type="submit" disabled={copyStatus === "copying"}>
              <ClipboardIcon aria-hidden="true" data-icon="inline-start" />
              {copyStatus === "copying" ? "Copiando..." : "Copiar solicitação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PersonalizationNote({ note }: { note: string }) {
  return (
    <div className="mt-8 flex max-w-2xl gap-3 rounded-2xl border border-primary/40 bg-foreground/80 p-4 backdrop-blur-md">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <SparklesIcon aria-hidden="true" className="size-4" />
      </span>
      <div>
        <p className="text-xs font-bold tracking-widest text-primary uppercase">
          Desenvolvido de acordo com suas necessidades
        </p>
        <p className="mt-1 text-sm leading-6 text-background/75">{note}</p>
      </div>
    </div>
  );
}

export {
  ConsultationDialog,
  ExperienceGallery,
  HotelGallery,
  ItineraryAccordion,
  PersonalizationNote,
  PricingTiers,
};
