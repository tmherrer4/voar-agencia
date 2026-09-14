import type { Metadata } from "next";
import { ProposalPage } from "@/features/proposals/proposal-page";

export const metadata: Metadata = {
  title: "Proposta demonstrativa | VOAR VIAGENS",
  description:
    "Uma proposta demonstrativa de viagem criada no estilo editorial da VOAR VIAGENS.",
};

export default function Proposal() {
  return <ProposalPage />;
}
