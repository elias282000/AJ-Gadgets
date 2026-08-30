import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DeliveryZone } from "@/types";

interface CheckoutBody {
  customer_name: string;
  phone: string;
  address: string;
  delivery_zone: DeliveryZone;
  items: { product_id: string; quantity: number }[];
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { customer_name, phone, address, delivery_zone, items } = body;

  if (
    !customer_name?.trim() ||
    !phone?.trim() ||
    !address?.trim() ||
    !["dhaka", "outside_dhaka"].includes(delivery_zone) ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing or invalid checkout details" },
      { status: 400 }
    );
  }

  try {
    const admin = getSupabaseAdmin();

    // Fetch real product data server-side — never trust prices sent from the client.
    const productIds = items.map((i) => i.product_id);
    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id, name, price, stock_status")
      .in("id", productIds);

    if (productsError) {
      console.error("checkout: failed to load products:", productsError.message);
      return NextResponse.json(
        { error: `Failed to load products: ${productsError.message}` },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      console.error("checkout: no matching products found for ids:", productIds);
      return NextResponse.json(
        { error: "None of the items in your cart could be found. Please refresh and try again." },
        { status: 409 }
      );
    }

    const missingIds = productIds.filter((id) => !products.some((p) => p.id === id));
    if (missingIds.length > 0) {
      console.error("checkout: missing product ids:", missingIds);
      return NextResponse.json(
        {
          error:
            "Some items in your cart are no longer available. Please remove them and try again.",
        },
        { status: 409 }
      );
    }

    const outOfStock = products.find((p) => p.stock_status === "out_of_stock");
    if (outOfStock) {
      return NextResponse.json(
        { error: `"${outOfStock.name}" is out of stock` },
        { status: 409 }
      );
    }

    // Fetch current delivery fees
    const { data: settings, error: settingsError } = await admin
      .from("settings")
      .select("key, value")
      .in("key", ["delivery_fee_dhaka", "delivery_fee_outside_dhaka"]);

    if (settingsError) {
      console.error("checkout: failed to load settings:", settingsError.message);
      return NextResponse.json(
        { error: `Failed to load delivery settings: ${settingsError.message}` },
        { status: 500 }
      );
    }

    const settingsMap = Object.fromEntries(
      (settings ?? []).map((s) => [s.key, Number(s.value)])
    );
    const deliveryFee =
      delivery_zone === "dhaka"
        ? settingsMap.delivery_fee_dhaka ?? 60
        : settingsMap.delivery_fee_outside_dhaka ?? 120;

    let subtotal = 0;
    const orderItemsPayload = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id)!;
      const qty = Math.max(1, Math.floor(item.quantity));
      subtotal += product.price * qty;
      return {
        product_id: product.id,
        product_name_snapshot: product.name,
        price_snapshot: product.price,
        quantity: qty,
      };
    });

    const totalAmount = subtotal + deliveryFee;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        customer_name: customer_name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        delivery_zone,
        delivery_fee: deliveryFee,
        subtotal,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("checkout: failed to create order:", orderError?.message);
      return NextResponse.json(
        { error: `Failed to create order: ${orderError?.message ?? "unknown error"}` },
        { status: 500 }
      );
    }

    const { error: itemsError } = await admin
      .from("order_items")
      .insert(orderItemsPayload.map((item) => ({ ...item, order_id: order.id })));

    if (itemsError) {
      console.error("checkout: failed to insert order items:", itemsError.message);
      const { error: deleteError } = await admin.from("orders").delete().eq("id", order.id);
      if (deleteError) {
        console.error("checkout: failed to roll back order:", deleteError.message);
      }
      return NextResponse.json(
        { error: `Failed to save order items: ${itemsError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: order.id, totalAmount });
  } catch (err) {
    console.error("checkout: unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error" },
      { status: 500 }
    );
  }
}
