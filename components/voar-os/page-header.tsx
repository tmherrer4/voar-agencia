import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  /** Conteúdo à esquerda do header — opcional (ex: breadcrumb, título de módulo). */
  left?: ReactNode;
  /** Conteúdo à direita do header — ex: usuário logado. */
  right?: ReactNode;
  className?: string;
};

/**
 * VOAR OS — PageHeader
 *
 * Header discreto e reutilizável para qualquer tela do VOAR OS. Puro layout —
 * não injeta lógica de autenticação nem de navegação; quem usa este
 * componente decide o que passar em `left`/`right`.
 */
export function PageHeader({ left, right, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-6 sm:px-10",
        className,
      )}
    >
      <div className="text-voar-muted text-sm">{left}</div>
      <div className="text-voar-muted text-sm">{right}</div>
    </header>
  );
}

type LoggedUserProps = {
  name: string;
  role?: string;
  className?: string;
};

/**
 * VOAR OS — LoggedUser
 *
 * Pequeno bloco de "usuário logado" para o canto do PageHeader. Apenas
 * layout — nenhuma funcionalidade de sessão é implementada aqui.
 */
export function LoggedUser({ name, role, className }: LoggedUserProps) {
  return (
    <div className={cn("text-right leading-tight", className)}>
      <p className="text-voar text-sm font-medium">Olá, {name}</p>
      {role ? <p className="text-voar-muted text-xs">{role}</p> : null}
    </div>
  );
}
