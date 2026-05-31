import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import RepairDetailContent from "../../components/repair/RepairDetailContent";
import SecondLayout from "../../layout/SecondLayout";
import CommonButton from "../../components/common/CommonButton";
import { mockProductListResponse } from "../../mocks/products";
import { formatPrice } from "../../utils/formatPrice";
import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../api/api";
import axios from "axios";

type RepairDetailResponse = {
  repairId: string;
  title: string;
  date: string;
  content: string;
  cost: number;
  serviceCenter: string;
  imageUrl?: string;
  createdAt: string;
};

type RepairEditForm = {
  title: string;
  repairDate: string;
  content: string;
  price: string;
  shopName: string;
  receiptImageUrl?: string;
};

type RepairDetailState = {
  repairId: string;
  repairTitle: string;
  repairDate: string;
  repairContent: string;
  repairCost: number;
  repairShop: string;
  receiptImageUrl?: string;
};

export default function RepairDetailPage() {
  const navigate = useNavigate();
  const { productId, repairId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const product = mockProductListResponse.find(
    (item) => item.productId === productId,
  );

  const [repairDetail, setRepairDetail] = useState<RepairDetailState | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRepairDetail = async () => {
      if (!productId || !repairId) {
        setErrorMessage("잘못된 접근입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.get<RepairDetailResponse>(
          `/products/${productId}/repairs/${repairId}`,
        );

        const data = response.data;

        setRepairDetail({
          repairId: data.repairId,
          repairTitle: data.title,
          repairDate: data.date,
          repairContent: data.content,
          repairCost: data.cost,
          repairShop: data.serviceCenter,
          receiptImageUrl: data.imageUrl,
        });
      } catch (error) {
        console.error("수리 이력 상세 조회 실패:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setErrorMessage("인증 정보가 유효하지 않습니다.");
          } else if (error.response?.status === 404) {
            setErrorMessage("수리 이력을 찾을 수 없습니다.");
          } else {
            setErrorMessage("수리 이력 정보를 불러오지 못했습니다.");
          }
        } else {
          setErrorMessage("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairDetail();
  }, [productId, repairId]);

  const [editForm, setEditForm] = useState<RepairEditForm>({
    title: "",
    repairDate: "",
    content: "",
    price: "",
    shopName: "",
    receiptImageUrl: undefined,
  });

  const getInitialForm = (
    detail: RepairDetailState | null,
  ): RepairEditForm => ({
    title: detail?.repairTitle ?? "",
    repairDate: detail?.repairDate ?? "",
    content: detail?.repairContent ?? "",
    price: detail ? detail.repairCost.toLocaleString() : "",
    shopName: detail?.repairShop ?? "",
    receiptImageUrl: detail?.receiptImageUrl ?? "",
  });

  const handleChange = (field: keyof RepairEditForm) => (value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (value: string) => {
    const onlyNumber = value.replace(/[^0-9]/g, "");
    const priceWithComma = onlyNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setEditForm((prev) => ({
      ...prev,
      price: priceWithComma,
    }));
  };

  const handleReceiptImageChange = (file: File | null) => {
    if (!file) {
      setEditForm((prev) => ({
        ...prev,
        receiptImageUrl: undefined,
      }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setEditForm((prev) => ({
      ...prev,
      receiptImageUrl: previewUrl,
    }));
  };

  const handleEditStart = () => {
    setEditForm(getInitialForm(repairDetail));
    setIsEditMode(true);
  };

  const handleEditCancel = () => {
    setEditForm(getInitialForm(repairDetail));
    setIsEditMode(false);
  };

  const handleEditSave = async () => {
    if (!productId || !repairId || !repairDetail) return;

    const payload = {
      repairTitle: editForm.title,
      repairDate: editForm.repairDate,
      repairContent: editForm.content,
      repairCost: Number(editForm.price.replace(/,/g, "")),
      repairShop: editForm.shopName,
      receiptImageUrl: editForm.receiptImageUrl || undefined,
    };

    console.log("수정할 repairId:", repairId);
    console.log("수정 payload:", payload);

    // todo: api 연동 후 변경
    // await updateRepair(productId, repairId, payload);

    // 목업에서도 수정된 것처럼 보이게 화면 상태 갱신
    setRepairDetail({
      ...repairDetail,
      repairTitle: payload.repairTitle,
      repairDate: payload.repairDate,
      repairContent: payload.repairContent,
      repairCost: payload.repairCost,
      repairShop: payload.repairShop,
      receiptImageUrl: payload.receiptImageUrl,
    });

    setIsEditMode(false);
  };

  // 삭제 함수
  const handleDelete = async () => {
    if (!productId || !repairId) {
      setErrorMessage("잘못된 접근입니다.");
      return;
    }

    try {
      await api.delete(`/products/${productId}/repairs/${repairId}`);

      navigate(`/products/${productId}/repairs`);
    } catch (error) {
      console.error("수리 이력 삭제 실패:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage("인증 정보가 유효하지 않습니다.");
        } else if (error.response?.status === 404) {
          setErrorMessage("수리 이력을 찾을 수 없습니다.");
        } else {
          setErrorMessage("수리 이력 삭제에 실패했습니다.");
        }
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // todo: 예외처리 디자인 생각
  if (!product) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  if (isLoading) {
    return <div>수리 이력 정보를 불러오는 중입니다.</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!repairDetail) {
    return <div>수리 이력을 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-1 min-h-0 flex-col mt-[14px]">
          <div className="flex flex-col gap-[10px] my-[10px] flex-1 overflow-y-auto no-scrollbar">
            <div className="px-[10px]">
              <ProductCard
                imageSrc={product.imageUrl}
                name={product.nickname}
                description={product.productName}
                actionType="close"
                onClick={() => navigate(`/products/${product.productId}`)}
                onActionClick={() => navigate(-1)}
              />
            </div>

            {/* 구분선 */}
            <div className="w-full h-[2px] bg-gray-02 mt-[21px]" />

            <div className="min-h-0 px-[10px]">
              <RepairDetailContent
                isEditMode={isEditMode}
                title={isEditMode ? editForm.title : repairDetail.repairTitle}
                repairDate={
                  isEditMode
                    ? editForm.repairDate
                    : repairDetail.repairDate.replaceAll("-", ".")
                }
                content={
                  isEditMode ? editForm.content : repairDetail.repairContent
                }
                price={
                  isEditMode
                    ? editForm.price
                    : formatPrice(repairDetail.repairCost)
                }
                shopName={
                  isEditMode ? editForm.shopName : repairDetail.repairShop
                }
                receiptImageUrl={
                  isEditMode
                    ? editForm.receiptImageUrl
                    : repairDetail.receiptImageUrl
                }
                onTitleChange={handleChange("title")}
                onRepairDateChange={handleChange("repairDate")}
                onContentChange={handleChange("content")}
                onPriceChange={handlePriceChange}
                onShopNameChange={handleChange("shopName")}
                onReceiptImageChange={handleReceiptImageChange}
              />

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-[10px] px-[10px] py-[15px]">
                {isEditMode ? (
                  <>
                    <CommonButton
                      variant="secondary"
                      onClick={handleEditCancel}
                    >
                      취소
                    </CommonButton>
                    <CommonButton onClick={handleEditSave}>저장</CommonButton>
                  </>
                ) : (
                  <>
                    <CommonButton variant="secondary" onClick={handleEditStart}>
                      수정
                    </CommonButton>
                    <CommonButton onClick={() => setIsModalOpen(true)}>
                      삭제
                    </CommonButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        title="해당 수리 이력을 삭제하시겠습니까?"
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        cancelText="취소"
        confirmText="삭제"
      />
    </SecondLayout>
  );
}
