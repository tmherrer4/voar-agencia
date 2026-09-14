/**
 * VOAR OS — WorldMapBackdrop
 *
 * Mapa-múndi extremamente discreto usado como textura de fundo em telas do
 * VOAR OS (opacidade padrão ~3%). Puramente decorativo — `aria-hidden` e sem
 * qualquer dependência de imagem externa, para não competir com a marca.
 */

type WorldMapBackdropProps = {
  /** Opacidade do mapa. Mantenha entre 0.02 e 0.04 — não deve competir com a marca. */
  opacity?: number;
  className?: string;
};

export function WorldMapBackdrop({
  opacity = 0.03,
  className,
}: WorldMapBackdropProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
      }}
    >
      <g fill="currentColor" fillRule="evenodd">
        {/* América do Norte */}
        <path d="M95 95l25-18 22 4 18-10 20 6 15-8 24 10-6 18 14 8-4 16 18 14-10 20 8 18-16 10 4 20-22 6-8-16-18 4-10-18-20 2-14-16-16 6-12-20-14 4-8-22 14-14z" />
        {/* Groenlândia */}
        <path d="M290 55l20-10 18 6 10 16-8 14-22 8-16-10-8-14z" />
        {/* América do Sul */}
        <path d="M235 255l18-10 16 8 10 22-4 20 10 24-6 26-14 20 2 22-16 14-12-18-8-24 4-22-10-20 2-24-8-20z" />
        {/* Europa */}
        <path d="M470 90l16-8 14 6 12-4 14 8-4 12 10 10-8 12 6 14-16 6-10-10-14 4-8-14-12 2-6-16z" />
        {/* África */}
        <path d="M480 175l20-6 18 8 14-4 16 12-6 18 10 20-4 22 8 24-10 26-16 14-4-20-14-10-2-22-12-16 4-20-14-14 4-18z" />
        {/* Ásia */}
        <path d="M580 70l30-14 26 6 22-8 24 10 20-4 18 12-8 16 14 12-6 18 16 14-14 16 8 20-22 8-18-10-20 6-16-14-22 4-14-18-24 2-10-20-16-6 4-20-12-14z" />
        {/* Índia */}
        <path d="M660 175l14-6 12 8-2 18-12 16-14-6-4-18z" />
        {/* Sudeste Asiático */}
        <path d="M735 195l16-6 14 8-4 16-18 8-14-10z" />
        {/* Austrália */}
        <path d="M760 300l24-10 22 6 18 14-6 20 8 18-20 12-24-4-16-14-8-20z" />
        {/* Japão */}
        <path d="M812 130l8-10 10 4-2 14-12 4z" />
        {/* Reino Unido */}
        <path d="M452 82l8-6 8 4-2 10-10 2z" />
        {/* Madagascar */}
        <path d="M602 275l6-10 8 6-2 16-10-2z" />
      </g>
    </svg>
  );
}
