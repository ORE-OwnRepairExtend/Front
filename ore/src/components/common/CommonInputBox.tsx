import type {
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

type Variant = "profile" | "title" | "content";

type BaseProps = {
  variant?: Variant;
  value: string;
  placeholder?: string;
  className?: string;
};

type InputProps = BaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "placeholder" | "className"
  > & {
    multiline?: false;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };

type TextareaProps = BaseProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange" | "placeholder" | "className"
  > & {
    multiline: true;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  };

type CommonInputBoxProps = InputProps | TextareaProps;

export default function CommonInputBox({
  variant = "content",
  value,
  placeholder,
  className,
  ...restProps
}: CommonInputBoxProps) {
  const variantStyle = clsx({
    "border rounded-[15px] border-[2px] border-white px-[20px] py-[5px] text-body-b-16 text-white focus:outline-none focus:ring-0":
      variant === "profile",
    "border rounded-[10px] border-[3px] border-primary-02 px-[20px] py-[7px] text-body-sb-20 text-primary-02 focus:outline-none focus:ring-0":
      variant === "title",
    "border rounded-[10px] border-[2px] border-primary-01 px-[20px] py-[7px] text-body-r-16 text-gray-01 focus:outline-none focus:ring-0":
      variant === "content",
  });

  if ("multiline" in restProps && restProps.multiline) {
    const { onChange, ...textareaProps } = restProps;

    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(variantStyle, "resize-none", className)}
        {...textareaProps}
      />
    );
  }

  const { onChange, type = "text", ...inputProps } = restProps;

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(variantStyle, className)}
      {...inputProps}
    />
  );
}
