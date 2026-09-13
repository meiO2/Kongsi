import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getPaymentMethod(
  paymentType?: string,
): "qris" | "ewallet" | "va" | "kartu" | null {
  if (paymentType === "qris") return "qris";
  if (paymentType === "gopay" || paymentType === "shopeepay") return "ewallet";
  if (paymentType === "credit_card") return "kartu";
  if (
    paymentType === "bank_transfer" ||
    paymentType === "echannel" ||
    paymentType === "cstore"
  )
    return "va";
  return null;
}

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!serverKey || !clientKey) {
      return NextResponse.json(
        { error: "Konfigurasi Midtrans belum lengkap." },
        { status: 500 },
      );
    }
    const coreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey,
      clientKey,
    });
    const transaction = await (
      coreApi as unknown as {
        transaction: {
          notification: (payload: unknown) => Promise<Record<string, string>>;
        };
      }
    ).transaction.notification(notification);
    const transactionStatus = transaction.transaction_status;
    const isPaid =
      (transactionStatus === "settlement" || transactionStatus === "capture") &&
      transaction.fraud_status !== "deny";
    const isFailed = ["deny", "cancel", "expire"].includes(transactionStatus);
    const paymentStatus = isPaid ? "paid" : isFailed ? "failed" : "pending";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi." },
        { status: 500 },
      );
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const paymentMethod = getPaymentMethod(transaction.payment_type);
    let error: { message: string } | null = null;
    if (paymentStatus === "paid" && paymentMethod) {
      const result = await supabase.rpc("settle_group_deal_order", {
        p_order_number: transaction.order_id,
        p_payment_method: paymentMethod,
      });
      error = (result as unknown as { error: { message: string } | null })
        .error;
    } else if (paymentStatus === "failed") {
      const result = await supabase.rpc("release_group_deal_order", {
        p_order_number: transaction.order_id,
      });
      error = (result as unknown as { error: { message: string } | null })
        .error;
    } else {
      const result = await supabase
        .from("orders")
        .update({
          payment_status: paymentStatus,
          payment_method: paymentMethod,
        })
        .eq("order_number", transaction.order_id);
      error = result.error;
    }

    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Notifikasi pembayaran tidak valid.",
      },
      { status: 400 },
    );
  }
}
