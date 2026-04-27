/**
 * RuleDiscovery — shows discovered classification rules (decision tree + Apriori)
 * and feature importance rankings.
 */
import { useEffect, useState } from "react";
import { loadRulesDiscovered } from "../data/loader.ts";
import type { RulesDiscovered } from "../data/types.ts";
import MetricCard from "../components/ui/MetricCard.tsx";
import SectionCard from "../components/ui/SectionCard.tsx";
import PageIntro from "../components/ui/PageIntro.tsx";
import HorizontalBar from "../components/ui/HorizontalBar.tsx";
import DataTable from "../components/ui/DataTable.tsx";
import { TEAL_PRIMARY, TEAL_DARK, TEAL_LIGHT, SAGE, AMBER } from "../config/theme.ts";

export default function RuleDiscovery() {
  const [rules, setRules] = useState<RulesDiscovered | null>(null);

  useEffect(() => {
    loadRulesDiscovered().then(setRules).catch(console.error);
  }, []);

  if (!rules) {
    return <div className="text-muted text-sm">Loading rules...</div>;
  }

  // Top 30 rules for the table
  const ruleColumns = ["ID", "Source", "Description", "Confidence", "Support"];
  const ruleRows: Array<Record<string, string | number>> = rules.rules.slice(0, 30).map((r) => ({
    ID: r.rule_id,
    Source: r.source,
    Description: r.description,
    Confidence: (r.confidence * 100).toFixed(1) + "%",
    Support: r.support,
  }));

  // Feature importance for the bar chart
  const fiColors = [TEAL_DARK, TEAL_PRIMARY, TEAL_LIGHT, SAGE, AMBER];
  const fiItems = rules.feature_importance.map((fi, i) => ({
    label: fi.feature,
    value: Math.round(fi.importance),
    color: fiColors[i % fiColors.length],
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Rule Discovery</h1>

      <PageIntro>
        {rules.total_rules} total rules discovered: {rules.tree_rules_count}{" "}
        from decision tree extraction and {rules.apriori_rules_count} from
        Apriori association mining. Rules power the Tier 1 engine and augment
        Tier 2 features.
      </PageIntro>

      {/* ─── Metric cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Decision Tree Rules"
          value={String(rules.tree_rules_count)}
          accentColor={TEAL_PRIMARY}
          delta={`${((rules.tree_rules_count / rules.total_rules) * 100).toFixed(0)}% of total`}
          deltaColor={TEAL_PRIMARY}
        />
        <MetricCard
          label="Apriori Rules"
          value={String(rules.apriori_rules_count)}
          accentColor={SAGE}
          delta={`${((rules.apriori_rules_count / rules.total_rules) * 100).toFixed(0)}% of total`}
          deltaColor={SAGE}
        />
      </div>

      {/* ─── Rules table ─────────────────────────────────────────── */}
      <SectionCard
        title="Top 30 Rules"
        subtitle="Ordered by confidence and support"
      >
        <DataTable columns={ruleColumns} rows={ruleRows} />
      </SectionCard>

      {/* ─── Feature importance ──────────────────────────────────── */}
      <SectionCard
        title="Feature Importance"
        subtitle="Decision tree feature importance rankings"
      >
        <HorizontalBar items={fiItems} />
      </SectionCard>
    </div>
  );
}
