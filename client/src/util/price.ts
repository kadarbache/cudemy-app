// `discount` is an amount off `price`, so this is what the course actually
// costs. clamped because nothing should ever price out below free.
export function effectivePrice({
  price,
  discount,
}: {
  price: number;
  discount: number;
}) {
  return Math.max(price - discount, 0);
}
