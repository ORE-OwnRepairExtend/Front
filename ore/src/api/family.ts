import { isAxiosError } from "axios";
import { api } from "./api";

export type FamilyMember = {
  userId: string;
  name: string;
  email: string;
  profileImageUrl: string | null;
  nickname: string;
  isMe: boolean;
};

export type CreateFamilyInvitationRequest = {
  recipientEmail: string;
  nickname: string;
};

export type CreateFamilyInvitationResponse = {
  invitationId: string;
  recipientUserId: string;
  recipientName: string;
  nickname: string;
  status: "PENDING";
  createdAt: string;
};

export type FamilyInvitationStatus = "ACCEPTED" | "REJECTED";

export type FamilyProductOwner = {
  userId: string;
  name: string;
  nickname: string;
  isMe: boolean;
};

export type FamilyProduct = {
  productId: string;
  name: string;
  nickname: string;
  category: string;
  imageUrl: string | null;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  purchaseDate: string;
  remainingDays: number | null;
  createdAt: string;
  owner: FamilyProductOwner;
};

// 가족 구성원 목록 조회
export async function getFamilyMembers(signal?: AbortSignal) {
  const response = await api.get<FamilyMember[]>("/family/members", {
    signal,
  });

  return response.data;
}

// 가족 초대 요청
export async function createFamilyInvitation(
  data: CreateFamilyInvitationRequest,
) {
  const response = await api.post<CreateFamilyInvitationResponse>(
    "/family/invitations",
    data,
  );

  return response.data;
}

// 가족 초대 수락 또는 거절
export async function respondFamilyInvitation(
  invitationId: string,
  status: FamilyInvitationStatus,
) {
  // 거절 응답 형식은 첨부 명세에 없어 호출부에서 응답을 가정하지 않음
  await api.patch<unknown>(
    `/family/invitations/${encodeURIComponent(invitationId)}`,
    { status },
  );
}

// 가족 구성원 삭제
export async function deleteFamilyMember(familyUserId: string) {
  await api.delete(
    `/family/members/${encodeURIComponent(familyUserId)}`,
  );
}

// 가족 제품 목록 조회
export async function getFamilyProducts(
  familyUserId?: string,
  signal?: AbortSignal,
) {
  const response = await api.get<FamilyProduct[]>("/products", {
    params: {
      view: "FAMILY",
      ...(familyUserId ? { familyUserId } : {}),
    },
    signal,
  });

  return response.data;
}

// 서버 오류 메시지 추출
export function getFamilyErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
}