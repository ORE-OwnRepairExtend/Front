import type { ApiProductCategory, ProductCategory } from "../types/category";

import starIcon from "../assets/star.svg";
import phoneIcon from "../assets/phone.svg";
import computerIcon from "../assets/computer.svg";
import cameraIcon from "../assets/camera.svg";
import otherIcon from "../assets/other.svg";
import tvIcon from "../assets/tv.svg";
import kithcenIcon from "../assets/kitchen.svg";

export const productCategories: ProductCategory[] = [
  { label: "All" },
  {
    label: "즐겨찾기",
    icon: <img src={starIcon} className="w-[20px] h-[20px]" />,
  },
  {
    label: "모바일 기기",
    icon: <img src={phoneIcon} className="w-[20px] h-[20px]" />,
  },
  {
    label: "PC 기기",
    icon: <img src={computerIcon} className="w-[20px] h-[20px]" />,
  },
  {
    label: "주방 가전",
    icon: <img src={kithcenIcon} className="w-[20px] h-[20px]" />,
  },
  {
    label: "생활 가전",
    icon: <img src={tvIcon} className="w-[20px] h-[20px]" />,
  },
  {
    label: "영상·음향",
    icon: <img src={cameraIcon} className="w-[20px] h-[20px]" />,
  },
  {
    label: "기타",
    icon: <img src={otherIcon} className="w-[20px] h-[20px]" />,
  },
];

export const CATEGORY_MAP = {
  "모바일 기기": "MOBILE",
  "PC 기기": "PC_LAPTOP",
  "주방 가전": "KITCHEN",
  "생활 가전": "LIVING",
  "영상·음향": "VIDEO_AUDIO",
  기타: "ETC",
} as const satisfies Record<string, ApiProductCategory>;

export const CATEGORY_LABEL_MAP: Record<ApiProductCategory, string> = {
  MOBILE: "모바일 기기",
  PC_LAPTOP: "PC 기기",
  KITCHEN: "주방 가전",
  LIVING: "생활 가전",
  VIDEO_AUDIO: "영상·음향",
  ETC: "기타",
};
