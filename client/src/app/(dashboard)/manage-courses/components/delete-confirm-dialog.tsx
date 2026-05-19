"use client";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  action: (
    prev: unknown,
    formData: FormData,
  ) => Promise<
    | {
        status: string;
        message?: string | string[];
      }
    | Record<string, string>
  >;
  targetId: string;
  inputIdName: string;
}

const initialState = {
  status: "",
  message: "",
};

export default function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  action: deleteAction,
  targetId,
  inputIdName,
}: DeleteConfirmDialogProps) {
  const [state, formAction, isPending] = useActionState(
    deleteAction,
    initialState,
  );

  useEffect(() => {
    const status = state && "status" in state ? state.status : undefined;
    const message = state && "message" in state ? state.message : undefined;

    if (status === "success") {
      const displayMsg =
        typeof message === "string"
          ? message
          : Array.isArray(message)
            ? message[0]
            : "Success";
      toast.success(displayMsg);
      onOpenChange(false);
    } else if (status === "error") {
      const displayMsg =
        typeof message === "string"
          ? message
          : Array.isArray(message)
            ? message[0]
            : "Error";
      toast.error(displayMsg);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-4 flex justify-end gap-2">
          <input type="hidden" name={inputIdName} value={targetId} />

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
