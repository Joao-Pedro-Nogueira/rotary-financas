import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import {
  currentBalance,
  expenseGroups,
  flowGroups,
  INITIAL_BALANCE,
  money,
  parseAmount,
  seedTransactions,
  summarize,
  validateTransaction,
  type Transaction,
} from "@/lib/finance";
import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches all three main screens (/ , /movimentacoes, /relatorios)", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    for (const path of ["/", "/movimentacoes", "/relatorios"]) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    }
  });
});

describe("Rotary Finanças domain & financial rules", () => {
  it("satisfies the isolated validation scenario (Section 8.4)", () => {
    const initialCents = 100000; // R$ 1.000,00
    const testTransactions: Transaction[] = [
      {
        id: "TEST-1",
        clubId: "rotary-cg-universidade",
        type: "entrada",
        date: "2026-11-10",
        description: "Nova entrada de teste",
        category: "Doações",
        amount: 30000, // R$ 300,00
        notes: "",
      },
      {
        id: "TEST-2",
        clubId: "rotary-cg-universidade",
        type: "saida",
        date: "2026-11-12",
        description: "Nova saída de teste",
        category: "Projetos sociais",
        amount: 15000, // R$ 150,00
        notes: "",
      },
    ];

    const summary = summarize(testTransactions, initialCents, "2026-11-01", "2026-11-30");
    expect(summary.opening).toBe(100000);
    expect(summary.income).toBe(30000);
    expect(summary.expenses).toBe(15000);
    expect(summary.result).toBe(15000);
    expect(summary.closing).toBe(115000);
    expect(currentBalance(testTransactions, initialCents)).toBe(115000);
  });

  it("calculates consistent seed totals across October and November 2026", () => {
    expect(seedTransactions.length).toBeGreaterThanOrEqual(18);
    expect(seedTransactions.length).toBeLessThanOrEqual(25);

    const oct = summarize(seedTransactions, INITIAL_BALANCE, "2026-10-01", "2026-10-31");
    const nov = summarize(seedTransactions, INITIAL_BALANCE, "2026-11-01", "2026-11-30");

    expect(oct.opening).toBe(INITIAL_BALANCE);
    expect(nov.opening).toBe(oct.closing);
    expect(nov.closing).toBe(currentBalance(seedTransactions, INITIAL_BALANCE));

    const groups = expenseGroups(nov.filtered);
    const totalPercent = groups.reduce((acc, g) => acc + g.percent, 0);
    expect(Math.round(totalPercent)).toBe(100);

    const flow = flowGroups(nov.filtered, "2026-11-01", "2026-11-30");
    expect(flow.length).toBeGreaterThan(0);
  });

  it("formats BRL currency and validates transactions properly", () => {
    expect(money(125000)).toContain("1.250,00");
    expect(parseAmount("R$ 1.250,00")).toBe(125000);

    const invalid = validateTransaction({
      type: "entrada",
      amount: 0,
      description: "   ",
      category: "",
      date: "invalid-date",
    });
    expect(invalid.amount).toBeDefined();
    expect(invalid.description).toBeDefined();
    expect(invalid.category).toBeDefined();
    expect(invalid.date).toBeDefined();

    const valid = validateTransaction({
      type: "entrada",
      amount: 50000,
      description: "Doação empresarial",
      category: "Doações",
      date: "2026-11-22",
    });
    expect(Object.keys(valid)).toHaveLength(0);
  });
});
