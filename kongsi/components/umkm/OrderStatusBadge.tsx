    import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/orderMockData";

    const STATUS_STYLES: Record<OrderStatus, string> = {
    menunggu: "bg-[#7A7876]/10 text-[#7A7876]",
    "perlu-diproses": "bg-[#FFCF00]/20 text-[#7A6300]",
    diproses: "bg-[#3991FA]/10 text-[#3991FA]",
    "siap-diambil": "bg-[#1FA971]/10 text-[#1FA971]",
    "sedang-dikirim": "bg-[#3991FA]/10 text-[#3991FA]",
    selesai: "bg-[#1FA971]/10 text-[#1FA971]",
    dibatalkan: "bg-[#E14B4B]/10 text-[#E14B4B]",
    };

    export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
        className={[
            "inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold",
            STATUS_STYLES[status],
        ].join(" ")}
        >
        {ORDER_STATUS_LABEL[status]}
        </span>
    );
    }
