import { MenuItem } from "./MenuItem";

type MenuListProps = {
  items: {
    label: string;
    onClick?: () => void;
  }[];
};

export default function MenuList({ items }: MenuListProps) {
  return (
    <div
      className="
        flex w-full flex-col items-start gap-[2px]
        self-stretch px-[32px]
      "
    >
      {items.map((item, index) => (
        <div key={index} className="w-full">
          <MenuItem label={item.label} onClick={item.onClick} />

          {/* 구분선 */}
          <div className="w-full h-[2px] bg-gray-02 mb-[14px]" />
        </div>
      ))}
    </div>
  );
}
