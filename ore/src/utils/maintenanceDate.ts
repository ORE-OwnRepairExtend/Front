import { formatDate } from "./formatDate";

export type MaintenanceHistoryItem = {
  id: string;
  replacedDate: string;
};

export type MaintenanceTimelineItem = {
  type: "recommended" | "replaced" | "purchase";
  label: string;
  date: string;
};

export function getRecommendedReplacementDate(
  baseDate: string,
  replacementCycleMonths: number,
): Date {
  const recommendedDate = new Date(baseDate);
  recommendedDate.setMonth(recommendedDate.getMonth() + replacementCycleMonths);

  return recommendedDate;
}

export function getLatestReplacementDate(
  replacementHistories: MaintenanceHistoryItem[],
): string | null {
  if (replacementHistories.length === 0) return null;

  const sortedHistories = [...replacementHistories].sort(
    (a, b) =>
      new Date(b.replacedDate).getTime() - new Date(a.replacedDate).getTime(),
  );

  return sortedHistories[0].replacedDate;
}

export function getMaintenanceTimeline(
  purchaseDate: string,
  replacementCycleMonths: number,
  replacementHistories: MaintenanceHistoryItem[],
): MaintenanceTimelineItem[] {
  const latestReplacementDate = getLatestReplacementDate(replacementHistories);

  const baseDate = latestReplacementDate ?? purchaseDate;

  const recommendedDate = getRecommendedReplacementDate(
    baseDate,
    replacementCycleMonths,
  );

  const timeline: MaintenanceTimelineItem[] = [
    {
      type: "recommended",
      label: "권장",
      date: formatDate(recommendedDate),
    },
  ];

  if (latestReplacementDate) {
    timeline.push({
      type: "replaced",
      label: "교체완료",
      date: formatDate(new Date(latestReplacementDate)),
    });
  }

  timeline.push({
    type: "purchase",
    label: "구매",
    date: formatDate(new Date(purchaseDate)),
  });

  return timeline;
}
