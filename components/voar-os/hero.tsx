import Image from "next/image";
import { cn } from "@/lib/utils";

type HeroProps = {
  logoSrc: string;
  logoAlt: string;
  title: string;
  subtitle?: string;
  className?: string;
};

/**
 * VOAR OS — Hero
 *
 * Bloco central de abertura: logo em destaque + frase institucional +
 * subtítulo. A logo é recebida via props (`logoSrc`/`logoAlt`) de propósito —
 * a marca atual (public/logo.png) é temporária, e este componente não deve
 * criar nenhuma dependência estrutural em relação a ela. Trocar a logo no
 * futuro é só trocar a prop, sem tocar neste arquivo.
 */
export function Hero({ logoSrc, logoAlt, title, subtitle, className }: HeroProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-8 text-center",
        className,
      )}
    >
      <div className="bg-voar-card border-voar flex h-20 w-20 items-center justify-center rounded-2xl border p-3 sm:h-24 sm:w-24">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={96}
          height={96}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-voar font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-voar-muted max-w-md text-sm sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
