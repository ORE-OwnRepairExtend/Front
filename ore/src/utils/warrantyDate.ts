import type { ProductStatus, WarrantyTimelineItem } from "../types/product";
import { formatDate } from "./formatDate";

const STATUS_LABEL: Record<ProductStatus, string> = {
  valid: "유효",
  imminent: "임박",
  danger: "위험",
  expired: "만료",
};

export function getWarrantyExpiredDate(
  purchaseDate: string,
  warrantyMonths: number,
): Date {
  const expiredDate = new Date(purchaseDate);
  expiredDate.setMonth(expiredDate.getMonth() + warrantyMonths);

  return expiredDate;
}

export function getWarrantyTimeline(
  purchaseDate: string,
  warrantyMonths: number,
): WarrantyTimelineItem[] {
  const purchase = new Date(purchaseDate);
  const expired = getWarrantyExpiredDate(purchaseDate, warrantyMonths);

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
  warrantyMonths: number,
  today: Date = new Date(),
): WarrantyTimelineItem[] {
  const timeline = getWarrantyTimeline(purchaseDate, warrantyMonths);

  return timeline.filter((item) => {
    const statusDate = new Date(item.date.replaceAll(".", "-"));

    const visibleStartDate = new Date(statusDate);
    visibleStartDate.setDate(visibleStartDate.getDate() - 7);

    return today >= visibleStartDate;
  });
}
