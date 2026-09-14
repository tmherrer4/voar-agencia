import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type FlagProps = Omit<SVGProps<SVGSVGElement>, "className"> & {
  title: string;
  className?: string;
};

const flagBaseClassName =
  "shrink-0 rounded-[2px] shadow-sm ring-1 ring-black/10";

function FlagGB({ title, className, ...props }: FlagProps) {
  return (
    <svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      role="img"
      aria-label={title}
      className={cn(flagBaseClassName, className)}
      {...props}
    >
      <title>{title}</title>
      <rect width="20" height="14" fill="#00247d" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="2.6" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#cf142b" strokeWidth="0.9" />
      <path d="M10 0V14M0 7H20" stroke="#fff" strokeWidth="4.2" />
      <path d="M10 0V14M0 7H20" stroke="#cf142b" strokeWidth="2.4" />
    </svg>
  );
}

function FlagFR({ title, className, ...props }: FlagProps) {
  return (
    <svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      role="img"
      aria-label={title}
      className={cn(flagBaseClassName, className)}
      {...props}
    >
      <title>{title}</title>
      <rect width="20" height="14" fill="#fff" />
      <rect width="6.67" height="14" fill="#0055a4" />
      <rect x="13.33" width="6.67" height="14" fill="#ef4135" />
    </svg>
  );
}

function FlagCH({ title, className, ...props }: FlagProps) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      role="img"
      aria-label={title}
      className={cn(flagBaseClassName, className)}
      {...props}
    >
      <title>{title}</title>
      <rect width="14" height="14" fill="#d52b1e" />
      <rect x="5.8" y="2.6" width="2.4" height="8.8" fill="#fff" />
      <rect x="2.6" y="5.8" width="8.8" height="2.4" fill="#fff" />
    </svg>
  );
}

function FlagDE({ title, className, ...props }: FlagProps) {
  return (
    <svg
      width={20}
      height={14}
      viewBox="0 0 20 14"
      role="img"
      aria-label={title}
      className={cn(flagBaseClassName, className)}
      {...props}
    >
      <title>{title}</title>
      <rect width="20" height="4.67" fill="#000" />
      <rect y="4.67" width="20" height="4.67" fill="#dd0000" />
      <rect y="9.33" width="20" height="4.67" fill="#ffce00" />
    </svg>
  );
}

const flagComponents = {
  GB: FlagGB,
  FR: FlagFR,
  CH: FlagCH,
  DE: FlagDE,
} as const;

export type CountryCode = keyof typeof flagComponents;

function CountryFlag({
  code,
  title,
  className,
}: {
  code: CountryCode;
  title: string;
  className?: string;
}) {
  const FlagComponent = flagComponents[code];
  return <FlagComponent title={title} className={className} />;
}

export { CountryFlag };
