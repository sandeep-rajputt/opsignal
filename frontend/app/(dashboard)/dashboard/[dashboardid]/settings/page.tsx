"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetWorkspaceBasicInfoQuery } from "@/Store/api/getWorkspaceBasicInfoApi/getWorkspaceBasicInfoApi";
import { useUploadSignatureMutation } from "@/Store/api/uploadSignatureApi/uploadSignatureApi";
import { useUpdateWorkspaceSettingsMutation } from "@/Store/api/updateWorkspaceSettingsApi/updateWorkspaceSettingsApi";
import { useLazyCheckSlugAvailabilityQuery } from "@/Store/api/checkSlugAvailabilityApi/checkSlugAvailabilityApi";
import workspaceSettingsSchema, {
  type WorkspaceSettings,
} from "@/schemas/workspaceSettingsSchema";
import isApiError from "@/utils/isApiError";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/rbac/permissions";
import TextAreaInput from "@/components/rhf_inputs/TextAreaInput";
import { useAppDispatch } from "@/Store/hooks";
import { updateWorkspaceSettings } from "@/Store/slice/currentWorkspaceSlice";

function SettingsPage() {
  const params = useParams();
  const dashboardId = params.dashboardid as string;
  const dispatch = useAppDispatch();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useGetWorkspaceBasicInfoQuery(dashboardId);
  const [uploadSignature] = useUploadSignatureMutation();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateWorkspaceSettingsMutation();
  const [checkSlug] = useLazyCheckSlugAvailabilityQuery();

  const { allowed: canEditWorkspace } = usePermission(
    Permission.EDIT_WORKSPACE,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<WorkspaceSettings>({
    resolver: zodResolver(workspaceSettingsSchema),
    defaultValues: {
      name: data?.data?.name || "",
      description: data?.data?.description || "",
      slug: data?.data?.id || "",
    },
  });

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const onSubmit = async (formData: WorkspaceSettings) => {
    try {
      let logoUrl: string | undefined;
      let logoPublicId: string | undefined;

      if (selectedFile) {
        const signatureResponse = await uploadSignature({
          folder: "workspace_logos",
        }).unwrap();

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
        cloudinaryFormData.append("folder", "workspace_logos");

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
        logoUrl = cloudinaryData.secure_url;
        logoPublicId = cloudinaryData.public_id;
      }

      if (formData.slug && formData.slug !== data?.data?.id) {
        const slugCheck = await checkSlug({
          workspaceId: dashboardId,
          slug: formData.slug,
        }).unwrap();

        if (!slugCheck.data.available) {
          toast.error("Slug is already taken");
          return;
        }
      }

      await updateSettings({
        workspaceId: dashboardId,
        data: {
          name: formData.name,
          description: formData.description || null,
          logoUrl,
          logoPublicId,
          slug: formData.slug !== data?.data?.id ? formData.slug : undefined,
        },
      }).unwrap();

      dispatch(
        updateWorkspaceSettings({
          name: formData.name,
          description: formData.description || null,
          image: logoUrl || undefined,
          id: formData.slug !== data?.data?.id ? formData.slug : undefined,
        }),
      );

      toast.success("Workspace settings updated successfully");
      setLogoPreview(null);
      setSelectedFile(null);
      reset({
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
      });
    } catch (error) {
      console.error(error);
      const apiError = isApiError(error);
      toast.error(apiError?.message || "Failed to update workspace settings");
    }
  };

  const handleCancel = () => {
    reset({
      name: data?.data?.name || "",
      description: data?.data?.description || "",
      slug: data?.data?.id || "",
    });
    setLogoPreview(null);
    setSelectedFile(null);
  };

  if (!canEditWorkspace) {
    return (
      <div>
        <header className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex gap-3 items-center lg:gap-5">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </header>
        <main className="px-4 py-4 lg:px-6">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access workspace settings.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <header className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex gap-3 items-center lg:gap-5">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </header>
        <main className="px-4 py-4 lg:px-6">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    const apiError = isApiError(error);
    return (
      <div>
        <header className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex gap-3 items-center lg:gap-5">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </header>
        <main className="px-4 py-4 lg:px-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {apiError?.message || "Failed to load workspace settings"}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  const hasChanges = isDirty || logoPreview !== null;
  const isPremium = data.data.plan === "premium";

  return (
    <div>
      <header className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex gap-3 items-center lg:gap-5">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </header>

      <main className="px-4 py-4 lg:px-6">
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={logoPreview || data.data.logo_url || undefined}
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
                  onClick={handleLogoClick}
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
                <p className="text-sm text-muted-foreground">Workspace Logo</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                placeholder="Enter workspace name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <TextAreaInput
              label="Description"
              placeholder="Enter workspace description"
              register={register("description")}
              error={errors.description?.message}
            />

            {isPremium && (
              <div className="space-y-2">
                <Label htmlFor="slug">Workspace Slug</Label>
                <Input
                  id="slug"
                  placeholder="Enter workspace slug"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Slug can only contain lowercase letters, numbers, and hyphens
                </p>
              </div>
            )}

            {!isPremium && (
              <div className="space-y-2">
                <Label htmlFor="slug-disabled">Workspace Slug</Label>
                <Input
                  id="slug-disabled"
                  value={data.data.id}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Upgrade to premium to customize your workspace slug
                </p>
              </div>
            )}

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
      </main>
    </div>
  );
}

export default SettingsPage;
