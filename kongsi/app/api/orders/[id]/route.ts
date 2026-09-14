import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ALLOWED_STATUSES = [
  "diproses",
  "siap-diambil",
  "sedang-dikirim",
  "selesai",
] as const;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { status } = await request.json();
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Status pesanan tidak valid." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Kamu harus login terlebih dahulu." },
        { status: 401 },
      );
    }
    const { data, error } = await supabase.rpc("update_umkm_order_status", {
      p_order_number: decodeURIComponent(id),
      p_status: status,
    });

    if (error) {
      const isClientError =
        error.message.includes("tidak ditemukan") ||
        error.message.includes("tidak valid") ||
        error.message.includes("tidak sesuai");
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: isClientError ? 400 : 500 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengubah status pesanan.",
      },
      { status: 500 },
    );
  }
}
