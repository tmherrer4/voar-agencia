import type { ComponentType } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ActionCardState = "default" | "disabled" | "comingSoon";

export type ActionCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  state?: ActionCardState;
  className?: string;
};

/**
 * VOAR OS — ActionCard
 *
 * Card de ação reutilizável do design system: ícone, título, descrição e um
 * destino (`href`). Puro layout/navegação — nenhuma lógica de negócio vive
 * aqui. É o bloco base da grade de ações da Home hoje, e de qualquer grade
 * de atalhos em módulos futuros (Clientes, TravelBooks, CRM, Financeiro, IA).
 *
 * `state`:
 * - "default": card ativo, navegável.
 * - "disabled" / "comingSoon": visualmente esmaecido, não navegável — útil
 *   para anunciar uma ação futura sem quebrar o grid antes dela existir.
 */
export function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  state = "default",
  className,
}: ActionCardProps) {
  const isInteractive = state === "default";

  const content = (
    <div
      className={cn(
        "group bg-voar-card border-voar relative flex h-full flex-col gap-4 rounded-2xl border p-6 transition-all duration-300 ease-out",
        isInteractive &&
          "hover:bg-voar-card-hover hover:border-voar-hover hover:-translate-y-1 hover:shadow-[0_0_32px_-8px_rgba(200,163,95,0.35)]",
        !isInteractive && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div className="border-voar bg-voar-base flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 group-hover:border-voar-hover">
        <Icon className="text-voar-primary h-5 w-5" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-voar font-serif text-lg font-medium tracking-tight">
          {title}
        </h3>
        <p className="text-voar-muted text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {state === "comingSoon" ? (
        <span className="text-voar-primary absolute top-6 right-6 text-[10px] font-medium tracking-wide uppercase">
          Em breve
        </span>
      ) : null}
    </div>
  );

  if (!isInteractive) {
    return (
      <div aria-disabled="true" className="block h-full">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className="block h-full cursor-pointer">
      {content}
    </Link>
  );
}
