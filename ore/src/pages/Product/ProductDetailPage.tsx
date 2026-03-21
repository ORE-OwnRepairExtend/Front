import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { productId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">제품 상세</h1>
      <p>productId: {productId}</p>
    </div>
  );
}