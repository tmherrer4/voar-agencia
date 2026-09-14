import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ActionGridProps = {
  children: ReactNode;
  className?: string;
};

/**
 * VOAR OS — ActionGrid
 *
 * Grid responsivo para ActionCards (ou qualquer card do mesmo formato).
 * Breakpoints seguem a especificação do design system:
 *   mobile   → 1 coluna
 *   tablet   → 2 colunas (últimas linhas quebram 2+2+1 naturalmente)
 *   notebook → 3 colunas (quebra 3+2 naturalmente para 5 itens)
 *   desktop  → 5 colunas
 */
export function ActionGrid({ children, className }: ActionGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
