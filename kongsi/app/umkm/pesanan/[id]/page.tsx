import { notFound } from "next/navigation";
import OrderDetailView from "@/components/umkm/OrderDetailView";
import { getUmkmOrderByNumber } from "@/lib/umkmOrders";

export default async function PesananDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getUmkmOrderByNumber(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
