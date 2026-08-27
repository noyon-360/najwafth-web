"use client";

import { AchievementSection } from "@/presentation/home/AchievementSection";
import { BecomeSellerSection } from "@/presentation/home/BecomeSellerSection";
import { ExploreCategoriesSection } from "@/presentation/home/ExploreCategoriesSection";
import { FeaturedProducts } from "@/presentation/home/FeaturedProducts";
import { HeroSection } from "@/presentation/home/HeroSection";
import { PopularBooksSection } from "@/presentation/home/PopularBooksSection";
import { TestimonialsSection } from "@/presentation/home/TestimonialsSection";
import {
  useFeaturedBooksQuery,
  usePopularBooksQuery,
  useTopCategoriesQuery,
} from "@/presentation/home/useHomeQueries";

export default function WebsiteHomePage() {
  const featuredBooksQuery = useFeaturedBooksQuery();
  const popularBooksQuery = usePopularBooksQuery();
  const categoriesQuery = useTopCategoriesQuery();

  return (
    <div className="bg-[#FAFAFA]">
      <HeroSection />
      <FeaturedProducts
        products={featuredBooksQuery.data?.items || []}
        isLoading={featuredBooksQuery.isLoading}
        error={featuredBooksQuery.error?.message}
      />
      <PopularBooksSection
        products={popularBooksQuery.data?.items || []}
        isLoading={popularBooksQuery.isLoading}
        error={popularBooksQuery.error?.message}
      />
      <ExploreCategoriesSection
        categories={categoriesQuery.data?.items || []}
        isLoading={categoriesQuery.isLoading}
        error={categoriesQuery.error?.message}
      />
      <BecomeSellerSection />
      <AchievementSection />
      <TestimonialsSection />
    </div>
  );
}
