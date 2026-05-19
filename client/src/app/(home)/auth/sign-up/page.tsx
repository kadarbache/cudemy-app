"use client";
import { signupAction } from "@/actions/authentication";
import MobileNavigation from "@/components/mobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Page() {
  const [state, formAction, pending] = useActionState(signupAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.status === "success") {
      if (Array.isArray(state.message)) {
        toast.success(`${state.message[0]}: ${state.message[1]}`);
        router.push("/");
      } else {
        toast.success(state.message);
        router.push("/");
      }
    } else if (state?.status === "error") {
      if (Array.isArray(state.message)) {
        toast.error(`${state.message[0]}: ${state.message[1]}`);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  return (
    <>
      <MobileNavigation />
      <div className="grid grid-cols-1 h-screen content-center items-center justify-center gap-4 py-16">
        <div className="px-4 py-6">
          <div className="text-popover-foreground/60 font-poppins text-[16px] not-italic font-normal leading-[20px]">
            Create your account to start learning and track your progress.
          </div>
        </div>
        {/* Sign Up Form */}
        <div className="grid gap-4 mt-3 px-4 w-full">
          <form action={formAction} className="grid gap-4">
            {/* Name */}
            <div className="grid gap-3">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="your full name"
                required
                className="bg-popover/90 shadow-none text-popover-foreground/70 py-6 placeholder:text-popover-foreground/30 border-b-2 border-primary focus:border-none"
              />
            </div>
            {/* Email */}
            <div className="grid gap-3">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email address"
                required
                className="bg-popover/90 shadow-none text-popover-foreground/70 py-6 placeholder:text-popover-foreground/30 border-b-2 border-primary focus:border-none"
              />
            </div>
            {/* Password */}
            <div className="grid gap-3">
              <Input
                className="py-6 bg-popover/90 shadow-none text-popover-foreground/70 placeholder:text-popover-foreground/30 border-b-2 border-primary focus:border-none"
                id="password"
                name="password"
                type="password"
                required
                placeholder="password"
              />
            </div>
            {/* Confirm Password */}
            <div className="grid gap-3">
              <Input
                className="py-6 bg-popover/90 shadow-none text-popover-foreground/70 placeholder:text-popover-foreground/30 border-b-1 border-primary focus:border-none"
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                required
                placeholder="confirm password"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full bg-[var(--primary-color)] text-white font-bold hover:bg-[var(--primary-color)]/90"
              disabled={pending}
            >
              Sign Up
            </Button>
          </form>
          <p className="text-popover-foreground text-center font-poppins text-[14px] font-normal leading-[18px]">
            or you can
          </p>
          {/* Login Providers */}
          <div className="flex flex-col items-center justify-center gap-4 font-bold font-poppins">
            <Button
              variant="facebook"
              size="md"
              className="w-full bg-[#4267b2] hover:bg-none text-white hover:text-white/70 transition-all rounded-xl flex items-center"
            >
              <span className="mr-2">
                <Image
                  src="/assets/Facebook-auth.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </span>
              Sign up with Facebook
            </Button>
            <Button
              size="md"
              className="w-full bg-popover-foreground/90 text-popover/90 hover:bg-popover-foreground/80 rounded-xl flex items-center shadow-none"
            >
              <span className="mr-2">
                <Image
                  src="/assets/Google.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                />
              </span>
              Sign up with Google
            </Button>
          </div>
          {/* need an Account?Sign Up */}
          <p className="text-popover-foreground text-center font-poppins text-[14px] font-normal leading-[18px]">
            already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[var(--primary-color)] hover:underline font-bold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
