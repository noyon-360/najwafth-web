'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'

import { AchievementSection } from '@/presentation/home/AchievementSection'
import { HeroSection } from '@/presentation/home/HeroSection'
import { TestimonialsSection } from '@/presentation/home/TestimonialsSection'

import { WhyChooseUsSection } from './WhyChooseUsSection'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="bg-[#FAFAFA]">
      <HeroSection />

      <section className="relative overflow-hidden py-18 sm:py-22">
        <Image
          src="/images/leaf-icon.png"
          alt=""
          width={200}
          height={200}
          aria-hidden="true"
          className="pointer-events-none absolute right-[22%] top-24 h-auto w-[140px] opacity-40"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[420px] text-center">
            <h2 className="font-display text-4xl leading-[1.2] text-[#111111] sm:text-6xl">{t('nav.aboutUs')}</h2>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-[480px]">
              <h3 className="font-display text-4xl leading-[1.15] text-[#111111] sm:text-5xl">{t('about.whoWeAre')}</h3>
              <div className="mt-6 space-y-6 text-[20px] leading-[1.7] text-[#555f6d]">
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[18px]">
              <Image
                src="/images/book1.jpg"
                alt="Book collection"
                width={389}
                height={584}
                className="h-[420px] w-full object-cover object-[74%_58%]"
              />
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUsSection />
      <AchievementSection />
      <TestimonialsSection />
    </div>
  )
}
