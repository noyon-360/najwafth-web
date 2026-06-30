 'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

const AUTO_SLIDE_INTERVAL_MS = 8000
const MANUAL_NAV_PAUSE_MS = 12000

export function HeroSection() {
  const { t } = useTranslation()
  const slides = [
    {
      image: '/images/banner-home-1-clean.png',
      title: t('about.hero.s1.title'),
      description: t('about.hero.s1.desc').replace(' worldwide', ''),
    },
    {
      image: '/images/banner-2-updated.png',
      title: t('about.hero.s2.title'),
      description: t('about.hero.s2.desc'),
    },
    {
      image: '/images/banner-3.png',
      title: t('about.hero.s3.title'),
      description: t('about.hero.s3.desc'),
    },
    {
      image: '/images/banner-4-v2.png',
      title: t('about.hero.s4.title'),
      description: t('about.hero.s4.desc'),
    },
  ]
  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoPaused, setIsAutoPaused] = useState(false)

  useEffect(() => {
    if (isAutoPaused) {
      const pauseTimer = window.setTimeout(() => {
        setIsAutoPaused(false)
      }, MANUAL_NAV_PAUSE_MS)

      return () => window.clearTimeout(pauseTimer)
    }

    const timer = window.setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length)
    }, AUTO_SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isAutoPaused, slides.length])

  const handleSlideNavigation = (index: number) => {
    setActiveSlide(index)
    setIsAutoPaused(true)
  }

  return (
    <section className="relative overflow-hidden border-b border-black/6">
      <div className="hero-haze pointer-events-none absolute inset-0" />
      <Image
        src="/images/hero-bg.png"
        alt=""
        width={1470}
        height={687}
        className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover opacity-40"
      />

        <div className="relative mx-auto grid w-full container gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-8 inline-flex w-fit rounded-full border border-[#459AE4]/20 bg-white/80 px-4 py-2 text-sm text-[#5F83A2] shadow-sm">
            {t('home.curatedBooks')}
          </div>

          <div
            key={`hero-copy-${activeSlide}`}
            className="animate-in fade-in duration-500"
          >
            <h1 className="w-full text-balance font-['Prata'] text-[34px] leading-[120%] font-normal tracking-[0%] text-[#111111] sm:text-[40px] lg:h-[116px] lg:w-[651px] lg:text-[48px]">
              {slides[activeSlide].title}
            </h1>

            <p className="mt-4 w-full font-['Poppins'] text-[18px] leading-[145%] font-light tracking-[0%] text-[#232323] sm:text-[20px] lg:mt-6 lg:h-[72px] lg:w-[651px] lg:text-[24px] lg:leading-[130%]">
              {slides[activeSlide].description}
            </p>
          </div>

          <div className="mt-10">
            <Link href="/featured-bookstores">
              <Button className="h-12 min-w-[220px] cursor-pointer rounded-xl bg-[linear-gradient(90deg,#5F83A2_0%,#5E92C0_100%)] px-6 text-base font-semibold shadow-[0_20px_45px_rgba(94,146,192,0.24)] hover:opacity-95 sm:h-14 sm:min-w-[284px] sm:rounded-2xl sm:text-xl">
                {t('footer.browseBooks')}
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            {slides.map((_, index) => {
              const isActive = index === activeSlide

              return isActive ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlideNavigation(index)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#459AE4] bg-white"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-[#459AE4]" />
                </button>
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlideNavigation(index)}
                  className="h-3.5 w-3.5 cursor-pointer rounded-full border border-[#459AE4]/50 bg-[#459AE4]/35"
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            })}
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute inset-4 rounded-[36px] bg-white/50 blur-3xl" />
            <div className="relative z-10 h-[260px] w-full overflow-hidden rounded-[18px] bg-white/45 sm:h-[330px] sm:rounded-[22px] lg:h-[420px] lg:rounded-[26px]">
                {slides.map((slide, index) => (
                <Image
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  fill
                  unoptimized
                  priority={index === 0}
                  className={`${slide.image === '/images/banner-4-v2.png' ? 'object-contain object-center' : 'object-cover'} transition-opacity duration-700 ease-in-out ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
