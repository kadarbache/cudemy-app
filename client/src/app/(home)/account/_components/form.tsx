"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserSession } from "@/util/interfaces";
import { useActionState, useEffect, useState } from "react";
import { SelectInput } from "../../courses/_components/heroSearchBar";
import { updateProfile } from "../action";

interface FormProps {
  name: string;
  email: string;
  displayName: string;
}

export default function Form({
  userSession,
}: {
  userSession: UserSession | null;
}) {
  const [user, setUser] = useState<FormProps>({
    name: "",
    email: "",
    displayName: "",
  });
  const [, formAction, pending] = useActionState(updateProfile, null);
  const { email, image, name, language } = userSession ?? {
    name: "",
    email: "",
    image: "",
    language: "English",
  };

  useEffect(() => {
    setUser((prev) => ({ ...prev, email, image, name }));
  }, [email, image, name]);
  const displayName = name.split(" ")[0];
  return (
    <form action={formAction} className="flex flex-col gap-4 w-[300px] md:w-xl">
      <Input
        type="text"
        placeholder="name"
        value={user.name}
        name="name"
        onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
      />
      <Input
        type="text"
        readOnly={true}
        disabled={true}
        placeholder="display name"
        value={displayName}
      />
      <Input
        type="email"
        readOnly={true}
        disabled
        value={user.email}
        placeholder="john.doe@example.com"
      />
      <SelectInput
        className="w-full max-w-full"
        selectItems={["English", "Somali"]}
        selectLabel="language"
        selectPlaceholder="Select a language"
        name="language"
        defaultValue={language}
      />
      <Button
        size="lg"
        variant="primary"
        className="w-full bg-[var(--primary-color)] text-white hover:bg-primary/80 focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer mt-2"
        type="submit"
        disabled={pending}
      >
        Save Changes
      </Button>
    </form>
  );
}
