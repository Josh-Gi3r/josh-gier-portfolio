export type QuantityUnit = "g" | "ml" | "count";

export type Quantity = Readonly<{
  qty: number;
  unit: QuantityUnit;
}>;

const EPSILON = 1e-9;

export function quantity(qty: number, unit: QuantityUnit): Quantity {
  if (!Number.isFinite(qty) || qty < 0) throw new Error(`Invalid quantity: ${qty} ${unit}`);
  return { qty, unit };
}

export function assertCompatibleQuantity(a: Quantity, b: Quantity): void {
  if (a.unit !== b.unit) throw new Error(`Quantity unit mismatch: ${a.unit} vs ${b.unit}`);
}

export function addQuantity(a: Quantity, b: Quantity): Quantity {
  assertCompatibleQuantity(a, b);
  return quantity(a.qty + b.qty, a.unit);
}

export function subtractQuantity(a: Quantity, b: Quantity): Quantity {
  assertCompatibleQuantity(a, b);
  if (b.qty - a.qty > EPSILON) throw new Error(`Insufficient quantity: have ${a.qty} ${a.unit}, need ${b.qty} ${b.unit}`);
  return quantity(Math.max(0, a.qty - b.qty), a.unit);
}

export function shortfallQuantity(required: Quantity, onHand: Quantity): Quantity {
  assertCompatibleQuantity(required, onHand);
  return quantity(Math.max(0, required.qty - onHand.qty), required.unit);
}

export function scaleQuantity(value: Quantity, factor: number): Quantity {
  if (!Number.isFinite(factor) || factor < 0) throw new Error(`Invalid quantity scale: ${factor}`);
  return quantity(value.qty * factor, value.unit);
}

export function sameQuantity(a: Quantity, b: Quantity, epsilon = EPSILON): boolean {
  return a.unit === b.unit && Math.abs(a.qty - b.qty) <= epsilon;
}

export function formatQuantity(value: Quantity): string {
  const rounded = Number.isInteger(value.qty) ? String(value.qty) : String(Math.round(value.qty * 10) / 10);
  return `${rounded} ${value.unit}`;
}
