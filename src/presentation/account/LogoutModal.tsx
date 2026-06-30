"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const handleLogout = async () => {
    // যদি onConfirm প্রপস হিসেবে পাঠানো হয়, তবে সেটি এক্সিকিউট হবে
    if (onConfirm) {
      onConfirm();
    } else {
      // সরাসরি সাইন আউট এবং রিডাইরেক্ট
      await signOut({
        callbackUrl: "/signin", // এখানে আপনার সাইন-ইন পেজের পাথ দিন
        redirect: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
        
        <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-rose-500 w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">{t("account.logoutModalTitle")}</h2>
        <p className="text-gray-400 text-sm mb-8">
          {t("account.logoutModalText")}
        </p>

        <div className="flex gap-4 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer flex-1 py-6 rounded border-gray-100 text-gray-500 font-medium hover:bg-gray-50"
          >
            {t("account.cancel")}
          </Button>
          <Button
            onClick={handleLogout}
            className="cursor-pointer flex-1 py-6 rounded bg-[#e11d48] hover:bg-[#be123c] text-white font-medium shadow-lg shadow-rose-100"
          >
            {t("account.logout")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
