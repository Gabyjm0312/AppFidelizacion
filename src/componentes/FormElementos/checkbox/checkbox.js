import { CheckIcon, XIcon } from "@/src/assets/iconos";
import { useId } from "react";

export function Checkbox({
  withIcon,
  label,
  name,
  onChange,
}) {
  const id = useId();

  return (
    <div className="form-check d-flex align-items-center gap-2">
      <input
        type="checkbox"
        className="form-check-input"
        id={id}
        name={name}
        onChange={onChange}
      />

      <label
        className="form-check-label d-flex align-items-center"
        htmlFor={id}
      >
        <span>{label}</span>

        {withIcon === "check" && (
          <span className="ms-2">
            <CheckIcon width={12} height={12} />
          </span>
        )}

        {withIcon === "x" && (
          <span className="ms-2">
            <XIcon width={12} height={12} />
          </span>
        )}
      </label>
    </div>
  );
}
