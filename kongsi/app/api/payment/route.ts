import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Kamu harus login terlebih dahulu." },
      { status: 401 },
    );
  }

  const body = await request.json();
  if (!body.orderId || !body.paymentMethod) {
    return NextResponse.json(
      { error: "Data pembayaran tidak lengkap." },
      { status: 400 },
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, payment_status")
    .eq("id", body.orderId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Pesanan tidak ditemukan." },
      { status: 404 },
    );
  }

  if (order.payment_status === "paid") {
    return NextResponse.json(
      { error: "Pesanan ini sudah dibayar." },
      { status: 409 },
    );
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  if (!serverKey || !clientKey) {
    return NextResponse.json(
      { error: "Konfigurasi Midtrans belum lengkap." },
      { status: 500 },
    );
  }

  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey,
    clientKey,
  });

  const enabledPayments: Record<string, string[]> = {
    qris: ["qris"],
    ewallet: ["gopay"],
    va: ["bca_va", "bni_va", "bri_va"],
    kartu: ["credit_card"],
  };

  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: order.order_number,
        gross_amount: order.total_amount,
      },
      enabled_payments: enabledPayments[body.paymentMethod] ?? ["qris"],
      customer_details: {
        first_name: user.user_metadata?.name ?? user.email?.split("@")[0],
        email: user.email,
      },
    } as unknown as Parameters<typeof snap.createTransaction>[0]);

    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      clientKey,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Transaksi Midtrans gagal dibuat.",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Kamu harus login terlebih dahulu." },
      { status: 401 },
    );
  }

  const orderId = new URL(request.url).searchParams.get("orderId");
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, payment_status, participation_id")
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Pesanan tidak ditemukan." },
      { status: 404 },
    );
  }

  if (data.payment_status === "paid" && data.participation_id) {
    return NextResponse.json(data);
  }

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
        status: (orderId: string) => Promise<Record<string, string>>;
      };
    }
  ).transaction
    .status(data.order_number)
    .catch(() => null);

  const transactionStatus = transaction?.transaction_status;
  const paymentMethod = transaction?.payment_type
    ? getPaymentMethod(transaction.payment_type)
    : null;
  if (
    paymentMethod &&
    (transactionStatus === "settlement" || transactionStatus === "capture")
  ) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi." },
        { status: 500 },
      );
    }
    const admin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    let settled;
    try {
      settled = await admin.rpc("settle_group_deal_order", {
        p_order_number: data.order_number,
        p_payment_method: paymentMethod,
      });
    } catch (settlementError) {
      console.error("Payment settlement failed:", settlementError);
      return NextResponse.json(
        { error: "Settlement database gagal dipanggil." },
        { status: 502 },
      );
    }
    if (settled.error) {
      console.error("Payment settlement RPC error:", settled.error);
      return NextResponse.json(
        {
          error: "Settlement database gagal.",
          code: settled.error.code,
          detail: settled.error.details,
        },
        { status: 502 },
      );
    }
    return NextResponse.json(settled.data);
  }

  return NextResponse.json(data);
}

function getPaymentMethod(
  paymentType?: string,
): "qris" | "ewallet" | "va" | "kartu" | null {
  if (paymentType === "qris") return "qris";
  if (paymentType === "gopay" || paymentType === "shopeepay") return "ewallet";
  if (paymentType === "credit_card") return "kartu";
  if (["bank_transfer", "echannel", "cstore"].includes(paymentType ?? ""))
    return "va";
  return null;
}
