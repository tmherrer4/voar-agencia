import { cn } from "@/lib/utils";

type FooterProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

/**
 * VOAR OS — Footer
 *
 * Rodapé discreto e reutilizável do design system, para qualquer tela do
 * VOAR OS. Puro texto institucional — sem links nem lógica.
 */
export function Footer({
  title = "VOAR VIAGENS",
  subtitle = "Sistema Operacional para Agências de Turismo",
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-1 px-6 py-8 text-center",
        className,
      )}
    >
      <p className="text-voar-muted text-xs font-medium tracking-[0.2em] uppercase">
        {title}
      </p>
      <p className="text-voar-muted text-[11px] opacity-70">{subtitle}</p>
    </footer>
  );
}
