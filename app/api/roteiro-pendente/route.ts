import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Endpoint local e temporário: funciona como uma "caixa de entrada e
 * saída" em disco para solicitações de roteiro, enquanto a integração
 * real de geração (IA + skill roteiro-destino-definido) não está linkada
 * a uma API.
 *
 * POST  → grava a solicitação em roteiros-pendentes/<id>.json (status
 *         "pendente"). Usado tanto para pedir 3 sugestões de destino
 *         quanto para pedir o roteiro completo.
 * GET   → consulta roteiros-pendentes/<id>.json e retorna seu conteúdo.
 *         Enquanto o operador/assistente não processar, o arquivo segue
 *         com status "pendente"; a resposta é escrita de volta no MESMO
 *         arquivo (campo "resposta"), o que o wizard detecta via polling.
 *
 * Quando a API de geração automática for linkada, o único lugar do
 * frontend que precisa mudar é `submitRoteiroRequest` /
 * `pollRoteiroStatus` em features/proposals/roteiro-request.ts — a forma
 * como o wizard usa essas funções não muda.
 */

const PENDING_DIR = path.join(process.cwd(), "roteiros-pendentes");

function slugify(texto: string): string {
  const base = texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.slice(0, 40) || "solicitacao";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido (JSON malformado)." },
      { status: 400 },
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 },
    );
  }

  const record = payload as Record<string, unknown>;
  const tipo = record.tipo === "sugestao-destino" ? "sugestao-destino" : "roteiro-completo";

  const destinoTexto =
    ((record.destino as Record<string, unknown> | undefined)?.escolhaFinal as
      | string
      | undefined) ??
    ((record.destino as Record<string, unknown> | undefined)?.textoOriginal as
      | string
      | undefined) ??
    tipo;

  await mkdir(PENDING_DIR, { recursive: true });

  const id = `${Date.now()}__${slugify(destinoTexto)}${
    tipo === "sugestao-destino" ? "__sugestoes" : ""
  }`;
  const filename = `${id}.json`;
  const fullPath = path.join(PENDING_DIR, filename);

  const record_with_meta = {
    id,
    status: "pendente" as const,
    tipo,
    criadoEm: new Date().toISOString(),
    solicitacao: payload,
    resposta: null,
  };

  await writeFile(fullPath, JSON.stringify(record_with_meta, null, 2), "utf-8");

  return NextResponse.json({ ok: true, id, arquivo: path.join("roteiros-pendentes", filename) });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Parâmetro 'id' é obrigatório." }, { status: 400 });
  }

  // Evita path traversal: o id só pode conter os caracteres que nós mesmos geramos.
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }

  const fullPath = path.join(PENDING_DIR, `${id}.json`);

  try {
    const content = await readFile(fullPath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  }
}
