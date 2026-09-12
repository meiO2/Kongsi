import { notFound } from "next/navigation";
import KongsiDetailView from "@/components/umkm/KongsiDetailView";
import { getKongsiById } from "@/lib/kongsiMockData";

export default async function KongsiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = getKongsiById(id);

  if (!deal) {
    notFound();
  }

  return <KongsiDetailView deal={deal} />;
}
