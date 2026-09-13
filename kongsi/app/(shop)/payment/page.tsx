import { Suspense } from "react";
import PaymentGatewayContent from "@/components/customer/PaymentGatewayContent";

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentGatewayContent />
    </Suspense>
  );
}
