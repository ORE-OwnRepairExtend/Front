import type { ReactNode } from "react";

export type ProductCategory = {
  label: string;
  value?: string;
  icon?: ReactNode;
};

//api
export type ApiProductCategory =
  | "MOBILE"
  | "PC_LAPTOP"
  | "KITCHEN"
  | "LIVING"
  | "VIDEO_AUDIO"
  | "ETC";
