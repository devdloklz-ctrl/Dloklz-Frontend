export interface PickupLocation {
  _id?: string;
  code?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  isActive?: boolean;
}