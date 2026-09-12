import type { Category } from "@/lib/customerMockData";

interface CategoryCardProps {
  category: Category;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ category, active = false, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
        active
          ? "border-[#3991FA] bg-[#3991FA]/[0.06] text-[#3991FA]"
          : "border-[#E4E1DF] bg-white text-[#292828] hover:border-[#3991FA]/40",
      ].join(" ")}
    >
      <span className="text-lg leading-none" aria-hidden>
        {category.emoji}
      </span>
      <span>{category.label}</span>
    </button>
  );
}
