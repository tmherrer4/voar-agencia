import type { Metadata } from "next";
import { HomePage } from "@/features/home/page";

export const metadata: Metadata = {
  title: "VOAR Viagens OS",
  description:
    "Sistema Operacional Inteligente para Agências de Turismo — VOAR Viagens.",
};

export default function Home() {
  return <HomePage />;
}
