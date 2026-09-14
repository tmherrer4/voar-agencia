import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { WorldMapBackdrop } from "@/components/voar-os/world-map-backdrop";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  /** Mostra o mapa-múndi extremamente discreto no fundo. Padrão: true. */
  showWorldMap?: boolean;
};

/**
 * VOAR OS — PageContainer
 *
 * Casca de página padrão do design system: fundo escuro (#080808), mapa-múndi
 * de fundo opcional, e uma coluna vertical (header → conteúdo → footer) que
 * ocupa a altura mínima da viewport. Toda tela do VOAR OS (Home, e no futuro
 * Clientes, TravelBooks, CRM, Financeiro, IA...) deve partir daqui em vez de
 * reimplementar fundo/layout por conta própria.
 */
export function PageContainer({
  children,
  className,
  showWorldMap = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "voar-os relative flex min-h-screen flex-col overflow-hidden",
        className,
      )}
    >
      {showWorldMap ? (
        <WorldMapBackdrop className="text-voar-primary" />
      ) : null}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}
