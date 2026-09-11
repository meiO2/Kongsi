    "use client";

    import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

    interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    rightElement?: ReactNode;
    }

    const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, rightElement, id, className, ...inputProps }, ref) => {
        const fieldId = id ?? inputProps.name;

        return (
        <div className="flex flex-col gap-1.5">
            <label
            htmlFor={fieldId}
            className="text-sm font-medium text-[#292828]"
            >
            {label}
            </label>
            <div className="relative">
            <input
                ref={ref}
                id={fieldId}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                className={[
                "w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-[#292828]",
                "placeholder:text-[#B3B0AE] outline-none transition-colors",
                "focus:border-[#3991FA] focus:ring-4 focus:ring-[#3991FA]/15",
                error
                    ? "border-[#E14B4B] focus:border-[#E14B4B] focus:ring-[#E14B4B]/15"
                    : "border-[#E4E1DF]",
                rightElement ? "pr-11" : "",
                className ?? "",
                ].join(" ")}
                {...inputProps}
            />
            {rightElement && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                {rightElement}
                </div>
            )}
            </div>
            {error && (
            <p id={`${fieldId}-error`} className="text-sm text-[#E14B4B]">
                {error}
            </p>
            )}
        </div>
        );
    }
    );

    FormField.displayName = "FormField";

    export default FormField;