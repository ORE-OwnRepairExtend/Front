import type {
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import clsx from "clsx";

type BaseProps = {
  value: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

type InputProps = BaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "placeholder" | "className"
  > & {
    multiline?: false;
    variant?: "default" | "date";
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

type ProductInputBoxProps = InputProps | TextareaProps;

export default function ProductInputBox(props: ProductInputBoxProps) {
  const isTextarea = props.multiline === true;
  const hasSideText = Boolean(props.prefix || props.suffix);

  const wrapperStyle = clsx(
    "flex items-center bg-neutral-01 px-[15px] py-[10px] gap-[10px]",
    isTextarea ? "min-h-[40px] w-full" : "h-full",
    props.className,
  );

  const inputStyle = clsx(
    "h-full w-full min-w-0 bg-neutral-01",
    "text-body-r-15 text-gray-01",
    "placeholder:text-gray-02",
    "focus:outline-none focus:ring-0",
    hasSideText && "text-right",
    props.inputClassName,
  );

  const sideTextStyle = props.disabled
    ? "shrink-0 text-body-r-15 text-gray-02 whitespace-nowrap"
    : "shrink-0 text-body-r-15 text-primary-01 whitespace-nowrap";

  if (props.multiline) {
    const {
      multiline: _multiline,
      value,
      placeholder,
      className: _className,
      inputClassName: _inputClassName,
      prefix,
      suffix,
      onChange,
      ...textareaProps
    } = props;

    void _multiline;
    void _className;
    void _inputClassName;

    return (
      <div className={wrapperStyle}>
        {prefix && <span className={sideTextStyle}>{prefix}</span>}

        <textarea
          {...textareaProps}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clsx(inputStyle, "resize-none py-[10px]")}
        />

        {suffix && <span className={sideTextStyle}>{suffix}</span>}
      </div>
    );
  }

  const {
    multiline: _multiline,
    value,
    placeholder,
    className: _className,
    inputClassName: _inputClassName,
    prefix,
    suffix,
    onChange,
    variant = "default",
    type = variant === "date" ? "date" : "text",
    ...inputProps
  } = props;

  void _multiline;
  void _className;
  void _inputClassName;

  return (
    <div className={wrapperStyle}>
      {prefix && <span className={sideTextStyle}>{prefix}</span>}

      <input
        {...inputProps}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputStyle}
      />

      {suffix && <span className={sideTextStyle}>{suffix}</span>}
    </div>
  );
}
