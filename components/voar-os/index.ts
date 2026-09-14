/**
 * VOAR OS — Design System
 *
 * Base de componentes reutilizáveis do VOAR Viagens OS. Construída na Sprint
 * 01 (Home) para ser reaproveitada por qualquer módulo futuro da plataforma
 * (Clientes, TravelBooks, CRM, Financeiro, IA...). Nenhum componente aqui
 * deve conter lógica específica de uma página — apenas layout e apresentação.
 */
export { PageContainer } from "@/components/voar-os/page-container";
export { PageHeader, LoggedUser } from "@/components/voar-os/page-header";
export { SectionTitle } from "@/components/voar-os/section-title";
export { Hero } from "@/components/voar-os/hero";
export { ActionCard } from "@/components/voar-os/action-card";
export type { ActionCardProps, ActionCardState } from "@/components/voar-os/action-card";
export { ActionGrid } from "@/components/voar-os/action-grid";
export { Footer } from "@/components/voar-os/footer";
export { WorldMapBackdrop } from "@/components/voar-os/world-map-backdrop";
export { voarOsColors } from "@/components/voar-os/tokens";
export type { VoarOsColorToken } from "@/components/voar-os/tokens";
