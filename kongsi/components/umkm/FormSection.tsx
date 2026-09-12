import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E4E1DF] bg-white p-5 sm:p-6">
      <div>
        <h2
          className="text-lg font-bold text-[#292828]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-[#7A7876]">{description}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
