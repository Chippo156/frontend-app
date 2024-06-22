export interface Coupon {
  id: number;
  code: string;
  discount: number;
  discount_type: string;
  expiration_date: Date;
}
