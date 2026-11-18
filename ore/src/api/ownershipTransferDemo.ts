import { useSyncExternalStore } from "react";

export const ownershipTransferDemoEnabled = import.meta.env.DEV;

const usersKey = "ore:ownership-transfer-demo:users";
const transfersKey = "ore:ownership-transfer-demo:requests";
const changeEvent = "ore:ownership-transfer-demo:change";
const notificationIdPrefix = "ownership-transfer:";

export function isOwnershipTransferNotification(id: string) {
  return id.startsWith(notificationIdPrefix);
}

type DemoUser = {
  userId: string;
  email: string;
  name: string;
};

type TransferProduct = {
  productId: string;
  productName: string;
  nickname: string;
};

export type OwnershipTransferDecision = "ACCEPTED" | "REJECTED";

export type OwnershipTransfer = TransferProduct & {
  id: string;
  sender: DemoUser;
  recipientId: string;
  status: "PENDING" | OwnershipTransferDecision;
  createdAt: string;
  isRead: boolean;
};

function getStoredValue(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readStored<T>(key: string): T | null {
  try {
    return JSON.parse(getStoredValue(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}

function asDemoUser(value: unknown): DemoUser | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("userId" in value) ||
    !("email" in value) ||
    !("name" in value) ||
    typeof value.userId !== "string" ||
    typeof value.email !== "string" ||
    typeof value.name !== "string"
  ) {
    return null;
  }

  return { userId: value.userId, email: value.email, name: value.name };
}

export function getTransferDemoUser() {
  return ownershipTransferDemoEnabled ? asDemoUser(readStored("user")) : null;
}

// 개발 환경에서 이 브라우저에 로그인한 계정만 이메일로 확인할 수 있습니다.
export function rememberTransferDemoUser(account: DemoUser) {
  if (!ownershipTransferDemoEnabled) return;

  const user = asDemoUser(account);
  if (!user) return;

  const users = readStored<DemoUser[]>(usersKey) ?? [];
  const nextUsers = [
    ...users.filter((item) => item.userId !== user.userId),
    user,
  ];

  try {
    localStorage.setItem(usersKey, JSON.stringify(nextUsers));
  } catch {
    // 데모 데이터 저장 실패가 로그인까지 막지 않도록 합니다.
  }
}

function requireUser() {
  const user = getTransferDemoUser();
  if (!user) throw new Error("로그인 정보를 확인할 수 없습니다.");
  return user;
}

export function findTransferRecipient(email: string) {
  const sender = requireUser();
  const address = email.trim().toLowerCase();
  if (!address) throw new Error("아이디를 입력해주세요.");

  if (sender.email.toLowerCase() === address) {
    throw new Error("본인에게는 소유권 이전을 요청할 수 없습니다.");
  }

  const users = readStored<DemoUser[]>(usersKey) ?? [];
  const recipient = users.find((user) => user.email.toLowerCase() === address);
  if (!recipient) throw new Error("존재하지 않는 회원입니다.");

  return recipient;
}

function readTransfers() {
  return readStored<OwnershipTransfer[]>(transfersKey) ?? [];
}

function saveTransfers(transfers: OwnershipTransfer[]) {
  localStorage.setItem(transfersKey, JSON.stringify(transfers));
  window.dispatchEvent(new Event(changeEvent));
}

export function requestOwnershipTransfer(
  product: TransferProduct,
  email: string,
) {
  const sender = requireUser();
  const recipient = findTransferRecipient(email);
  const transfers = readTransfers();

  const existing = transfers.some(
    (transfer) =>
      transfer.productId === product.productId &&
      transfer.sender.userId === sender.userId &&
      transfer.status !== "REJECTED",
  );

  if (existing) throw new Error("이미 요청한 제품입니다.");

  saveTransfers([
    {
      ...product,
      id: `${notificationIdPrefix}${crypto.randomUUID()}`,
      sender,
      recipientId: recipient.userId,
      createdAt: new Date().toISOString(),
      isRead: false,
      status: "PENDING",
    },
    ...transfers,
  ]);
}

export function respondToOwnershipTransfer(
  id: string,
  status: OwnershipTransferDecision,
) {
  const user = requireUser();
  const transfers = readTransfers();
  const transfer = transfers.find(
    (item) => item.id === id && item.recipientId === user.userId,
  );

  if (!transfer || transfer.status !== "PENDING") {
    throw new Error("이미 처리되었거나 확인할 수 없는 요청입니다.");
  }

  saveTransfers(
    transfers.map((item) =>
      item.id === id ? { ...item, status, isRead: true } : item,
    ),
  );
}

export function markOwnershipTransfersRead(ids: string[]) {
  const user = requireUser();
  const transfers = readTransfers();
  const unread = transfers.filter(
    (item) =>
      item.recipientId === user.userId && !item.isRead && ids.includes(item.id),
  );

  if (unread.length) {
    saveTransfers(
      transfers.map((item) =>
        unread.includes(item) ? { ...item, isRead: true } : item,
      ),
    );
  }
}

function subscribe(onChange: () => void) {
  if (!ownershipTransferDemoEnabled) return () => {};

  function onStorage(event: StorageEvent) {
    if (
      event.key === transfersKey ||
      event.key === "user" ||
      event.key === null
    ) {
      onChange();
    }
  }

  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

let lastSnapshot = "";
let lastTransfers: OwnershipTransfer[] = [];

function getSnapshot() {
  if (ownershipTransferDemoEnabled) {
    const currentUser = getTransferDemoUser();
    const snapshot = JSON.stringify([
      currentUser?.userId,
      getStoredValue(transfersKey),
    ]);

    if (snapshot !== lastSnapshot) {
      lastSnapshot = snapshot;
      lastTransfers = currentUser
        ? readTransfers().filter(
            (item) =>
              item.recipientId === currentUser.userId ||
              item.sender.userId === currentUser.userId,
          )
        : [];
    }
  }

  return lastTransfers;
}

export function useOwnershipTransfers() {
  return useSyncExternalStore(subscribe, getSnapshot);
}