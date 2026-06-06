import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductDetailContent from "../../components/product/ProductDetailContent";
import ProductNotificationInfo from "../../components/product/ProductNotificationInfo";
import ProductNotificationModal from "../../components/product/ProductNotificationModal";
import ProductNotificationEditModal from "../../components/product/ProductNotificationEditModal";
import ProductNotificationCompleteModal from "../../components/product/ProductNotificationCompleteModal";
import { formatPrice } from "../../utils/formatPrice";
import { api } from "../../api/api";
import { CATEGORY_LABEL_MAP } from "../../constants/productCategories";
import { getProductStatus } from "../../utils/productStatus";

import defaultProductImage from "../../../public/photos/logo.png";
import type { ApiProductCategory } from "../../types/category";

type ProductDetailResponse = {
  productId: string;
  productName: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string | null;
  modelNumber: string | null;
  purchaseDate: string;
  warrantyMonths: number;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  manual: {
    manualContent: string;
  } | null;
  // 일단은 매뉴얼 null 허용
  createdAt: string;
};

type ProductWarrantyResponse = {
  productId: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  remainingDays: number;
};

type ProductOfficialManualResponse = {
  manualUrl: string;
  manualSummary: string;
  customerCenter: string;
};

type RepairHistoryResponse = {
  repairId: string;
  date: string;
  title: string;
  cost: number;
  createdAt: string;
};

type NotificationStatus = "진행중" | "완료";

type ProductRepairReminderResponse = {
  reminderId: string;
  title: string;
  remindAt: string;
  isDone: boolean;
  completedAt: string | null;
  createdAt: string;
};

type ProductRepairReminderUpdateResponse = {
  reminderId: string;
  title: string;
  remindAt: string;
  isDone: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProductRepairReminderDoneResponse = {
  reminderId: string;
  isDone: boolean;
  completedAt: string | null;
  updatedAt: string;
};

type ProductNotificationResponse = {
  notificationId: string;
  productId: string;
  productName: string;
  title: string;
  date: string;
  status: NotificationStatus;
};

function toDateInputValue(date: string) {
  return date.replaceAll(".", "-");
}

function sortNotificationsByDate<T extends { date: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

function mapProductRepairReminderToNotification(
  reminder: ProductRepairReminderResponse,
  productId: string,
  productName: string,
): ProductNotificationResponse {
  return {
    notificationId: reminder.reminderId,
    productId,
    productName,
    title: reminder.title,
    date: reminder.isDone
      ? reminder.completedAt ?? reminder.remindAt
      : reminder.remindAt,
    status: reminder.isDone ? "완료" : "진행중",
  };
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [warranty, setWarranty] = useState<ProductWarrantyResponse | null>(
    null,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [officialManual, setOfficialManual] =
    useState<ProductOfficialManualResponse | null>(null);
  const [repairHistories, setRepairHistories] = useState<
    RepairHistoryResponse[]
  >([]);
  const [notifications, setNotifications] = useState<
    ProductNotificationResponse[]
  >([]);

  const [selectedNotification, setSelectedNotification] =
    useState<ProductNotificationResponse | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAlarmTitle, setEditAlarmTitle] = useState("");
  const [editAlarmDate, setEditAlarmDate] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeDate, setCompleteDate] = useState("");
  const [isCompleteSubmitting, setIsCompleteSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        setErrorMessage("");

        const productResponse = await api.get<ProductDetailResponse>(
          `/products/${productId}`,
        );

        const productData = productResponse.data;

        setProduct(productData);
        setIsFavorite(productData.isFavorite);

        if (productData.hasRepairHistory) {
          try {
            const repairResponse = await api.get<RepairHistoryResponse[]>(
              `/products/${productId}/repairs`,
            );

            setRepairHistories(repairResponse.data);
          } catch (repairError) {
            console.error("수리 이력 조회 실패:", repairError);
            setRepairHistories([]);
          }
        } else {
          setRepairHistories([]);
        }

        if (productData.warrantyMonths > 0) {
          try {
            const warrantyResponse = await api.get<ProductWarrantyResponse>(
              `/products/${productId}/warranty`,
            );

            setWarranty(warrantyResponse.data);
          } catch {
            setWarranty(null);
          }
        } else {
          setWarranty(null);
        }

        try {
          const reminderResponse = await api.get<
            ProductRepairReminderResponse[]
          >(`/products/${productId}/repair-reminders`);

          const mappedNotifications = reminderResponse.data.map((reminder) =>
            mapProductRepairReminderToNotification(
              reminder,
              productId,
              productData.productName,
            ),
          );

          setNotifications(sortNotificationsByDate(mappedNotifications));
        } catch (reminderError) {
          console.error("특정 제품 수리 예정 목록 조회 실패:", reminderError);
          setNotifications([]);
        }

        try {
          const manualResponse = await api.get<ProductOfficialManualResponse>(
            `/products/${productId}/manual`,
          );

          setOfficialManual(manualResponse.data);
        } catch (manualError) {
          console.error("공식 매뉴얼 조회 실패:", manualError);
          setOfficialManual(null);
        }
      } catch (error) {
        console.error("제품 상세 조회 실패:", error);
        setErrorMessage("제품 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleFavoriteClick = async () => {
    if (!productId || !product) return;

    const nextFavorite = !isFavorite;

    try {
      setIsFavorite(nextFavorite);

      const response = await api.patch<{
        productId: string;
        isFavorite: boolean;
      }>(`/products/${productId}/favorite`, {
        isFavorite: nextFavorite,
      });

      setIsFavorite(response.data.isFavorite);
      setProduct((prev) =>
        prev ? { ...prev, isFavorite: response.data.isFavorite } : prev,
      );
    } catch (error) {
      console.error("즐겨찾기 수정 실패:", error);

      setIsFavorite(isFavorite);
      alert("즐겨찾기 상태 변경에 실패했습니다.");
    }
  };

  const handleEditProduct = () => {
    if (!product) return;

    navigate("/products/new", {
      state: {
        mode: "edit",
        productId: product.productId,
        productData: {
          productId: product.productId,
          productName: product.productName,
          nickname: product.nickname,
          category: product.category,
          imageUrl: product.imageUrl,
          modelNumber: product.modelNumber,
          purchaseDate: product.purchaseDate,
          warrantyMonths: product.warrantyMonths,
          isFavorite: product.isFavorite,
          hasRepairHistory: product.hasRepairHistory,
          createdAt: product.createdAt,
        },
      },
    });
  };

  const handleDeleteProduct = async () => {
    if (!productId) return;

    try {
      await api.delete(`/products/${productId}`);

      navigate("/products", { replace: true });
    } catch (error) {
      console.error("제품 삭제 실패:", error);
      alert("제품 삭제에 실패했습니다.");
    }
  };

  const handleNotificationPageClick = () => {
    if (!productId) return;

    navigate(`/products/${productId}/notifications`);
  };

  const handleNotificationClick = (
    notification: ProductNotificationResponse,
  ) => {
    setSelectedNotification(notification);
  };

  const handleCloseDetailModal = () => {
    setSelectedNotification(null);
    setIsCompleteModalOpen(false);
    setIsEditModalOpen(false);
    setCompleteDate("");
  };

  const handleOpenCompleteModal = () => {
    setIsCompleteModalOpen(true);
  };

  const handleCloseCompleteModal = () => {
    if (isCompleteSubmitting) return;

    setIsCompleteModalOpen(false);
    setCompleteDate("");
  };

  const handleCompleteOnlyNotification = async () => {
    if (!productId || !selectedNotification) return;

    if (!completeDate.trim()) {
      alert("완료 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsCompleteSubmitting(true);

      const response = await api.patch<ProductRepairReminderDoneResponse>(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}/done`,
        {
          isDone: true,
          completedDate: completeDate,
        },
      );

      const completedNotification: ProductNotificationResponse = {
        ...selectedNotification,
        date: response.data.completedAt ?? completeDate,
        status: response.data.isDone ? "완료" : "진행중",
      };

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.map((notification) =>
            notification.notificationId === selectedNotification.notificationId
              ? completedNotification
              : notification,
          ),
        ),
      );

      setSelectedNotification(completedNotification);
      setIsCompleteModalOpen(false);
      setCompleteDate("");
    } catch (error) {
      console.error("수리 예정 완료 처리 실패:", error);
      alert("수리 예정 완료 처리에 실패했습니다.");
    } finally {
      setIsCompleteSubmitting(false);
    }
  };

  const handleRepairHistoryRegister = async () => {
    if (!productId || !selectedNotification) return;

    if (!completeDate.trim()) {
      alert("완료 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsCompleteSubmitting(true);

      const response = await api.patch<ProductRepairReminderDoneResponse>(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}/done`,
        {
          isDone: true,
          completedDate: completeDate,
        },
      );

      const completedNotification: ProductNotificationResponse = {
        ...selectedNotification,
        date: response.data.completedAt ?? completeDate,
        status: response.data.isDone ? "완료" : "진행중",
      };

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.map((notification) =>
            notification.notificationId === selectedNotification.notificationId
              ? completedNotification
              : notification,
          ),
        ),
      );

      setSelectedNotification(completedNotification);
      setIsCompleteModalOpen(false);
      setCompleteDate("");

      navigate(`/products/${productId}/repairs/new`, {
        state: {
          notificationId: selectedNotification.notificationId,
          title: selectedNotification.title,
          date: completeDate,
        },
      });
    } catch (error) {
      console.error("수리 예정 완료 처리 실패:", error);
      alert("수리 예정 완료 처리에 실패했습니다.");
    } finally {
      setIsCompleteSubmitting(false);
    }
  };

  const handleEditNotification = () => {
    if (!selectedNotification) return;

    setEditAlarmTitle(selectedNotification.title);
    setEditAlarmDate(toDateInputValue(selectedNotification.date));
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isEditSubmitting) return;

    setIsEditModalOpen(false);
    setEditAlarmTitle("");
    setEditAlarmDate("");
  };

  const handleSubmitEditNotification = async () => {
    if (!productId || !selectedNotification) return;

    if (!editAlarmTitle.trim() || !editAlarmDate) {
      alert("알림 이름과 알림 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsEditSubmitting(true);

      const response = await api.patch<ProductRepairReminderUpdateResponse>(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}`,
        {
          title: editAlarmTitle.trim(),
          remindAt: editAlarmDate,
        },
      );

      const editedNotification: ProductNotificationResponse = {
        ...selectedNotification,
        notificationId: response.data.reminderId,
        title: response.data.title,
        date: response.data.isDone
          ? response.data.completedAt ?? response.data.remindAt
          : response.data.remindAt,
        status: response.data.isDone ? "완료" : "진행중",
      };

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.map((notification) =>
            notification.notificationId === selectedNotification.notificationId
              ? editedNotification
              : notification,
          ),
        ),
      );

      setSelectedNotification(editedNotification);
      handleCloseEditModal();
    } catch (error) {
      console.error("수리 예정 정보 수정 실패:", error);
      alert("수리 예정 정보 수정에 실패했습니다.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteNotification = async () => {
    if (!productId || !selectedNotification) return;

    try {
      setIsDeleteSubmitting(true);

      await api.delete(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}`,
      );

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.filter(
            (notification) =>
              notification.notificationId !== selectedNotification.notificationId,
          ),
        ),
      );

      setSelectedNotification(null);
    } catch (error) {
      console.error("수리 예정 삭제 실패:", error);
      alert("수리 예정 삭제에 실패했습니다.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const scheduledNotifications = sortNotificationsByDate(
    notifications.filter((notification) => notification.status === "진행중"),
  );

  if (isLoading) {
    return (
      <SecondLayout>
        <div className="flex h-full flex-col">
          <Header title="Product" showNotification={false} showCloseButton />
        </div>
      </SecondLayout>
    );
  }

  if (errorMessage || !product) {
    return <div>{errorMessage || "제품 정보를 찾을 수 없습니다."}</div>;
  }

  const maintenanceCategories = [
    {
      id: "battery",
      label: "배터리",
      replacementCycleMonths: 6,
      replacementHistories: [
        {
          id: "1",
          replacedDate: "2026-06-03",
        },
      ],
    },
    {
      id: "filter",
      label: "필터",
      replacementCycleMonths: 3,
      replacementHistories: [],
    },
  ];

  const repairInfoes = repairHistories.slice(0, 3).map((repair) => ({
    repairId: repair.repairId,
    repairName: repair.title,
    repairDate: repair.date,
    price: formatPrice(repair.cost),
  }));

  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="Product" showNotification={false} showCloseButton />

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col">
          <div className="my-[10px] flex flex-1 flex-col items-center gap-[10px] overflow-y-auto no-scrollbar">
            <ProductDetailContent
              productId={product.productId}
              imageSrc={product.imageUrl ?? defaultProductImage}
              nickname={product.nickname}
              productName={product.productName}
              category={
                CATEGORY_LABEL_MAP[product.category] ?? product.category
              }
              purchaseDate={product.purchaseDate}
              status={
                warranty ? getProductStatus(warranty.remainingDays) : "empty"
              }
              isFavorite={isFavorite}
              manualContent={product.manual?.manualContent ?? null}
              manualPdfUrl={officialManual?.manualUrl}
              warrantyMonths={warranty?.warrantyMonths ?? null}
              warrantyEndDate={warranty?.warrantyEndDate}
              remainingDays={warranty?.remainingDays}
              maintenanceCategories={maintenanceCategories}
              notificationInfo={
                <ProductNotificationInfo
                  notifications={scheduledNotifications}
                  onRegisterClick={handleNotificationPageClick}
                  onNotificationClick={handleNotificationClick}
                />
              }
              repairHistories={repairInfoes}
              officialUrl="https://example.com"
              customerServiceUrl={undefined}
              onFavoriteClick={handleFavoriteClick}
              onEditClick={handleEditProduct}
              onDeleteClick={handleDeleteProduct}
            />
          </div>
        </div>

        <ProductNotificationModal
          open={!!selectedNotification}
          title={selectedNotification?.title ?? ""}
          date={selectedNotification?.date ?? ""}
          status={selectedNotification?.status ?? "진행중"}
          onClose={handleCloseDetailModal}
          onComplete={handleOpenCompleteModal}
          onEdit={handleEditNotification}
          onDelete={isDeleteSubmitting ? undefined : handleDeleteNotification}
        />

        <ProductNotificationEditModal
          open={isEditModalOpen}
          alarmTitle={editAlarmTitle}
          alarmDate={editAlarmDate}
          isSubmitting={isEditSubmitting}
          onChangeAlarmTitle={setEditAlarmTitle}
          onChangeAlarmDate={setEditAlarmDate}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEditNotification}
        />

        <ProductNotificationCompleteModal
          open={isCompleteModalOpen}
          title={selectedNotification?.title ?? ""}
          date={selectedNotification?.date ?? ""}
          completeDate={completeDate}
          onChangeCompleteDate={setCompleteDate}
          onClose={handleCloseCompleteModal}
          onCompleteOnly={handleCompleteOnlyNotification}
          onRepairHistoryRegister={handleRepairHistoryRegister}
        />
      </div>
    </SecondLayout>
  );
}