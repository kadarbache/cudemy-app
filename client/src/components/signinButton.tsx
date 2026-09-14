"use client";
import React, { useActionState, useEffect } from "react";
import {
  Dialog,
  //   DialogClose,
  DialogContent,
  DialogDescription,
  //   DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { signinAction } from "@/actions/authentication";
import { useAuthDialog } from "@/util/useAuthDialog";
import toast from "react-hot-toast";
export const SigninButton = () => {
  const [state, formAction, pending] = useActionState(signinAction, null);
  const { open, onOpenChange, returnTo } = useAuthDialog("login");

  useEffect(() => {
    if (state?.status === "success") {
      if (Array.isArray(state.message)) {
        toast.success(`${state.message[0]}: ${state.message[1]}`);
      } else {
        toast.success(state.message);
      }
    } else if (state?.status === "error") {
      if (Array.isArray(state.message)) {
        toast.error(`${state.message[0]}: ${state.message[1]}`);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="text-lg lg:text-xl py-3 px-8 rounded-[8px] text-center bg-[var(--primary-color)] text-white font-bold cursor-pointer hover:bg-[var(--primary-color)]/90 transition-all">
          Log in
        </button>
      </DialogTrigger>
      <DialogContent className="bg-popover grid grid-cols-2  min-w-[80vw] rounded-md text-popover-foreground overflow-hidden border-none p-0">
        <div className="col-start-1 relative">
          <Image
            src="/assets/sign-image.jpg"
            alt="Sign In"
            className="absolute"
            fill
          />
        </div>
        <div className="col-start-2 lex flex-col items-center justify-center gap-4 px-6 py-8">
          <DialogHeader>
            <DialogTitle>
              <Image
                src="/assets/logoNav.svg"
                alt="Logo"
                width={144}
                height={34}
              />
            </DialogTitle>
            <DialogDescription className="text-popover-foreground/60 font-poppins text-[16px] not-italic font-normal leading-[20px]">
              Join us and get more benefits. We promise to keep your data
              safely.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction}>
            {/* the action redirects here afterwards, which is what closes this
                dialog and takes ?auth= off the url */}
            <input type="hidden" name="returnTo" value={returnTo} />
            <div className="grid gap-4 mt-3">
              <div className="grid gap-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email address"
                  required
                  className="border-none bg-popover/90 shadow-none text-popover-foreground/70 py-6 rounded-lg placeholder:text-popover-foreground/30"
                />
              </div>
              <div className="grid gap-3">
                <Input
                  className="py-6 border-none bg-popover/90 shadow-none text-popover-foreground/70 rounded-lg placeholder:text-popover-foreground/30"
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="password"
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                size="md"
                className="w-full bg-[var(--primary-color)] text-white font-bold hover:bg-[var(--primary-color)]/90 cursor-pointer"
                disabled={pending}
              >
                LogIn
              </Button>
              <p className="text-popover-foreground text-center font-poppins text-[14px] font-normal leading-[18px]">
                or you can
              </p>
              {/* Login Providers */}
              <div className="flex flex-col items-center justify-center gap-4 font-bold font-poppins">
                <Button
                  variant="facebook"
                  size="md"
                  className="w-full bg-[#4267b2] hover:bg-none text-white hover:text-white/70 transition-all rounded-xl flex items-center cursor-pointer"
                >
                  <span className="mr-2">
                    <Image
                      src="/assets/Facebook-auth.svg"
                      alt="Facebook"
                      width={20}
                      height={20}
                    />
                  </span>
                  Sign in with Facebook
                </Button>
                <Button
                  size="md"
                  className="w-full bg-popover/90 text-popover-foreground/90 hover:bg-popover/80 rounded-xl flex items-center shadow-none cursor-pointer"
                >
                  <span className="mr-2">
                    <Image
                      src="/assets/Google.svg"
                      alt="GitHub"
                      width={20}
                      height={20}
                    />
                  </span>
                  Sign in with Google
                </Button>
              </div>
              {/* need an Account?Sign Up */}
              <p className="text-popover-foreground text-center font-poppins text-[14px] font-normal leading-[18px]">
                Need an account?{" "}
                <Link
                  href="#"
                  className="text-[var(--primary-color)] hover:underline font-bold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
