export interface ObjectId {
  $oid: string;
}

export interface Dimension {
  length: string;
  width: string;
  height: string;
  _id?: ObjectId;
}

export interface ProductImage {
  id: number;
  date_created?: string; // convert from MongoDB date object to ISO string in your app layer
  date_modified?: string;
  src: string;
  name?: string;
  alt?: string;
  thumbnail?: string;
  _id?: ObjectId;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  _id?: ObjectId;
}

export interface TagOrBrand {
  id: number;
  name: string;
  slug?: string;
  _id?: ObjectId;
}

export interface MetaData {
  id: number;
  key: string;
  value: string | number | Record<string, unknown> | unknown[] | null;
  _id?: ObjectId;
}

export interface Store {
  id: number;
  name?: string;
  shop_name?: string;
  url?: string;
  address?: string[];
  avatar?: string;
  banner?: string;
  _id?: ObjectId;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface Product {
  wooId: number;
  name: string;
  slug: string;
  permalink?: string;
  date_created?: string;
  date_modified?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  status?: string;
  featured?: boolean;
  catalog_visibility?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  on_sale?: boolean;
  purchasable?: boolean;
  total_sales?: number;
  virtual?: boolean;
  downloadable?: boolean;
  downloads?: unknown[];  // No example data, keep unknown[] for now
  download_limit?: number;
  download_expiry?: number;
  external_url?: string;
  button_text?: string;
  tax_status?: string;
  tax_class?: string;
  manage_stock?: boolean;
  stock_quantity?: number | null;
  backorders?: string;
  backorders_allowed?: boolean;
  backordered?: boolean;
  low_stock_amount?: number;
  sold_individually?: boolean;
  weight?: string;
  dimensions?: Dimension;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  shipping_class?: string;
  shipping_class_id?: number;
  reviews_allowed?: boolean;
  average_rating?: string;
  rating_count?: number;
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  parent_id?: number;
  purchase_note?: string;
  categories?: Category[];
  brands?: TagOrBrand[];
  tags?: TagOrBrand[];
  images?: ProductImage[];
  attributes?: Attribute[];
  default_attributes?: unknown[];  // No data to define shape, keep unknown[]
  variations?: number[];
  grouped_products?: unknown[];  // No example, keep unknown[]
  menu_order?: number;
  price_html?: string;
  related_ids?: number[];
  meta_data?: MetaData[];
  stock_status?: string;
  has_options?: boolean;
  post_password?: string;
  global_unique_id?: string;
  dokan_rma_settings?: unknown;  // No example, keep unknown
  store?: Store;
}