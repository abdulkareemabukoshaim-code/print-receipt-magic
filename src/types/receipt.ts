export interface ReceiptItem {
  name: string;
  price: string;
  quantity: number;
}

export interface ReceiptData {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  date: string;
  transactionId: string;
  items: ReceiptItem[];
  subtotal: string;
  tax: string;
  total: string;
  paymentMethod: string;
  cashier: string;
  footerMessage: string;
  terms: string;
  style: ReceiptStyle;
}

export interface ReceiptOptions {
  includeQR: boolean;
  includeTerms: boolean;
  includeContact: boolean;
  includeLogo: boolean;
}

export type ReceiptStyle = 
  | 'modern'
  | 'thermal'
  | 'corporate'
  | 'retail'
  | 'restaurant'
  | 'pharmacy'
  | 'grocery'
  | 'gas'
  | 'coffee'
  | 'tech';