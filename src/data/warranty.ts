import type { WarrantyStep } from "../types/warranty";

export const warrantySteps: WarrantyStep[] = [
  { title: "Tell us what happened", description: "Send the order number and a clear description of the issue." },
  { title: "We diagnose the product", description: "Our team reviews the symptoms and proposes the next step." },
  { title: "Repair, replace or refund", description: "We choose the most sensible resolution under the warranty terms." },
];
