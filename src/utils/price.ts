export function parsePrice(text: string): number {
  // Examples: "$12.34", "€ 99.00", "12.34"
  const cleaned = text.replace(/[^0-9.,-]/g, '').replace(',', '.');
  const value = Number(cleaned);
  if (Number.isNaN(value)) {
    throw new Error(`Could not parse price from: "${text}"`);
  }
  return value;
}
