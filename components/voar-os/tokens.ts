/**
 * VOAR OS — Design tokens
 *
 * Paleta oficial do "sistema operacional" da VOAR Viagens, usada pela Home
 * e por qualquer tela futura construída sobre este design system (Clientes,
 * TravelBooks, CRM, Financeiro, IA...).
 *
 * Estes tokens são intencionalmente separados dos tokens claros do shadcn
 * em app/globals.css (--background, --card etc.) — aquele tema continua
 * servindo a Proposal e os componentes de components/ui sem alteração.
 * O VOAR OS é escuro por definição de produto, não um "dark mode" do tema
 * existente, então vive no seu próprio namespace de variáveis CSS.
 *
 * Uso: aplique a classe `voar-os` (ver globals abaixo) na raiz de uma
 * página/feature para ativar este tema, e use as classes utilitárias
 * `bg-voar-*`, `text-voar-*`, `border-voar-*` definidas em voar-os.css.
 */

export const voarOsColors = {
  background: "#080808",
  card: "#121212",
  cardHover: "#181818",
  border: "#2A2A2A",
  borderHover: "#C8A35F",
  text: "#F5F5F5",
  textMuted: "#9A9A9A",
  primary: "#C8A35F",
} as const;

export type VoarOsColorToken = keyof typeof voarOsColors;
