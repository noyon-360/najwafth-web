'use client'

import { ArrowRight, CheckCircle2, Loader2, Store, X } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SellerForm = {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const initialForm: SellerForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export function BecomeSellerSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [form, setForm] = useState<SellerForm>(initialForm)

  const closeModal = () => {
    if (isSubmitting) return
    setIsOpen(false)
    setIsComplete(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, role: 'seller' }),
        },
      )
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.message || 'Could not create your seller account.')
      }

      setForm(initialForm)
      setIsComplete(true)
      toast.success(payload?.message || 'Your seller account has been created.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-18 lg:px-10">
      <div className="container mx-auto overflow-hidden rounded-[28px] bg-[#163A5A] shadow-[0_24px_70px_rgba(22,58,90,0.2)]">
        <div className="relative isolate grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-16 lg:py-14">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#6EA8D7]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-[#F4C76B]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              <Store className="size-4" />
              Grow with Books on Wheels
            </div>
            <h2 className="max-w-2xl font-display text-4xl leading-[1.12] text-white sm:text-5xl">
              Turn your bookshop into a local favourite.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#D9E9F7] sm:text-lg">
              Join our community of independent sellers, share your collection,
              and reach more readers in your area.
            </p>

            <div className="mt-7 grid gap-3 text-sm text-white/90 sm:grid-cols-3">
              {['Create your seller account', 'Set up your shop', 'Start listing books'].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F4C76B] text-xs font-bold text-[#163A5A]">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm sm:p-7">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F4C76B] text-[#163A5A]">
              <Store className="size-6" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">Become a seller</h3>
            <p className="mt-2 text-sm leading-6 text-[#D9E9F7]">
              It only takes a moment to create your seller account.
            </p>
            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              className="mt-6 h-12 w-full cursor-pointer rounded-xl bg-[#F4C76B] px-5 text-base font-semibold text-[#163A5A] hover:bg-[#FFE09A]"
            >
              Become a seller <ArrowRight className="ml-1 size-5" />
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C2338]/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seller-modal-title"
          onMouseDown={closeModal}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onMouseDown={event => event.stopPropagation()}
          >
            <div className="relative max-h-[92vh] overflow-y-auto p-6 sm:p-8">
              <button
                type="button"
                aria-label="Close seller sign-up form"
                onClick={closeModal}
                className="absolute right-5 top-5 cursor-pointer rounded-full p-2 text-[#607080] transition hover:bg-[#EEF5FA] hover:text-[#163A5A]"
              >
                <X className="size-5" />
              </button>

            {isComplete ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-14 text-[#4E9A76]" />
                <h3 id="seller-modal-title" className="mt-5 text-2xl font-semibold text-[#163A5A]">
                  Seller account created
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5C6B78]">
                  You can now sign in and complete your shop profile.
                </p>
                <Button asChild className="mt-6 h-11 cursor-pointer rounded-xl bg-[#5F83A2] px-6 hover:bg-[#4F7494]">
                  <Link href="/signin">Go to sign in</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="pr-9">
                  <p className="text-sm font-medium text-[#5F83A2]">Seller registration</p>
                  <h3 id="seller-modal-title" className="mt-1 text-2xl font-semibold text-[#163A5A]">
                    Start selling your books
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5C6B78]">
                    Fill in the details below to create a seller account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="seller-name">Full name</Label>
                    <Input
                      id="seller-name"
                      value={form.name}
                      onChange={event => setForm({ ...form, name: event.target.value })}
                      placeholder="Your full name"
                      required
                      className="mt-1 h-11 rounded-xl border-[#D6E2EC] px-3"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="seller-email">Email address</Label>
                      <Input
                        id="seller-email"
                        type="email"
                        value={form.email}
                        onChange={event => setForm({ ...form, email: event.target.value })}
                        placeholder="you@example.com"
                        required
                        className="mt-1 h-11 rounded-xl border-[#D6E2EC] px-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seller-phone">Phone number</Label>
                      <Input
                        id="seller-phone"
                        type="tel"
                        value={form.phone}
                        onChange={event => setForm({ ...form, phone: event.target.value })}
                        placeholder="Your phone number"
                        required
                        className="mt-1 h-11 rounded-xl border-[#D6E2EC] px-3"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="seller-password">Password</Label>
                      <Input
                        id="seller-password"
                        type="password"
                        value={form.password}
                        onChange={event => setForm({ ...form, password: event.target.value })}
                        required
                        minLength={6}
                        className="mt-1 h-11 rounded-xl border-[#D6E2EC] px-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seller-confirm-password">Confirm password</Label>
                      <Input
                        id="seller-confirm-password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={event => setForm({ ...form, confirmPassword: event.target.value })}
                        required
                        minLength={6}
                        className="mt-1 h-11 rounded-xl border-[#D6E2EC] px-3"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 h-12 w-full cursor-pointer rounded-xl bg-[#5F83A2] text-base font-semibold hover:bg-[#4F7494]"
                  >
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : 'Create seller account'}
                  </Button>
                </form>

                <p className="mt-5 text-center text-sm text-[#607080]">
                  Already have an account?{' '}
                  <Link href="/signin" className="font-semibold text-[#4F83B5] hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
