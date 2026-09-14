import {
  ActionCard,
  ActionGrid,
  Footer,
  Hero,
  LoggedUser,
  PageContainer,
  PageHeader,
} from "@/components/voar-os";
import { homeActions } from "@/features/home/constants";

/**
 * VOAR OS — Home
 *
 * Porta de entrada da plataforma. Composta inteiramente a partir do design
 * system (components/voar-os) — nenhum estilo ou markup específico de página
 * vive aqui, só composição. Isso é intencional: qualquer módulo futuro
 * (Clientes, TravelBooks, CRM, Financeiro, IA) deve conseguir montar sua
 * própria tela com os mesmos blocos.
 */
export function HomePage() {
  return (
    <PageContainer>
      <PageHeader right={<LoggedUser name="Thiago" role="Consultor" />} />

      <main className="flex flex-1 flex-col items-center justify-center gap-16 px-6 py-16 sm:px-10">
        <Hero
          logoSrc="/logo.png"
          logoAlt="VOAR Viagens"
          title="Destinos transformam pessoas."
          subtitle="Sistema Operacional Inteligente para Agências de Turismo"
        />

        <ActionGrid className="max-w-6xl">
          {homeActions.map((action) => (
            <ActionCard key={action.href} {...action} />
          ))}
        </ActionGrid>
      </main>

      <Footer />
    </PageContainer>
  );
}
