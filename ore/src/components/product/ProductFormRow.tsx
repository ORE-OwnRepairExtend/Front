type ProductFormRowProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function ProductFormRow({
  label,
  required = false,
  children,
  className = "",
  contentClassName = "",
}: ProductFormRowProps) {
  return (
    <div className={`flex bg-white ${className}`}>
      <div className="flex min-h-[40px] w-[150px] shrink-0 items-start gap-[10px] px-[15px] py-[10px] text-body-m-16 text-gray-01">
        <span>{label}</span>
        {required && (
          <span className="mt-[5px] h-[10px] w-[10px] shrink-0 rounded-full bg-red-500" />
        )}
      </div>

      <div
        className={`flex min-h-[40px] flex-1 items-start py-[10px] pl-[10px] pr-[30px] ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
