"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDaysIcon,
  CodeIcon,
  CompassIcon,
  Globe2Icon,
  ShieldCheckIcon,
  TrainFrontIcon,
} from "lucide-react";
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
import { CountryFlag } from "@/features/proposals/flag-icons";
import {
  ConsultationDialog,
  ExperienceGallery,
  HotelGallery,
  ItineraryAccordion,
  PersonalizationNote,
  PricingTiers,
} from "@/features/proposals/proposal-interactions";
import {
  NewRoteiroButton,
  RoteiroWizard,
  useRoteiroWizard,
} from "@/features/proposals/roteiro-wizard";
import {
  pricingTiers,
  routeStops,
  type TierKey,
} from "@/features/proposals/proposal-data";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
};

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function BrandLogo() {
  return (
    <a
      href="#inicio"
      aria-label="VOAR VIAGENS — voltar ao início"
      className="rounded-lg bg-white px-2 py-1 shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Image
        src="/logo.png"
        alt="VOAR VIAGENS"
        width={706}
        height={503}
        className="h-14 w-auto"
        priority
      />
    </a>
  );
}

function ArchitectureDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button className="hidden items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1.5 font-mono text-xs text-primary transition hover:bg-primary/10 sm:inline-flex" />
        }
      >
        <CodeIcon aria-hidden="true" className="size-3" />
        Arquitetura
      </DialogTrigger>
      <DialogContent className="border border-primary/30 bg-foreground text-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            Arquitetura de dados
          </DialogTitle>
          <DialogDescription className="leading-6 text-background/70">
            Esta é uma proposta demonstrativa. Em produção, o conteúdo do
            roteiro, hospedagens e experiências é gerado a partir de dados
            estruturados fornecidos pela agência.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-xl border border-primary/20 bg-black/30 p-4 font-mono text-xs text-background/90">
          <p className="text-primary">{"// Separação de responsabilidades"}</p>
          <p>
            Os dados do roteiro (dias, hospedagens, experiências, categorias de
            investimento) ficam isolados da apresentação visual, para que uma
            proposta real substitua apenas o conteúdo.
          </p>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Fechar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RouteCard({
  stop,
  index,
}: {
  stop: (typeof routeStops)[number];
  index: number;
}) {
  return (
    <Card
      size="sm"
      className="relative z-10 flex h-full min-h-28 flex-col justify-center border border-primary/25 bg-card py-3 shadow-sm ring-0"
    >
      <CardContent className="flex-row items-center justify-center gap-2 px-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1">
            <strong className="font-serif text-base">{stop.city}</strong>
            <CountryFlag code={stop.countryCode} title={stop.country} />
          </span>
          <span className="block text-xs text-muted-foreground">
            {stop.stay} · {stop.country}
          </span>
        </span>
      </CardContent>
    </Card>
  );
}

function TransportConnector({ label }: { label: string }) {
  return (
    <div className="relative z-10 flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-0.5 rounded-full border border-primary/20 bg-background px-2.5 py-1.5 text-primary">
        <TrainFrontIcon aria-hidden="true" className="size-3.5" />
        <span className="text-center text-[10px] font-semibold tracking-wide whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}

function RouteTimeline() {
  // Desktop: alternating grid columns (card, connector, card, connector, ...)
  // so every city card shares the same width/height. A single connecting
  // line spans the full row at the row's vertical center — since every card
  // is stretched to the same height and centers its content, that center
  // line always lands on the middle of each card. Cards and the connector
  // pill both have a solid background, so they visually "cut" the line
  // instead of overlapping its text.
  const desktopColumns = routeStops
    .map((stop, index) => (index < routeStops.length - 1 ? "1fr auto" : "1fr"))
    .join(" ");

  return (
    <div>
      <div
        className="relative hidden md:grid md:items-stretch md:gap-x-4"
        style={{ gridTemplateColumns: desktopColumns }}
      >
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 h-px -translate-y-1/2 bg-primary/25" />
        {routeStops.map((stop, index) => (
          <div className="contents" key={stop.city}>
            <RouteCard stop={stop} index={index} />
            {stop.transport && (
              <div className="w-20">
                <TransportConnector label={stop.transport} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 md:hidden">
        {routeStops.map((stop, index) => (
          <div key={stop.city}>
            <RouteCard stop={stop} index={index} />
            {stop.transport && (
              <div className="py-1">
                <TransportConnector label={stop.transport} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProposalPage() {
  const [selectedTier, setSelectedTier] = useState<TierKey>("comfort");
  const [bookingOpen, setBookingOpen] = useState(false);
  const roteiroWizard = useRoteiroWizard();
  const tierInfo =
    pricingTiers.find((tier) => tier.key === selectedTier) ?? pricingTiers[0];

  return (
    <div
      data-proposal-root
      className="min-h-screen w-full min-w-0 overflow-x-clip bg-background pb-16 text-foreground print:bg-white print:pb-0"
    >
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl print:hidden">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <BrandLogo />
            <NewRoteiroButton onClick={roteiroWizard.openWizard} />
          </div>
          <nav
            aria-label="Navegação da proposta"
            className="hidden items-center gap-6 text-sm font-medium lg:flex"
          >
            <a
              href="#roteiro"
              className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            >
              Roteiro
            </a>
            <a
              href="#hospedagens"
              className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            >
              Hospedagens
            </a>
            <a
              href="#experiencias"
              className="transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
            >
              Experiências
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ArchitectureDialog />
            <Button
              render={<a href="#proposta" />}
              nativeButton={false}
              className="rounded-full px-5 text-xs font-bold tracking-wider uppercase"
            >
              <span className="sm:hidden">Proposta</span>
              <span className="hidden sm:inline">Ver proposta</span>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="relative flex min-h-[calc(100svh-5rem)] items-end overflow-hidden bg-foreground text-background print:min-h-0 print:py-20"
        >
          <Image
            src="/proposal/hero-london.jpg"
            alt="Vista aérea de Londres e do rio Tâmisa"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70 print:hidden"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground via-foreground/50 to-foreground/10 print:bg-foreground" />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Badge className="h-7 bg-primary px-3 text-xs font-bold tracking-widest text-primary-foreground uppercase">
                Proposta demonstrativa
              </Badge>
              <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-background/80 uppercase">
                <CalendarDaysIcon aria-hidden="true" className="size-4" />8 dias
                · 7 noites
              </span>
            </div>
            <h1 className="max-w-4xl font-serif text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Londres, Paris, Zurique & Munique
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-background/80 sm:text-lg">
              Quatro cidades em uma jornada de contrastes, desenhada como uma
              referência visual para sua próxima proposta VOAR.
            </p>
            <PersonalizationNote note="Este roteiro ilustra como estruturamos uma viagem em etapas equilibradas — alternando cultura, gastronomia e momentos de descanso conforme o perfil de cada família." />
          </div>
        </section>

        <section
          aria-label="Resumo da viagem"
          className="border-b border-border bg-secondary py-10 print:bg-white"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ["8 dias", "Duração sugerida"],
              ["4 cidades", "Quatro países"],
              ["7 noites", "Hospedagem a definir"],
              ["Sob medida", "Ritmo ajustável"],
            ].map(([value, label]) => (
              <Card
                key={label}
                size="sm"
                className="border border-primary/20 bg-card py-5 text-center shadow-none ring-0"
              >
                <CardContent className="gap-1 px-3">
                  <strong className="font-serif text-2xl font-semibold text-primary sm:text-3xl">
                    {value}
                  </strong>
                  <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              centered
              eyebrow="Rota sugerida"
              title="Quatro cidades, uma história contínua"
              description="Uma sequência visual para organizar a viagem com clareza, mantendo cada etapa aberta a ajustes."
            />
            <div className="mt-10">
              <RouteTimeline />
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrainFrontIcon
                aria-hidden="true"
                className="size-4 text-primary"
              />
              Conexões ilustrativas; modais e horários dependem da cotação.
            </p>
          </div>
        </section>

        <section
          id="roteiro"
          className="scroll-mt-24 bg-secondary py-16 sm:py-20 print:bg-white"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Roteiro dia a dia"
              title="Cada etapa no ritmo certo"
              description="Abra os capítulos para conhecer a direção sugerida. Em uma proposta real, cada item será confirmado antes da publicação."
            />
            <div className="mt-10">
              <ItineraryAccordion />
            </div>
          </div>
        </section>

        <section
          id="hospedagens"
          className="scroll-mt-24 border-y border-border py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              centered
              eyebrow="Hospedagens"
              title="Referências para cada atmosfera"
              description="As imagens abaixo são ilustrativas. Nomes, categorias, tarifas e disponibilidade serão apresentados na cotação final."
            />
            <div className="mt-10">
              <HotelGallery />
            </div>
          </div>
        </section>

        <section
          id="experiencias"
          className="scroll-mt-24 bg-secondary py-16 sm:py-20 print:bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              centered
              eyebrow="Experiências"
              title="Possibilidades que dão forma à viagem"
              description="Filtre por interesse para visualizar como a curadoria pode equilibrar cultura, sabores e natureza."
            />
            <div className="mt-10">
              <ExperienceGallery />
            </div>
          </div>
        </section>

        <section
          id="proposta"
          className="scroll-mt-24 border-y border-border py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              centered
              eyebrow="Apresentação comercial"
              title="Opções de investimento"
              description="Escolha a categoria que melhor atende ao perfil da viagem — os valores serão confirmados na cotação final."
            />
            <div className="mt-10">
              <PricingTiers
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
              />
            </div>
            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm">
                <ShieldCheckIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary"
                />
                A proposta real será revisada antes de qualquer confirmação.
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-foreground py-20 text-center text-background print:hidden">
          <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <CompassIcon
              aria-hidden="true"
              className="mx-auto mb-5 size-8 text-primary"
            />
            <p className="text-xs font-bold tracking-widest text-primary uppercase">
              Próximo capítulo
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold sm:text-5xl">
              Sua próxima viagem começa com uma boa conversa
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-background/70">
              Use esta demonstração como ponto de partida e prepare uma mensagem
              com os ajustes que mais importam para você.
            </p>
            <div className="mt-8 flex justify-center">
              <ConsultationDialog className="rounded-xl px-6 font-bold tracking-wider uppercase" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary py-10 print:bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex items-center gap-3">
            <Globe2Icon aria-hidden="true" className="size-5 text-primary" />
            <span className="font-serif text-lg font-semibold">
              VOAR VIAGENS
            </span>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Proposta demonstrativa. Imagens ilustrativas; nenhum serviço, valor
            ou disponibilidade está confirmado.
          </p>
        </div>
      </footer>

      <aside className="sticky bottom-0 z-30 border-t border-primary/30 bg-foreground py-3 text-background shadow-2xl print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Categoria {tierInfo.name}
            </p>
            <p className="truncate font-serif font-semibold sm:text-lg">
              {tierInfo.price}
            </p>
          </div>
          <Button
            onClick={() => setBookingOpen(true)}
            className="shrink-0 rounded-xl px-4 text-xs font-bold tracking-wider uppercase sm:px-6"
          >
            Solicitar
          </Button>
        </div>
      </aside>

      <ConsultationDialog
        selectedTier={selectedTier}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />

      <RoteiroWizard
        open={roteiroWizard.open}
        onOpenChange={roteiroWizard.setOpen}
      />
    </div>
  );
}

export { ProposalPage };
