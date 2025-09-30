"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      setSuccess("Password has been reset. You can now sign in.");
      setTimeout(() => router.push("/sign-in"), 3000);
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Left side - Orange Banner */}
        <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-b from-orange-500 to-orange-400 p-10 text-white md:flex">
          <h2 className="text-3xl leading-snug font-bold">Reset Password</h2>
          <p className="mt-4 text-sm opacity-90">
            Enter a new password for your account and regain access.
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

          <h2 className="text-2xl font-bold">Choose a new password</h2>
          <p className="mb-6 text-sm text-gray-500">
            Make sure your password is strong and secure.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="new-password"
                        placeholder="Enter new password"
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
                Reset password
              </LoadingButton>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link href="/sign-in" className="text-orange-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
