export interface Offer {
  id: string;
  title: string;
  description?: string;
  price: number;
  active: boolean;
  createdAt?: string;
}
