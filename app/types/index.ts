// export type OrderPayload = {
//   id?: string;
//   user_id?: string;
//   product_name: string;
//   quantity: number;
//   price: number;
//   fullname: string;
//   phone: string;
//   address: string;
//   alternate_address?: string | null;
//   city?: string | null;
//   state?: string | null;
//   zip_code?: string | null;
//   payment_method?: string;
//   status?: string;
//   total?: number;
//   created_at?: string;
//   updated_at?: string;
//   tracking_number?: string | null;
// };
// types/index.ts
export interface OrderPayload {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderDetails {
  customerName: string;
  email: string;
  address: string;
  phone: string;
}