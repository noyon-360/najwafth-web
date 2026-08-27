'use client'

import React, { useState, useRef } from "react";
import {
  Lock,
  History,
  Info,
  ShieldCheck,
  FileText,
  Globe,
  LogOut,
  ChevronRight,
  Pencil,
  SquarePen,
} from "lucide-react";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import LanguageSelection from "./LanguageSelection";
import LogoutModal from "./LogoutModal";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { resolveAvatarUrl } from "@/lib/avatar";

const ProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("Edit Profile");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const TOKEN = session?.user?.accessToken;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logout confirm handler
  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  // Fetching Profile Data
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["profileData", TOKEN],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch profile");
      }
      return res.json();
    },
    enabled: status === "authenticated" && !!TOKEN,
  });

  const userData = profileResponse?.data;
  const profileAvatarUrl = resolveAvatarUrl(
    previewImage || userData?.avatar || session?.user?.avatar,
    "https://i.pravatar.cc/150?u=default",
  );

  // গ্রুপ ১: যারা ডান পাশে কন্টেন্ট দেখাবে (Tab System)
  const tabItems = [
    { id: "Edit Profile", icon: <SquarePen size={22} />, label: t("account.editProfile") },
    {
      id: "Change Password",
      icon: <Lock size={22} />,
      label: t("account.changePassword"),
    },
    { id: "Language", icon: <Globe size={22} />, label: t("account.language") },
  ];

  // গ্রুপ ২: যারা অন্য পেজে রিডাইরেক্ট করবে (Redirect System)
  const redirectItems = [
    {
      id: "Order History",
      icon: <History size={22} />,
      label: t("account.orderHistory"),
      href: "/order",
    },
    {
      id: "About Us",
      icon: <Info size={22} />,
      label: t("nav.aboutUs"),
      href: "/about-us",
    },
    {
      id: "Privacy Policy",
      icon: <ShieldCheck size={22} />,
      label: t("account.privacyPolicy"),
      href: "/privacy-policy",
    },
    {
      id: "Terms & Conditions",
      icon: <FileText size={22} />,
      label: t("account.terms"),
      href: "/t&c",
    },
  ];

  if ((isLoading && !profileResponse) || (status === "loading" && !session))
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-slate-800">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-gray-800 font-bold">
            {t("account.title")}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">{t("account.subtitle")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 bg-white p-4 rounded border border-gray-100 shadow-[0px_0px_4px_0px_#00000040]">
          <aside className="lg:w-1/3 border border-[#E6E7E6] rounded overflow-hidden">
            <div className="relative">
              <div className="h-28 bg-[#76b9f0]"></div>
              <div className="flex flex-col items-center -mt-14 pb-8">
                <div className="relative group">
                  <Image
                    width={112}
                    height={112}
                    src={profileAvatarUrl}
                    alt="Profile"
                    unoptimized
                    className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg bg-slate-100"
                  />
                  <button
                    onClick={() => {
                      setActiveTab("Edit Profile");
                      setTimeout(() => fileInputRef.current?.click(), 100);
                    }}
                    className="absolute bottom-1 right-1 bg-[#6392b9] hover:bg-blue-600 transition-colors text-white p-2 rounded-full border-2 border-white shadow-lg"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
                <h2 className="mt-4 font-bold text-2xl text-[#76b9f0]">
                  {userData?.name || "User Name"}
                </h2>
                <p className="text-base text-gray-400 font-medium">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <nav className="px-4 pb-6 mt-4">
              <div className="space-y-1">
                {/* ১. ট্যাব আইটেমগুলো (Edit, Pass, Lang) */}
                {tabItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded transition-all ${
                      activeTab === item.id
                        ? 'text-blue-400 bg-blue-50/50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={
                          activeTab === item.id
                            ? 'text-blue-400'
                            : 'text-gray-400'
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="text-[18px] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className={
                        activeTab === item.id
                          ? 'text-blue-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}

                {/* --- সুন্দর ডিভাইডার --- */}
                <div className="my-4 px-5">
                  <div className="h-[1px] bg-slate-100 w-full"></div>
                </div>

                {/* ২. রিডাইরেক্ট আইটেমগুলো */}
                {redirectItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center justify-between px-5 py-4 rounded text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{item.icon}</span>
                      <span className="text-[18px] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                  </Link>
                ))}

                {/* ৩. পুশ নোটিফিকেশন এবং লগআউট */}
                <div className="my-4 px-5">
                  <div className="h-[1px] bg-slate-100 w-full"></div>
                </div>

                {/* <div className="flex items-center justify-between px-5 py-5 text-gray-600">
                  <div className="flex items-center gap-4">
                    <Bell size={22} className="text-gray-400" />
                    <span className="text-lg font-semibold">Notifications</span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${userData?.enableNotifications ? "bg-blue-400" : "bg-gray-300"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${userData?.enableNotifications ? "right-1" : "left-1"}`}
                    ></div>
                  </div>
                </div> */}

                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center justify-between px-5 py-4 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors group rounded"
                >
                  <div className="flex items-center gap-4">
                    <LogOut
                      size={22}
                      className="text-gray-400 group-hover:text-red-500"
                    />
                    <span className="text-lg font-semibold">{t("account.logout")}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-gray-300 group-hover:text-red-500"
                  />
                </button>
              </div>
            </nav>
          </aside>

          <main className="lg:w-2/3 border border-gray-100 rounded p-8 min-h-[650px] bg-[#F8F9FA]">
            {activeTab === "Edit Profile" && (
              <EditProfile 
                initialData={userData} 
                fileRef={fileInputRef} 
                onImageSelect={(fileUrl) => setPreviewImage(fileUrl)}
              />
            )}
            {activeTab === "Change Password" && <ChangePassword />}
            {activeTab === "Language" && <LanguageSelection />}
          </main>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  )
}

export default ProfileLayout
