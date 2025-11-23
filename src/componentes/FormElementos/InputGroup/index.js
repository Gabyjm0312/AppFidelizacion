import { cn } from "../../../../lib/utils";
import { useId } from "react";

const InputGroup = ({
  className,
  label,
  type,
  placeholder,
  required,
  disabled,
  active,
  handleChange,
  icon,
  ...props
}) => {
  const id = useId();

  return (
    <div className={cn("mb-3", className)}>
      {/* LABEL */}
      <label htmlFor={id} className="form-label fw-medium text-dark">
        {label}
        {required && <span className="ms-1 text-danger">*</span>}
      </label>

      {/* CONTENEDOR BOOTSTRAP */}
      <div className="input-group mt-1">
        {/* Icono a la izquierda */}
        {props.iconPosition === "left" && icon && (
          <span className="input-group-text">{icon}</span>
        )}

        {/* INPUT */}
        <input
          id={id}
          type={type}
          name={props.name}
          placeholder={placeholder}
          onChange={handleChange}
          value={props.value}
          defaultValue={props.defaultValue}
          className={cn(
            "form-control",
            props.height === "sm" && "form-control-sm"
          )}
          required={required}
          disabled={disabled}
          data-active={active}
        />

        {/* Icono a la derecha */}
        {props.iconPosition === "right" && icon && (
          <span className="input-group-text">{icon}</span>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
