type NotificationStatus = "진행중" | "완료";

type ProductNotificationCardProps = {
  title: string;
  date: string;
  status: NotificationStatus;
};

export default function ProductNotificationCard({
  title,
  date,
  status,
}: ProductNotificationCardProps) {
  return (
    <div className="relative flex shrink-0 cursor-pointer select-none flex-col items-center justify-center gap-[20px] rounded-[30px] border-[3px] border-primary-01 bg-white px-[40px] pb-[40px] pt-[60px] transition-colors hover:bg-secondary-01">
      <span className="absolute right-[19px] top-[14px] rounded-[10px] bg-neutral-04 px-[10px] py-[5px] text-body-m-16 text-primary-01">
        {status}
      </span>

      <p className="whitespace-nowrap text-center text-title-b-20 text-primary-01">
        {title}
      </p>

      <div className="flex flex-col items-center gap-[8px]">
        <p className="whitespace-nowrap text-center text-body-m-16 text-gray-01">
          {date}
        </p>

        <p className="text-center text-body-m-16 text-gray-01">예정</p>
      </div>
    </div>
  );
}