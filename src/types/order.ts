/* =========================
   COMMON / UTILS
========================= */

export interface MetaData {
  id: number;
  key: string;
  value: string | number | boolean | unknown[] | Record<string, unknown>;
  display_key?: string;
  display_value?: string | number | boolean | unknown[];
}

/* =========================
   BILLING & SHIPPING
========================= */

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

/* =========================
   ORDER LINE ITEM
========================= */

export interface OrderItemImage {
  id: string;
  src: string;
}

export interface OrderLineItem {
  wooLineItemId: number;
  productId: number;
  variationId: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: string;
  total: string;
  image?: OrderItemImage;
  meta_data?: MetaData[];
}

/* =========================
   SHIPMENT / COURIER
========================= */

export interface Shipment {
  provider: "delhivery" | "shiprocket" | "manual";
  pickupCode?: string;
  waybills: string[];
  status:
    | "pending"
    | "manifested"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "rto"
    | "returned";
  manifestedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  lastStatusAt?: string;
}

/* =========================
   STORE / VENDOR
========================= */

export interface Store {
  id: number;
  name: string;
  shop_name?: string;
  url?: string;
  address?: string[];
}

/* =========================
   RAW WOOCOMMERCE ORDER
   (Used mainly for debugging / reference)
========================= */

export interface RawWooOrder {
  id: number;
  status: string;
  currency: string;
  total: string;
  discount_total: string;
  payment_method: string;
  payment_method_title: string;
  billing: Address;
  shipping: Address;
  line_items: {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    subtotal: string;
    total: string;
    price: number;
    image?: OrderItemImage;
    meta_data?: MetaData[];
  }[];
  meta_data?: MetaData[];
  stores?: Store[];
  store?: Store;
}

/* =========================
   MAIN ORDER TYPE
========================= */

export interface Order {
  _id: string;

  wooOrderId: number;
  orderNumber: string;

  status: "processing" | "completed" | "cancelled" | "shipped" | string;

  currency: string;
  total: string;
  total_tax: string;
  discount_total: string;
  shipping_total: string;

  payment_method: string;
  payment_method_title: string;
  transaction_id: string;

  needs_payment: boolean;
  needs_processing: boolean;

  customerId: number;
  vendorId: number;

  shipment?: Shipment;

  billing: Address;
  shipping: Address;

  line_items: OrderLineItem[];

  meta_data?: MetaData[];

  store?: Store;

  date_created: string;
  date_modified: string;
  date_completed?: string | null;
  date_paid?: string | null;

  createdAt: string;
  updatedAt: string;

  rawWooOrder?: RawWooOrder;
}
