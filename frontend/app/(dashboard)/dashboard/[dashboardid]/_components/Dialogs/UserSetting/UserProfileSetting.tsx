"use client";

import { useGetUserQuery } from "@/Store/api/getUserApi/getUserApi";
import { useUploadSignatureMutation } from "@/Store/api/uploadSignatureApi/uploadSignatureApi";
import { useUpdateProfileMutation } from "@/Store/api/updateProfileApi/updateProfileApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import nameSchema from "@/schemas/common/nameSchema";
import { toast } from "sonner";
import { useState, useRef } from "react";

const profileSchema = z.object({
  name: nameSchema,
});

type ProfileFormData = z.infer<typeof profileSchema>;

function UserProfileSetting() {
  const { data, isLoading } = useGetUserQuery(null);
  const [uploadSignature] = useUploadSignatureMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data?.data?.name || "",
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Store the file for later upload
    setSelectedFile(file);
  };

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      let avatarUrl: string | undefined;
      let avatarPublicId: string | undefined;

      // Upload image to Cloudinary if a new file is selected
      if (selectedFile) {
        // Step 1: Get signature from backend
        const signatureResponse = await uploadSignature({
          folder: "user_avatars",
        }).unwrap();

        // Step 2: Upload to Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", selectedFile);
        cloudinaryFormData.append(
          "signature",
          signatureResponse.data.signature,
        );
        cloudinaryFormData.append(
          "timestamp",
          signatureResponse.data.timestamp.toString(),
        );
        cloudinaryFormData.append("api_key", signatureResponse.data.apiKey);
        cloudinaryFormData.append("upload_preset", "user_avatars");
        cloudinaryFormData.append("folder", "user_avatars");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureResponse.data.cloudName}/image/upload`,
          {
            method: "POST",
            body: cloudinaryFormData,
          },
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        avatarUrl = cloudinaryData.secure_url;
        avatarPublicId = cloudinaryData.public_id;
      }

      // Step 3: Update profile in backend
      await updateProfile({
        name: formData.name,
        avatarUrl,
        avatarPublicId,
      }).unwrap();

      toast.success("Profile updated successfully");
      setAvatarPreview(null);
      setSelectedFile(null);
      reset({ name: formData.name });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(errorMessage || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    reset({ name: data?.data?.name || "" });
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 h-full">
        <div>
          <h3 className="text-lg font-medium mb-4">Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  const hasChanges = isDirty || avatarPreview !== null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarPreview || data.data.avatarUrl || undefined}
                />
                <AvatarFallback className="text-xl">
                  {data.data.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
                onClick={handleAvatarClick}
                disabled={isUpdating}
              >
                <Camera className="h-3 w-3" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <p className="font-medium">{data.data.name}</p>
              <p className="text-sm text-muted-foreground">{data.data.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={data.data.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={!hasChanges || isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!hasChanges || isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfileSetting;
