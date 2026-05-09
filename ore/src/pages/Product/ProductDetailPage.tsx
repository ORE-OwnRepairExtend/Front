import { useParams } from "react-router-dom";
import ProductDetailCard from "../../components/product/ProductDetailCard";
import { mockProductListResponse } from "../../mocks/products";
import { mergeProductsWithWarranty } from "../../utils/productMapper";
import { mockWarrantyListResponse } from "../../mocks/warranty";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import { useState } from "react";
import ProductManual from "../../components/product/ProductManual";
import ProductWarrantyInfo from "../../components/product/ProductWarrantyInfo";

//테스트코드

export default function ProductDetailPage() {
  const { productId } = useParams();

  const productsWithStatus = mergeProductsWithWarranty(
    mockProductListResponse,
    mockWarrantyListResponse,
  );

  const product = productsWithStatus.find(
    (item) => item.productId === productId,
  );

  const [isFavorite, setIsFavorite] = useState(product?.isFavorite ?? false);

  if (!product) {
    return <div>제품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <Header title="제품 상세" />

      <ProductDetailCard
        imageSrc={product.imageUrl}
        nickname={product.nickname}
        productName={product.productName}
        category={product.category}
        purchaseDate={product.purchaseDate}
        status={product.status}
        isFavorite={isFavorite}
        onFavoriteClick={() => {
          setIsFavorite((prev) => !prev);
        }}
      />
      <ProductManual
        content={
          "효과적인 학습 방법과 공부 전략으로는 능동적 학습, 자기 주도 학습, 그룹 스터디의 장점 등이 있습니다. 능동적 학습은 단순히 정보를 수동적으로 받아들이는 것이 아니라, 질문하고 토론하며 적극적으로 참여하는 학습 방식을 의미합니다. 자기 주도 학습은 자신의 학습 목표를 설정하고 계획을 세워 스스로 학습을 진행하는 방법입니다. 그룹 스터디는 동료들과의 협력을 통해 다양한 관점을 배우고 동기부여를 받을 수 있는 장점이 있습니다. 이러한 전략들을 활용하면 학습 효율성을 크게 높일 수 있습니다."
        }
        onPdfClick={() => {
          console.log("PDF 원문 보기");
        }}
      />
      <ProductWarrantyInfo purchaseDate="2025-12-17" warrantyMonths={5} />
    </SecondLayout>
  );
}
