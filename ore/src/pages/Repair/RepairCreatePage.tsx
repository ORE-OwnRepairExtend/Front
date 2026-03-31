import { useParams } from "react-router-dom";

export default function RepairCreatePage() {
  const { productId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">수리 등록</h1>
      <p>productId: {productId}</p>
    </div>
  );
}