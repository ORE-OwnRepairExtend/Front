import ProductInputBox from "./ProductInputBox";
import DeleteButton from "../common/DeleteButton";

type PartInputRowProps = {
  name: string;
  cycle: string;
  onNameChange: (value: string) => void;
  onCycleChange: (value: string) => void;
  onDelete: () => void;
};

export default function PartInputRow({
  name,
  cycle,
  onNameChange,
  onCycleChange,
  onDelete,
}: PartInputRowProps) {
  return (
    <div className="flex items-center gap-[10px]">
      <ProductInputBox
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        prefix="부품명"
        className="w-[170px]"
      />

      <ProductInputBox
        value={cycle}
        onChange={(e) => onCycleChange(e.target.value)}
        prefix="교체주기"
        suffix="개월"
        className="w-[170px]"
      />

      <DeleteButton onClick={onDelete} />
    </div>
  );
}
