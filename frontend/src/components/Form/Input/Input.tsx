import { textFieldProps } from "../../../types";
import "./Input.css";
  
export default function Input({ 
  name,
  label,
  required,
  onChange,
  placeholder,
}: textFieldProps) {

  return (
    <div className="input-group">
      <input
        type="text"
        name={name}
        id={name}
        required={required}
        placeholder={placeholder || ""}
        onChange={onChange}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}