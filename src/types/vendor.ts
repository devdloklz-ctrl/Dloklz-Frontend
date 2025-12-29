// types/vendor.ts

export interface VendorSocial {
  fb?: string;
  twitter?: string;
  pinterest?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
  flickr?: string;
  threads?: string;
}

export interface VendorRating {
  rating?: string;
  count?: number;
}

export interface Vendor {
  /** MongoDB */
  _id: string;
  createdAt?: string;
  updatedAt?: string;

  /** Dokan / Woo */
  id?: number;          // Dokan vendor ID
  user_id?: number;     // WooCommerce user ID

  /** Identity */
  store_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;

  /** Profile */
  social?: VendorSocial;
  show_email?: boolean;
  address?: unknown[];      // keep flexible unless you normalize it
  location?: string;
  banner?: string;
  gravatar?: string;
  shop_url?: string;

  /** Business */
  company_name?: string;
  vat_number?: string;
  company_id_number?: string;
  bank_name?: string;
  bank_iban?: string;

  /** Status */
  rating?: VendorRating;
  enabled?: boolean;
  trusted?: boolean;
  payment?: string;
  registered?: string;

  /** Sync */
  synced_from_woo?: boolean;
}

export interface VendorForm {
  store_name: string;
  email?: string;
  enabled: boolean;
}