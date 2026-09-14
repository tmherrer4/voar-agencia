import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * VOAR OS — SectionTitle
 *
 * Título de seção padrão do design system: serifada (Playfair) para o título,
 * texto secundário discreto abaixo. Reutilizável em qualquer tela — Home hoje,
 * módulos futuros (Clientes, TravelBooks, CRM, Financeiro, IA) depois.
 */
export function SectionTitle({
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <h2 className="text-voar font-serif text-2xl font-medium tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-voar-muted max-w-prose text-sm sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
