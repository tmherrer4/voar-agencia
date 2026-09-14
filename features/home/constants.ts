import {
  CompassIcon,
  HistoryIcon,
  PlaneIcon,
  BookOpenIcon,
  ZapIcon,
} from "lucide-react";
import type { ActionCardProps } from "@/components/voar-os";

/**
 * VOAR OS — Home
 *
 * Conteúdo das cinco ações principais da Home. Mantido separado do JSX
 * (page.tsx) para que o texto/ícone/destino de cada ação possa mudar sem
 * tocar em layout, e para que outras telas possam futuramente reaproveitar
 * o mesmo formato de dado com o componente ActionCard.
 */
export const homeActions: Omit<ActionCardProps, "state">[] = [
  {
    icon: CompassIcon,
    title: "Criar Novo Roteiro",
    description:
      "Planeje uma viagem personalizada do briefing até a proposta final.",
    href: "/proposal",
  },
  {
    icon: BookOpenIcon,
    title: "Gerar TravelBook",
    description: "Monte uma apresentação premium para o cliente.",
    href: "/travelbook",
  },
  {
    icon: PlaneIcon,
    title: "Nova Cotação",
    description: "Pesquise hotéis, voos e experiências.",
    href: "/cotacao",
  },
  {
    icon: ZapIcon,
    title: "Cotação Expressa",
    description: "Fluxo rápido para consultas imediatas.",
    href: "/cotacao-expressa",
  },
  {
    icon: HistoryIcon,
    title: "Histórico de Pesquisa",
    description: "Acesse pesquisas e propostas anteriores.",
    href: "/historico",
  },
];
