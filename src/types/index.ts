export type StockStatus = "in_stock" | "out_of_stock";
export type DeliveryZone = "dhaka" | "outside_dhaka";
export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface Category {
  id: string;
  name: string;
  name_bn: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  name_bn: string;
  description: string;
  description_bn: string;
  price: number;
  category_id: string | null;
  stock_status: StockStatus;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  delivery_zone: DeliveryZone;
  delivery_fee: number;
  status: OrderStatus;
  subtotal: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  product_id: string;
  name: string;
  name_bn: string;
  price: number;
  image_url: string | null;
  quantity: number;
}
