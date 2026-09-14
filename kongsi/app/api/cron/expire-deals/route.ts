import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("expire_group_deals");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  if (!serverKey || !clientKey) {
    return NextResponse.json(
      { expiration: data, error: "Kongsi sudah ditutup, tetapi konfigurasi refund Midtrans belum lengkap." },
      { status: 500 },
    );
  }

  const { data: pendingRefunds, error: refundQueryError } = await supabase
    .from("payment")
    .select("payment_id, amount, transaction_reference")
    .eq("payment_status", "REFUND_PENDING")
    .not("transaction_reference", "is", null)
    .limit(25);
  if (refundQueryError) {
    return NextResponse.json(
      { expiration: data, error: refundQueryError.message },
      { status: 500 },
    );
  }

  const coreApi = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey,
    clientKey,
  });
  const transaction = (coreApi as unknown as {
    transaction: {
      refund: (orderId: string, payload: Record<string, unknown>) => Promise<unknown>;
    };
  }).transaction;
  const refunds: Array<{ orderNumber: string; success: boolean; error?: string }> = [];

  for (const payment of pendingRefunds ?? []) {
    const orderNumber = payment.transaction_reference as string;
    try {
      await transaction.refund(orderNumber, {
        refund_key: `kongsi-${payment.payment_id}`,
        amount: Number(payment.amount),
        reason: "Target Kongsi tidak tercapai",
      });
      const { error: completeError } = await supabase.rpc(
        "complete_group_deal_refund",
        { p_order_number: orderNumber },
      );
      if (completeError) throw completeError;
      refunds.push({ orderNumber, success: true });
    } catch (refundError) {
      refunds.push({
        orderNumber,
        success: false,
        error: refundError instanceof Error ? refundError.message : "Refund Midtrans gagal.",
      });
    }
  }

  return NextResponse.json({ expiration: data, refunds });
}
