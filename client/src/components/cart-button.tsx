"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Cart from "../../public/assets/Cart.svg";
import { getCartAction } from "@/actions/cart";

// the count is invalidated under the ["cart"] key wherever the cart is written
export function CartButton() {
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartAction(),
  });
  const count = data?.length ?? 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? "course" : "courses"}`}
      className="relative inline-flex p-2 rounded-md hover:bg-popover-foreground/7 transition-colors cursor-pointer"
    >
      <Cart />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
