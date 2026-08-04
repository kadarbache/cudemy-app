"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICartItem } from "@/util/interfaces";
import { effectivePrice } from "@/util/price";

export function CartSummary({ items }: { items: ICartItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + item.course.price, 0);
  const total = items.reduce(
    (sum, item) => sum + effectivePrice(item.course),
    0,
  );
  // derived rather than summed on its own, so the lines always reconcile even
  // where a discount is larger than the price it comes off
  const savings = subtotal - total;
  const percentOff = subtotal > 0 ? Math.round((savings / subtotal) * 100) : 0;

  // UI only. there is no coupon endpoint yet, so applying always lands here
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");

  return (
    <aside className="h-fit rounded-lg border-1 border-popover-foreground/10 bg-card p-6 lg:sticky lg:top-24">
      <p className="text-sm text-popover-foreground/60">Total:</p>
      <p className="font-outfit text-4xl font-bold tabular-nums text-popover-foreground">
        ${total.toFixed(2)}
      </p>
      {savings > 0 && (
        <>
          <p className="mt-1 text-lg text-primary line-through tabular-nums">
            ${subtotal.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-popover-foreground/60">
            Discount: {percentOff}%
          </p>
        </>
      )}

      <div className="mt-6 border-t border-popover-foreground/10 pt-6">
        {couponError && (
          <p className="mb-2 text-sm text-destructive">{couponError}</p>
        )}
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Coupon code"
            aria-label="Coupon code"
            className="p-3 text-sm"
          />
          <Button
            onClick={() => setCouponError("Coupon codes are not available yet")}
            disabled={code.trim() === ""}
            // h-auto drops the size variant's h-9 so the flex row's default
            // stretch matches this to whatever height the input ends up
            className="h-auto flex-none px-6"
          >
            Apply
          </Button>
        </div>

        <Button
          onClick={() => toast("Checkout is coming soon")}
          className="mt-4 w-full py-6 text-base font-bold"
        >
          Proceed to checkout
        </Button>
      </div>
    </aside>
  );
}
