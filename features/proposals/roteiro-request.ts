/**
 * Modelagem e montagem do payload enviado para a geração de roteiro.
 *
 * Esta camada é isolada de propósito: hoje `submitRoteiroRequest` e
 * `submitDestinoSuggestionRequest` gravam um arquivo local (ver
 * app/api/roteiro-pendente/route.ts) para o operador processar
 * manualmente com a skill `roteiro-destino-definido`, e `pollRoteiroStatus`
 * faz o polling desse arquivo até a resposta chegar. Quando a API de
 * geração automática existir, só estas funções precisam mudar — o wizard
 * (roteiro-wizard.tsx) não precisa saber como o roteiro é gerado, só que
 * existe uma etapa assíncrona de "enviar e aguardar".
 */

export type WizardAnswers = {
  groupSize: number;
  composicao: string[];
  idade: string[];
  destino: string;
  destinoJaVisitado: string;
  totalDays: number;
  periodoViagem: string;
  padrao: string;
  orcamentoValor: string;
  padraoObs: string;
  hotelPref: string[];
  hotelObs: string;
  ritmo: string;
  estilo: string[];
  mustDo: string[];
  outrosDetalhes: string;
};

export type RoteiroRequestPayload = {
  tipo: "roteiro-completo" | "sugestao-destino";
  origem: "wizard-novo-roteiro";
  criadoEm: string;
  grupo: {
    tamanho: number;
    composicao: string[];
    faixaEtaria: string[];
  };
  destino: {
    textoOriginal: string;
    status: "definido" | "vago";
    jaVisitou: string | null;
    /** Preenchido só depois que o cliente escolhe uma das 3 sugestões (destino vago). */
    escolhaFinal?: string;
    ajustesLivres?: string;
  };
  duracao: {
    totalDias: number;
    periodoPrevisto: string | null;
  };
  padraoOrcamento: {
    padrao: string | null;
    valorTotalReferencia: string | null;
    observacoes: string | null;
  };
  hospedagem: {
    preferencias: string[];
    observacoes: string | null;
  };
  ritmoEstilo: {
    ritmo: string | null;
    estilos: string[];
  };
  imperdiveis: string[];
  outrosDetalhes: string | null;
};

/**
 * Heurística para decidir se o texto de destino já está "fechado" (uma ou
 * mais cidades/países nomeados) ou "vago" (região genérica, sem decisão).
 * Não é infalível — por isso o próprio texto do cliente sempre acompanha o
 * payload, para quem for gerar as sugestões conseguir corrigir manualmente
 * se a heurística errar.
 */
const VAGUE_DESTINATION_HINTS = [
  "algo",
  "sugest",
  "sugira",
  "nao sei",
  "não sei",
  "indefinid",
  "em aberto",
  "qualquer lugar",
  "aberto a sugest",
  "gostaria de um roteiro",
  "pelo leste europeu",
  "leste europeu",
  "europa",
  "praia",
  "clima quente",
  "algum lugar",
  "flexivel",
  "flexível",
];

// Nomes de países/cidades comuns o bastante para indicar destino fechado
// mesmo em frases curtas. Não precisa ser exaustivo: o objetivo é reduzir
// falso-positivo de "vago" quando o cliente já foi específico.
const KNOWN_PLACE_HINTS = [
  "londres",
  "paris",
  "frança",
  "franca",
  "holanda",
  "amsterdã",
  "amsterda",
  "madri",
  "madrid",
  "espanha",
  "portugal",
  "lisboa",
  "porto",
  "roma",
  "itália",
  "italia",
  "milão",
  "milao",
  "veneza",
  "suíça",
  "suica",
  "zurique",
  "genebra",
  "alemanha",
  "berlim",
  "munique",
  "praga",
  "república tcheca",
  "budapeste",
  "hungria",
  "viena",
  "áustria",
  "austria",
  "grécia",
  "grecia",
  "atenas",
  "santorini",
  "japão",
  "japao",
  "tóquio",
  "toquio",
  "kyoto",
  "estados unidos",
  "nova york",
  "orlando",
  "miami",
  "cancún",
  "cancun",
  "méxico",
  "mexico",
  "argentina",
  "buenos aires",
  "chile",
  "peru",
  "machu picchu",
  "dubai",
  "emirados",
  "tailândia",
  "tailandia",
  "bangkok",
  "bali",
  "indonésia",
  "indonesia",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function isDestinoVago(destinoTexto: string): boolean {
  const text = destinoTexto.trim();
  if (!text) return true;

  const normalized = normalize(text);

  const hasKnownPlace = KNOWN_PLACE_HINTS.some((place) =>
    normalized.includes(normalize(place)),
  );
  if (hasKnownPlace) return false;

  const hasVagueHint = VAGUE_DESTINATION_HINTS.some((hint) =>
    normalized.includes(normalize(hint)),
  );
  if (hasVagueHint) return true;

  // Texto curto e sem nome de lugar reconhecido: trata como vago por
  // segurança (é melhor confirmar com o cliente do que gerar roteiro
  // para o destino errado).
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return wordCount <= 6;
}

function basePayload(
  answers: WizardAnswers,
  tipo: RoteiroRequestPayload["tipo"],
  options?: { destinoEscolhido?: string; ajustesLivres?: string },
): RoteiroRequestPayload {
  const destinoStatus = isDestinoVago(answers.destino) ? "vago" : "definido";

  return {
    tipo,
    origem: "wizard-novo-roteiro",
    criadoEm: new Date().toISOString(),
    grupo: {
      tamanho: answers.groupSize,
      composicao: answers.composicao,
      faixaEtaria: answers.idade,
    },
    destino: {
      textoOriginal: answers.destino,
      status: destinoStatus,
      jaVisitou: answers.destinoJaVisitado || null,
      ...(options?.destinoEscolhido
        ? { escolhaFinal: options.destinoEscolhido }
        : {}),
      ...(options?.ajustesLivres
        ? { ajustesLivres: options.ajustesLivres }
        : {}),
    },
    duracao: {
      totalDias: answers.totalDays,
      periodoPrevisto: answers.periodoViagem || null,
    },
    padraoOrcamento: {
      padrao: answers.padrao || null,
      valorTotalReferencia: answers.orcamentoValor || null,
      observacoes: answers.padraoObs || null,
    },
    hospedagem: {
      preferencias: answers.hotelPref,
      observacoes: answers.hotelObs || null,
    },
    ritmoEstilo: {
      ritmo: answers.ritmo || null,
      estilos: answers.estilo,
    },
    imperdiveis: answers.mustDo,
    outrosDetalhes: answers.outrosDetalhes || null,
  };
}

export function buildRoteiroRequestPayload(
  answers: WizardAnswers,
  options?: { destinoEscolhido?: string; ajustesLivres?: string },
): RoteiroRequestPayload {
  return basePayload(answers, "roteiro-completo", options);
}

export function buildDestinoSuggestionPayload(
  answers: WizardAnswers,
): RoteiroRequestPayload {
  return basePayload(answers, "sugestao-destino");
}

export type SubmitRoteiroResult =
  | { ok: true; id: string; arquivo: string }
  | { ok: false; error: string };

async function submitPayload(
  payload: RoteiroRequestPayload,
): Promise<SubmitRoteiroResult> {
  try {
    const response = await fetch("/api/roteiro-pendente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        ok: false,
        error: `Falha ao salvar solicitação (${response.status}). ${detail}`,
      };
    }

    const data = (await response.json()) as { id: string; arquivo: string };
    return { ok: true, id: data.id, arquivo: data.arquivo };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao salvar a solicitação.",
    };
  }
}

/**
 * Envia o pedido de roteiro completo. Hoje isso grava um arquivo local
 * (pasta `roteiros-pendentes/` na raiz do projeto) via rota de API própria
 * do Next.js, para o operador processar a solicitação com a skill
 * `roteiro-destino-definido`.
 *
 * TODO(integração futura): trocar o corpo desta função por uma chamada real
 * de geração, mantendo a mesma assinatura para não precisar tocar no
 * wizard.
 */
export async function submitRoteiroRequest(
  payload: RoteiroRequestPayload,
): Promise<SubmitRoteiroResult> {
  return submitPayload(payload);
}

/**
 * Envia o pedido de 3 sugestões de destino (quando o cliente não decidiu
 * ainda). Mesmo mecanismo de arquivo local do `submitRoteiroRequest`.
 */
export async function submitDestinoSuggestionRequest(
  payload: RoteiroRequestPayload,
): Promise<SubmitRoteiroResult> {
  return submitPayload(payload);
}

export type DestinoSuggestion = {
  titulo: string;
  motivo: string;
};

export type PollStatus =
  | { status: "pendente" }
  | { status: "erro"; error: string }
  | {
      status: "respondido-sugestoes";
      sugestoes: DestinoSuggestion[];
    }
  | {
      status: "respondido-roteiro";
      /**
       * Link para a proposta completa gerada pela skill `proposta-comercial`
       * (página HTML própria, com fotos reais) — não dados soltos. Abre em
       * nova aba a partir do wizard.
       */
      url: string;
    };

/**
 * Consulta o status de uma solicitação enviada por submitRoteiroRequest /
 * submitDestinoSuggestionRequest. Usado pelo wizard em polling (a cada
 * poucos segundos) enquanto aguarda o operador/assistente processar.
 */
export async function pollRoteiroStatus(id: string): Promise<PollStatus> {
  try {
    const response = await fetch(
      `/api/roteiro-pendente?id=${encodeURIComponent(id)}`,
    );

    if (!response.ok) {
      return { status: "erro", error: `Falha ao consultar status (${response.status}).` };
    }

    const data = (await response.json()) as {
      status: "pendente" | "respondido";
      tipo: "roteiro-completo" | "sugestao-destino";
      resposta: { sugestoes?: DestinoSuggestion[]; url?: string } | null;
    };

    if (data.status !== "respondido" || !data.resposta) {
      return { status: "pendente" };
    }

    if (data.tipo === "sugestao-destino" && data.resposta.sugestoes) {
      return { status: "respondido-sugestoes", sugestoes: data.resposta.sugestoes };
    }

    if (data.tipo === "roteiro-completo" && data.resposta.url) {
      return { status: "respondido-roteiro", url: data.resposta.url };
    }

    return { status: "pendente" };
  } catch (error) {
    return {
      status: "erro",
      error: error instanceof Error ? error.message : "Erro desconhecido ao consultar status.",
    };
  }
}
