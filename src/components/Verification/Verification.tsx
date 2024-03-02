import { ChangeEvent, FC, FormEvent, HTMLAttributes, ReactNode, KeyboardEvent, useState, useRef } from "react";
import "./Verification.scss";

interface iButton {
  title?: string;
  props?: HTMLAttributes<HTMLButtonElement>;
};

interface iVerification {
  className?: string;
  title?: string;
  submitBtn?: iButton;
  cancelBtn?: iButton;
  passLength?: number;
  children?: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>, valid: boolean) => void;
};

const digitsRegExp = /\D/;
const BACKSPACE = "Backspace";

export const Verification: FC<iVerification> = ({ children, title, submitBtn, cancelBtn, onSubmit: onSubmitCallBack, passLength = 4, className = "", }) => {
  const [state, setState] = useState<string[]>(new Array(passLength).fill(""));
  const formRef = useRef<HTMLFormElement | null>(null);

  const isValid = () => state.every(value => !!value);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitCallBack?.(e, isValid());
  };

  const onChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(new RegExp(digitsRegExp), "");
    if (!newValue) return;
    setState(pv => pv.with(index, newValue[newValue.length - 1]));
    const nextElement = e.target.nextElementSibling as HTMLInputElement;
    !!newValue && nextElement?.focus();
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === BACKSPACE) {
      e.preventDefault();
      setState(pv => pv.with(index, ""));
      const prevElement = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
      prevElement && prevElement?.focus?.();
    }
  };

  const onPaste = async () => {
    const text = await navigator?.clipboard?.readText();
    if (!text) return;
    const replaceDigitsAll = new RegExp(digitsRegExp, "g");
    const filtered = text?.replace(replaceDigitsAll, "").substring(0, passLength);
    const ds = Array.from({ length: passLength }, (_, key) => filtered[key] || "");
    setState(ds);
    const emptyCell = ds.indexOf("");
    const element = formRef.current?.querySelector(`input[name='${emptyCell === -1 ? passLength - 1 : emptyCell}']`) as HTMLInputElement;
    element && element?.focus?.();
  };

  return (
    <div className={`Verification ${className}`}>
      {title && <p className="Verification-title">{title}</p>}

      {children}

      <form
        className="Verification-form"
        id="verification-form"
        onSubmit={onSubmit}
        autoComplete="off"
        ref={formRef}
      >
        {state?.map((_, idx, array) => (
          <input
            type="text"
            className="Verification-input"
            key={idx}
            name={idx.toString()}
            value={array[idx]}
            autoComplete="off"
            onChange={onChange.bind(null, idx)}
            onPaste={onPaste}
            onKeyDown={onKeyDown.bind(null, idx)}
          />
        ))}
      </form>

      <div className="Verification-btns">
        <button
          form="verification-form"
          className="Verification-submit"
          {...submitBtn?.props}
        >
          {submitBtn?.title || "Submit"}
        </button>

        <button
          className="Verification-cancel"
          type="reset"
          {...cancelBtn?.props}
        >
          {cancelBtn?.title || "Cancel"}
        </button>
      </div>
    </div>
  );
};