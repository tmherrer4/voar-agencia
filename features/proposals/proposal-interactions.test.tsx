import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ConsultationDialog,
  ExperienceGallery,
} from "@/features/proposals/proposal-interactions";

afterEach(cleanup);

describe("ExperienceGallery", () => {
  it("filters the demonstration experiences by category", () => {
    render(<ExperienceGallery />);

    expect(screen.getByText("Sabores e pausas parisienses")).toBeVisible();
    expect(screen.getByText("Panoramas dos Alpes")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Natureza" }));

    expect(screen.getByText("Panoramas dos Alpes")).toBeVisible();
    expect(
      screen.queryByText("Sabores e pausas parisienses"),
    ).not.toBeInTheDocument();
  });
});

describe("ConsultationDialog", () => {
  it("copies a locally prepared consultation request", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<ConsultationDialog />);
    fireEvent.click(
      screen.getByRole("button", { name: "Solicitar atendimento" }),
    );

    fireEvent.change(await screen.findByLabelText("Nome completo"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("WhatsApp"), {
      target: { value: "(11) 99999-0000" },
    });
    fireEvent.change(screen.getByLabelText("Ajustes desejados"), {
      target: { value: "Mais tempo em Paris" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Copiar solicitação" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining("Nome: Ana"),
      );
    });
    expect(
      screen.getByText("Solicitação copiada. Agora envie ao seu consultor."),
    ).toBeVisible();
  });
});
