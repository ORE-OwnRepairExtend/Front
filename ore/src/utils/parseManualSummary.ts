export type ParsedManualSummary = {
  usage: string;
  maintenance: string;
  repair: string;
};

export function parseManualSummary(summary: string): ParsedManualSummary {
  const usageMatch = summary.match(
    /사용\s*방법\s*[:：]?\s*([\s\S]*?)(?=관리\s*방법|고장\/수리\s*안내|$)/,
  );

  const maintenanceMatch = summary.match(
    /관리\s*방법\s*[:：]?\s*([\s\S]*?)(?=고장\/수리\s*안내|$)/,
  );

  const repairMatch = summary.match(/고장\/수리\s*안내\s*[:：]?\s*([\s\S]*)/);

  return {
    usage: usageMatch?.[1]?.trim() ?? "",
    maintenance: maintenanceMatch?.[1]?.trim() ?? "",
    repair: repairMatch?.[1]?.trim() ?? "",
  };
}
