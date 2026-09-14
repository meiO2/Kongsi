import { createClient } from "@/utils/supabase/server";
import type { Order } from "./orderData";

export async function getUmkmOrderByNumber(
  orderNumber: string,
): Promise<Order | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, group_deal_id, customer_name, product_name, quantity, unit_price, fulfillment, pickup_location, pickup_hours, delivery_address, delivery_fee, status",
    )
    .eq("order_number", orderNumber)
    .eq("owner_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .limit(1)
    .maybeSingle();

  if (error || !data) return undefined;

  return {
    id: data.order_number,
    kongsiId: data.group_deal_id,
    customerName: data.customer_name,
    productName: data.product_name,
    quantity: data.quantity,
    unitPrice: data.unit_price,
    fulfillment: data.fulfillment,
    pickupLocation: data.pickup_location ?? undefined,
    pickupHours: data.pickup_hours ?? undefined,
    deliveryAddress: data.delivery_address ?? undefined,
    deliveryFee: data.delivery_fee,
    status: data.status,
  };
}
