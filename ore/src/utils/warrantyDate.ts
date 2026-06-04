import type { ProductStatus, WarrantyTimelineItem } from "../types/product";
import { formatDate } from "./formatDate";

const STATUS_LABEL: Record<ProductStatus, string> = {
  valid: "유효",
  imminent: "임박",
  danger: "위험",
  expired: "만료",
  empty: "없음",
};

export function getWarrantyExpiredDate(
  warrantyEndDate: string,
): Date {
  return new Date(warrantyEndDate);
}

export function getWarrantyTimeline(
  purchaseDate: string,
  warrantyEndDate: string,
): WarrantyTimelineItem[] {
  const purchase = new Date(purchaseDate);
  const expired = getWarrantyExpiredDate(warrantyEndDate);

  const imminent = new Date(expired);
  imminent.setDate(imminent.getDate() - 31);

  const danger = new Date(expired);
  danger.setDate(danger.getDate() - 7);

  return [
    {
      status: "valid",
      label: STATUS_LABEL.valid,
      date: formatDate(purchase),
    },
    {
      status: "imminent",
      label: STATUS_LABEL.imminent,
      date: formatDate(imminent),
    },
    {
      status: "danger",
      label: STATUS_LABEL.danger,
      date: formatDate(danger),
    },
    {
      status: "expired",
      label: STATUS_LABEL.expired,
      date: formatDate(expired),
    },
  ];
}

export function getVisibleWarrantyTimeline(
  purchaseDate: string,
  warrantyEndDate: string,
  today: Date = new Date(),
): WarrantyTimelineItem[] {
  const timeline = getWarrantyTimeline(purchaseDate, warrantyEndDate);

  return timeline.filter((item) => {
    const statusDate = new Date(item.date.replaceAll(".", "-"));

    const visibleStartDate = new Date(statusDate);
    visibleStartDate.setDate(visibleStartDate.getDate() - 7);

    return today >= visibleStartDate;
  });
}