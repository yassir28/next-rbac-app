"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { LoadingButton } from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      setSuccess(
        "If an account exists for this email, we've sent a password reset link.",
      );
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Left side - Orange Banner */}
        <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-b from-orange-500 to-orange-400 p-10 text-white md:flex">
          <h2 className="text-3xl leading-snug font-bold">Forgot Password?</h2>
          <p className="mt-4 text-sm opacity-90">
            Enter your registered email address and we’ll send you a link to
            reset your password.
          </p>
          <div className="mt-10 flex items-end justify-center">
            <img src="/illustration.png" alt="Illustration" className="w-3/4" />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full flex-col justify-center p-10 md:w-1/2">
          <div className="mb-6 flex items-center gap-2">
            <div className="rounded-full bg-orange-500 p-2 font-bold text-white">
              E+
            </div>
            <span className="text-lg font-semibold">E Spurt</span>
          </div>

          <h2 className="text-2xl font-bold">Reset your password</h2>
          <p className="mb-6 text-sm text-gray-500">
            We’ll send you instructions to reset your password
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {success && (
                <div role="status" className="text-sm text-green-600">
                  {success}
                </div>
              )}
              {error && (
                <div role="alert" className="text-sm text-red-600">
                  {error}
                </div>
              )}

              <LoadingButton
                type="submit"
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
                loading={loading}
              >
                Send reset link
              </LoadingButton>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-orange-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
