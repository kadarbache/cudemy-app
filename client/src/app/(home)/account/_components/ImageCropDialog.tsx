"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import React, { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { uploadProfileImage } from "../action";
import ErrorMessage from "./errorMessage";
import SelectImageBtn from "./selectImageBtn";
import setCanvasPreview from "./setCanvasPrev";
import toast from "react-hot-toast";

interface ImageCropDialogProps {
  open: boolean;
  setDialogOpen: (open: boolean) => void;
}
const ASPECT_RATIO = 1; // 1:1 for square crop
const MIN_DIMENSION = 150;

export function ImageCropDialog({ open, setDialogOpen }: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const onHandleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalHeight, naturalWidth } = e.currentTarget;
    const croppedWidth = (MIN_DIMENSION / 100) * width;

    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      setErrorMessage(
        `Image is too small. Minimum dimensions are ${MIN_DIMENSION}px by ${MIN_DIMENSION}px.`,
      );
    } else if (
      naturalHeight > naturalWidth * 4 ||
      naturalWidth > naturalHeight * 4
    ) {
      setErrorMessage("Image aspect ratio is too extreme.");
    }

    const crop = makeAspectCrop(
      { unit: "%", width: croppedWidth },
      ASPECT_RATIO,
      width,
      height,
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageUrl(reader.result as string),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!imageRef.current || !previewCanvasRef.current || !crop) return;

    setCanvasPreview(
      imageRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(
        crop,
        imageRef.current.width,
        imageRef.current.height,
      ),
    );

    // convert canvas -> blob
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );

    if (!blob) {
      console.error("Failed to create blob from canvas");
      return;
    }

    // send as multipart/form-data
    const fd = new FormData();
    fd.append("file", blob, "profile.png");

    const data = await uploadProfileImage(fd);

    setDialogOpen(false);
    if (data.status === "success") {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        handleClose();
        setImageUrl(undefined);
      }}
    >
      <DialogContent className="w-full h-dvh md:w-2xl md:h-fit p-0 flex flex-col md:p-6">
        {/* Header */}
        <DialogTitle>
          <div className="p-6 pb-4 border-b md:border-b-0 md:p-0">
            <h2 className="text-2xl font-semibold">Crop Image</h2>
          </div>
        </DialogTitle>

        {/* Image Preview Area - takes up remaining space */}
        <div className="flex-1 flex items-center justify-center h-[500px] bg-muted m-6 mt-4 rounded-lg verflow-hidden">
          {imageUrl ? (
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
              aspect={ASPECT_RATIO}
              keepSelection
              ruleOfThirds
              circularCrop
              minWidth={MIN_DIMENSION}
            >
              <Image
                src={imageUrl}
                ref={imageRef}
                onLoad={onHandleImageLoad}
                alt="To be cropped"
                width={300}
                height={50}
              />
            </ReactCrop>
          ) : (
            <p className="text-muted-foreground text-center px-4">
              No image selected
            </p>
          )}
        </div>

        <ErrorMessage errorMessage={errorMessage} />

        {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: "none",
              border: "1px solid white",
              objectFit: "contain",
              width: 150,
              height: 150,
            }}
          />
        )}

        {/* Bottom Buttons - fixed at bottom */}
        <div className="flex items-center justify-center gap-3 p-6 border-t md:border-t-0 md:pt-4">
          {imageUrl ? (
            <></>
          ) : (
            <SelectImageBtn handleSelectFile={onSelectFile} />
          )}

          <Button onClick={(e) => handleUpload(e)} className="px-8">
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
