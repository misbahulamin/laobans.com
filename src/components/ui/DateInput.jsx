import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "../../lib/utils";

const DateInput = forwardRef(({ value, onChange, placeholder = "Select date", className, error, ...props }, ref) => {
  const CustomInput = ({ value, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors duration-200",
        error && "border-destructive",
        !value && "text-muted-foreground",
        className
      )}
    >
      <span>{value || placeholder}</span>
      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>
  );

  return (
    <div>
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={onChange}
        customInput={<CustomInput />}
        dateFormat="MMM dd, yyyy"
        placeholderText={placeholder}
        className={cn("w-full", className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
});

DateInput.displayName = "DateInput";
export { DateInput };
