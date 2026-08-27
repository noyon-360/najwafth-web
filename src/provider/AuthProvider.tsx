"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import I18nProvider from "@/provider/I18nProvider";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SessionProvider>{children}</SessionProvider>
      </I18nProvider>
      <Toaster position="bottom-left" richColors />
    </QueryClientProvider>
  );
};

export default AuthProvider;
