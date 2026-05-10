"use client";
import { useState } from "react";
import { UserValidation } from "@/lib/validations/user";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: User;
  btnTitle: string;
}

export default function AccountProfile({ user, btnTitle }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState(user.image || ""); // ← جديد
  const [isUploading, setIsUploading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      profile_photo: user.image || "",
    },
  });
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    e.preventDefault();
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) return;

      setFiles([file]);

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        onChange(imageDataUrl);
        setCurrentImage(imageDataUrl); // ← تحديث الصورة فوراً
      };
      fileReader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    try {
      setIsUploading(true);

      let imageUrl = values.profile_photo;
      const hasImageChanged = isBase64Image(values.profile_photo);

      if (hasImageChanged && files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();
        imageUrl = data.url;

        setCurrentImage(imageUrl);
        form.setValue("profile_photo", imageUrl);
      }

      await updateUser({
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: imageUrl,
        userId: user.id!,
        path: pathname,
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <form
      id="form-rhf-demo"
      onSubmit={form.handleSubmit(onSubmit)}
      className="text-light-1 flex flex-col gap-10 justify-start"
    >
      <FieldGroup>
        <Controller
          name="profile_photo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center gap-4 flex-col"
            >
              <FieldLabel
                htmlFor="form-rhf-demo-profile-photo"
                className="account-form-image-label"
              >
                Profile Photo
              </FieldLabel>
              <div className="flex items-center gap-4">
                {currentImage ? ( // ← استخدم currentImage بدل field.value
                  <Image
                    src={currentImage}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={96}
                    height={96}
                    className="rounded-full object-contain"
                  />
                )}
                <div className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    accept="image/*"
                    type="file"
                    className="account-form_image-input"
                    onChange={(e) => handleImageChange(e, field.onChange)}
                    id="form-rhf-demo-profile-photo"
                    placeholder="Upload a photo"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center gap-4 w-full"
            >
              <FieldLabel
                htmlFor="form-rhf-demo-name"
                className="text-base-semibold text-light-2"
              >
                Name
              </FieldLabel>

              <Input
                className="account-form_input no-focus"
                id="form-rhf-demo-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ex: John Doe"
                autoComplete="off"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center gap-4 w-full"
            >
              <FieldLabel
                htmlFor="form-rhf-demo-username"
                className="text-base-semibold text-light-2"
              >
                Username
              </FieldLabel>

              <Input
                className="account-form_input no-focus"
                id="form-rhf-demo-username"
                aria-invalid={fieldState.invalid}
                placeholder="Ex: JohnDoe_123"
                autoComplete="off"
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center gap-4 w-full"
            >
              <FieldLabel
                htmlFor="form-rhf-demo-bio"
                className="text-base-semibold text-light-2"
              >
                Bio
              </FieldLabel>

              <Textarea
                rows={4}
                className="account-form_input no-focus"
                id="form-rhf-demo-bio"
                aria-invalid={fieldState.invalid}
                placeholder="Write a short bio about you"
                autoComplete="off"
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        className="bg-primary-500 hover:bg-primary-600"
        disabled={isUploading}
      >
        {btnTitle}
      </Button>
    </form>
  );
}
