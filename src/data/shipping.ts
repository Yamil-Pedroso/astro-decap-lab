import type { DeliveryOption } from "../types/shipping";

export const deliveryOptions: DeliveryOption[] = [
  { number: "01", title: "Standard delivery", time: "2–4 business days", description: "Tracked delivery across Switzerland for everyday orders." },
  { number: "02", title: "Priority delivery", time: "1–2 business days", description: "Faster tracked shipping when your setup cannot wait." },
  { number: "03", title: "Secure packaging", time: "Always included", description: "Protective, right-sized packaging designed for refurbished hardware." },
];
