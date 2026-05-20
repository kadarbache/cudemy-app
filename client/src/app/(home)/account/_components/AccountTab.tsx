import React from "react";
import Form from "./form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ProfileEditor from "./EditProfileImage";
import { UserSession } from "@/util/interfaces";

type Props = {
  image: string | undefined;
  userSession: UserSession | null;
};

export default function AccountTab({ image, userSession }: Props) {
  return (
    <>
      {/* avatar upload --- React Image Crop */}
      <div className="flex flex-col items-center justify-center mx-auto mt-10 w-24 h-24">
        <div className="cursor-pointer relative w-24 h-24">
          <Avatar asChild className="w-24 h-24">
            <AvatarImage
              className="object-cover"
              src={
                !image || image === "default.png"
                  ? "/assets/default.png"
                  : image
              }
              alt="User Avatar"
            />
          </Avatar>
          <ProfileEditor />
        </div>
      </div>
      {/* form */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <Form userSession={userSession} />
      </div>
    </>
  );
}
