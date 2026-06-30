"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { User, Phone, MapPin, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { resolveAvatarUrl } from "@/lib/avatar";

const EditProfile = ({
  initialData,
  fileRef,
  onImageSelect,
}: {
  initialData?: Record<string, unknown>;
  fileRef?: React.RefObject<HTMLInputElement | null>;
  onImageSelect?: (url: string) => void;
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const TOKEN = session?.user?.accessToken;

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!TOKEN) throw new Error("Authentication token not found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/me`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: async (data) => {
      toast.success(t("account.profileUpdated"));
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      
      const newAvatar = resolveAvatarUrl(data?.data?.avatar, "");
      const newName = data?.data?.name;
      
      if (newAvatar || newName) {
        await update({ 
          ...(newAvatar && { avatar: newAvatar }),
          ...(newName && { name: newName }) 
        });
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setLoading(false);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    updateMutation.mutate(formData);
  };

  const inputStyles =
    "h-[50px] pl-10 focus-visible:ring-blue-400 border-[#C0C3C1] text-lg transition-all rounded";

  return (
    <div className="w-full">
      <div className="mb-8 pb-4 border-b border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 font-serif">
          {t("account.editProfileTitle")}
        </h2>
        <p className="text-slate-500 text-base mt-1">
          {t("account.editProfileSub")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="hidden">
          <input
            type="file"
            name="avatar"
            accept="image/*"
            ref={fileRef}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                toast.info(t("account.imageReady", { name: file.name }));
                if (onImageSelect) {
                  onImageSelect(URL.createObjectURL(file));
                }
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">
              {t("account.fullName")}
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                name="name"
                defaultValue={(initialData?.name as string) || ""}
                className={inputStyles}
                placeholder={t("account.fullName")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">
              {t("account.phoneNumber")}
            </Label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                name="phone"
                defaultValue={(initialData?.phone as string) || ""}
                className={inputStyles}
                placeholder={t("account.phoneNumber")}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">{t("account.bio")}</Label>
            <Input
              name="bio"
              defaultValue={(initialData?.bio as string) || ""}
              className="h-[50px] focus-visible:ring-blue-400 border-[#C0C3C1] text-lg transition-all rounded"
              placeholder={t("account.bioPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">{t("account.gender")}</Label>

            <Select defaultValue={(initialData?.gender as string) || ""}>
              <SelectTrigger className="!h-[50px] rounded w-full text-lg border border-[#C0C3C1] focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder={t("account.selectGender")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="male">{t("account.male")}</SelectItem>
                <SelectItem value="female">{t("account.female")}</SelectItem>
                <SelectItem value="other">{t("account.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">
              {t("account.dob")}
            </Label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                type="date"
                name="dob"
                defaultValue={
                  typeof initialData?.dob === "string"
                    ? initialData.dob.split("T")[0]
                    : ""
                }
                className={inputStyles}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">{t("account.age")}</Label>
            <Input
              type="number"
              name="age"
              defaultValue={(initialData?.age as number | string) || ""}
              className="h-[50px] focus-visible:ring-blue-400 border-[#C0C3C1] text-lg transition-all rounded w-full"
              placeholder={t("account.age")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-base font-medium text-[#1E1E1E] leading-[150%]">{t("account.address")}</Label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                name="address"
                defaultValue={(initialData?.address as string) || ""}
                className={inputStyles}
                placeholder={t("account.addressPlaceholder")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="h-[55px] px-5 bg-[#5F83A2] hover:bg-[#5e7e9a] text-white font-bold text-base rounded transition-all min-w-[200px] cursor-pointer"
          >
            {loading ? t("account.saving") : t("account.saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
