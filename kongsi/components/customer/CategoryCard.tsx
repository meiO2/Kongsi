    type CategoryCardProps = {
    name: string;
    icon: string;
    };

    export default function CategoryCard({
    name,
    icon,
    }: CategoryCardProps) {
    return (
        <button
        type="button"
        className="group flex min-w-[105px] flex-col items-center gap-3 rounded-2xl border border-[#E8E6E4] bg-white p-4 transition-all hover:-translate-y-1 hover:border-[#3991FA]/30 hover:shadow-[0_6px_20px_rgba(57,145,250,0.10)]"
        >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3991FA]/10 text-2xl transition-transform group-hover:scale-105">
            {icon}
        </div>

        <span className="text-center text-sm font-semibold text-[#404040]">
            {name}
        </span>
        </button>
    );
    }