"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// API Response এর জন্য টাইপ ডেফিনিশন
interface BookData {
  _id: string;
  shopId: {
    _id: string;
    name?: string;
    email: string;
  };
  title: string;
  author: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  description: string;
  coverImage: string;
  stock: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type CartResponse = {
  data?: {
    items?: {
      product?: {
        _id?: string;
      };
    }[];
  };
};

function ProductsDetails() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const id = params?.id; // URL থেকে ডাইনামিক ID নেওয়া হলো
  const TOKEN = session?.user?.accessToken;

  const [quantity, setQuantity] = useState<number>(1);
  const [isReadMore, setIsReadMore] = useState<boolean>(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // useQuery ব্যবহার করে ডাইনামিক বুক ডিটেইলস API ফেচিং লজিক
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books-details", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/books/${id}`,
      );
      if (!res.ok) throw new Error("Failed to fetch book details");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: cartResponse } = useQuery<CartResponse>({
    queryKey: ["cart", TOKEN],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }

      return res.json();
    },
    enabled: !!TOKEN,
  });

  // API রেসপন্স থেকে সিঙ্গেল বুক অবজেক্ট বের করা
  const product: BookData = apiResponse?.data;
  const isAlreadyInCart =
    cartResponse?.data?.items?.some(
      (item) => item.product?._id === product?._id,
    ) || false;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!TOKEN) {
        throw new Error("Please login to add this book to cart");
      }

      if (isAlreadyInCart) {
        throw new Error("This book is already added to cart");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            product: product._id,
            quantity,
          }),
        },
      );

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to add book to cart");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Book added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart", TOKEN] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  // লোডিং স্টেট হ্যান্ডেলার
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start py-0 md:py-10 px-0 sm:px-4 font-sans antialiased">
        <div className="w-full max-w-6xl bg-white flex flex-col md:rounded-3xl md:border md:border-gray-100 overflow-hidden min-h-screen md:min-h-0 mx-auto">
          <div className="flex items-center gap-4 py-5 px-4 md:px-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="h-8 w-8 animate-pulse rounded-full bg-[#e8eef4]" />
            <div className="h-6 w-48 animate-pulse rounded bg-[#e8eef4]" />
          </div>

          <div className="grid flex-1 gap-8 p-5 md:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] md:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-[420px] self-start overflow-hidden rounded-2xl border border-gray-100 bg-[#f4f1eb] md:sticky md:top-24">
              <div className="aspect-[3/4] w-full animate-pulse bg-[#e8eef4]" />
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="h-10 w-3/4 animate-pulse rounded bg-[#e8eef4]" />
                <div className="h-8 w-16 animate-pulse rounded-lg bg-[#e8eef4]" />
              </div>
              <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-[#e8eef4]" />
              <div className="mb-4 h-9 w-56 animate-pulse rounded-xl bg-[#e8eef4]" />
              <div className="mb-8 h-9 w-24 animate-pulse rounded-full bg-[#e8eef4]" />

              <div className="mb-8 space-y-3">
                <div className="h-5 w-32 animate-pulse rounded bg-[#e8eef4]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#e8eef4]" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-[#e8eef4]" />
                <div className="h-4 w-8/12 animate-pulse rounded bg-[#e8eef4]" />
              </div>

              <div className="mb-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-28 animate-pulse rounded bg-[#e8eef4]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[#e8eef4]" />
                </div>
                <div className="h-11 w-36 animate-pulse rounded-xl bg-[#e8eef4]" />
              </div>

              <div className="h-14 w-full animate-pulse rounded-xl bg-[#e8eef4]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // এরর বা ডাটা না পাওয়ার স্টেট হ্যান্ডেলার
  if (error || !product) {
    return (
      <div className="text-center py-20 text-red-500 font-sans text-xl">
        Failed to load product details or Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-0 md:py-10 px-0 sm:px-4 font-sans antialiased text-gray-900 select-none">
      <div className="w-full max-w-6xl bg-white flex flex-col md:rounded-3xl md:shadow-md md:border md:border-gray-100 overflow-hidden min-h-screen md:min-h-0 mx-auto">
        {/* হেডার সেকশন */}
        <div className="flex items-center gap-4 py-5 px-4 md:px-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <button
            onClick={() => router.back()}
            className="text-gray-800 hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-gray-50"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 truncate">
            {product.title}
          </h1>
        </div>

        {/* মেইন কন্টেন্ট বডি */}
        <div className="grid flex-1 gap-8 p-5 md:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] md:p-8 lg:p-10">
          {/* প্রোডাক্ট ইমেজ কার্ড */}
          <div className="mx-auto w-full max-w-[420px] self-start overflow-hidden rounded-2xl border border-gray-100 bg-[#f4f1eb] md:sticky md:top-24">
            <div className="aspect-[3/4] w-full">
            <img
              src={product.coverImage || "/images/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
          {/* টাইটেল এবং রেটিং সেকশন */}
          <div className="flex justify-between items-start gap-3 mb-1">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight md:text-4xl">
              {product.title}
            </h2>
            <div className="flex items-center gap-1 mt-1 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              <Star size={16} fill="#facc15" color="#facc15" />
              <span className="text-sm font-bold text-amber-700">4.8</span>
            </div>
          </div>

          {/* লেখক বা পাবলিশার */}
          <p className="text-xs text-gray-400 mb-3 font-semibold tracking-wide uppercase">
            by {product.author}
          </p>

          {/* লোকেশন / শপ ইনফো */}
          <div className="flex items-center gap-1.5 text-gray-500 mb-4 bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100/50 self-start">
            <MapPin size={15} className="text-[#5b93c5]" />
            <span className="text-xs font-semibold tracking-wide">
              {product.shopId?.name || "123 Library, Book City"}
            </span>
          </div>

          {/* ক্যাটাগরি ট্যাগ */}
          <div className="mb-6">
            <span className="inline-block bg-[#e0ecf8] text-[#5b93c5] text-xs font-bold px-4 py-2 rounded-full tracking-wide shadow-sm">
              {product.category?.name || "Classic"}
            </span>
          </div>

          {/* ডেসক্রিপশন সেকশন */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-2 tracking-tight">
              Description
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-normal md:text-base">
              {isReadMore
                ? product.description
                : `${product.description.slice(0, 150)}${product.description.length > 150 ? "..." : ""}`}
              {product.description.length > 150 && (
                <button
                  onClick={() => setIsReadMore(!isReadMore)}
                  className="text-[#5b93c5] font-semibold ml-1 focus:outline-none hover:underline inline-block"
                >
                  {isReadMore ? " Read less" : "Read more"}
                </button>
              )}
            </p>
          </div>

          {/* প্রাইস এবং কোয়ান্টিটি কাউন্টার সেকশন */}
          <div className="flex flex-col gap-4 mb-6 pt-5 border-t border-gray-100 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#5b93c5] tracking-tight">
                ৳{product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through font-medium mt-0.5">
                ৳{(product.price + 50).toFixed(2)}
              </span>
            </div>

            {/* কাউন্টার কন্টেইনার */}
            <div className="flex items-center bg-[#eef4fa] rounded-xl p-1.5 border border-transparent">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex justify-center items-center bg-white rounded-lg shadow-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-10 text-center font-bold text-base text-gray-800">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex justify-center items-center bg-white rounded-lg shadow-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* অ্যাড টু কার্ট বাটন */}
          <button
            disabled={
              !product.stock || addToCartMutation.isPending || isAlreadyInCart
            }
            onClick={() => addToCartMutation.mutate()}
            className={`w-full text-white py-4 rounded-xl font-bold text-base flex justify-center items-center gap-2.5 shadow-md active:scale-[0.98] transition-all tracking-wide ${
              product.stock && !isAlreadyInCart
                ? "bg-[#5b93c5] hover:bg-[#4a82b4] hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span>
              {product.stock
                ? isAlreadyInCart
                  ? "Already Added"
                  : addToCartMutation.isPending
                    ? "Adding..."
                    : "Add to Cart"
                : "Out of Stock"}
            </span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsDetails;
