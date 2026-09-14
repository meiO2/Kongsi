import { ORDER_STATUS_LABEL, type Order, type OrderStatus } from "@/lib/orderData";

function getSteps(fulfillment: Order["fulfillment"]): OrderStatus[] {
  const readyStatus: OrderStatus = fulfillment === "pickup" ? "siap-diambil" : "sedang-dikirim";
  return ["perlu-diproses", "diproses", readyStatus, "selesai"];
}

export default function OrderStatusTimeline({ order }: { order: Order }) {
  if (order.status === "dibatalkan" || order.status === "menunggu") {
    return null;
  }

  const steps = getSteps(order.fulfillment);
  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="flex items-start gap-1">
      {steps.map((step, index) => {
        const isDone = currentIndex >= 0 && index <= currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isDone ? "bg-[#3991FA] text-white" : "bg-[#E4E1DF] text-[#7A7876]",
                ].join(" ")}
              >
                {index + 1}
              </span>
              {!isLast && (
                <span
                  className={["mx-1 h-[2px] flex-1", isDone ? "bg-[#3991FA]" : "bg-[#E4E1DF]"].join(" ")}
                />
              )}
            </div>
            <span
              className={[
                "text-center text-[11px] font-medium leading-tight",
                isDone ? "text-[#292828]" : "text-[#B3B0AE]",
              ].join(" ")}
            >
              {ORDER_STATUS_LABEL[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
