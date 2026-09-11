    type DealCardProps = {
    image: string;
    productName: string;
    seller: string;
    normalPrice: string;
    dealPrice: string;
    current: number;
    target: number;
    remaining: string;
    location?: string;
    };

    export default function DealCard({
    image,
    productName,
    seller,
    normalPrice,
    dealPrice,
    current,
    target,
    remaining,
    location,
    }: DealCardProps) {
    const progress = Math.min((current / target) * 100, 100);
    const remainingPeople = Math.max(target - current, 0);

    return (
        <article className="group overflow-hidden rounded-2xl border border-[#E7E5E3] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(41,40,40,0.08)]">
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#F1EFEF]">
            <img
            src={image}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute left-3 top-3 rounded-full bg-[#FFCF00] px-3 py-1 text-xs font-bold text-[#292828]">
            Kongsi!
            </div>
        </div>

        <div className="p-5">
            {/* Seller */}
            <p className="text-xs font-medium text-[#7A7876]">{seller}</p>

            {/* Product */}
            <h3 className="mt-1 text-lg font-bold text-[#292828]">
            {productName}
            </h3>

            {/* Price */}
            <div className="mt-3 flex items-end gap-2">
            <span className="text-sm text-[#999694] line-through">
                {normalPrice}
            </span>

            <span className="text-xl font-bold text-[#3991FA]">
                {dealPrice}
            </span>
            </div>

            {/* Progress */}
            <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#404040]">
                {current}/{target} orang
                </span>

                <span className="font-medium text-[#7A7876]">
                {Math.round(progress)}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#EAE8E6]">
                <div
                className="h-full rounded-full bg-[#3991FA] transition-all"
                style={{ width: `${progress}%` }}
                />
            </div>
            </div>

            {/* Remaining */}
            <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#3991FA]">
                🔥 Tinggal {remainingPeople} orang lagi!
            </span>

            <span className="whitespace-nowrap text-xs text-[#7A7876]">
                ⏰ {remaining}
            </span>
            </div>

            {/* Location */}
            {location && (
            <p className="mt-3 text-xs text-[#7A7876]">
                📍 {location}
            </p>
            )}
        </div>
        </article>
    );
    }