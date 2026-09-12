import { notFound } from "next/navigation";
import OrderDetailView from "@/components/umkm/OrderDetailView";
import { getOrderById } from "@/lib/orderMockData";

export default async function PesananDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
