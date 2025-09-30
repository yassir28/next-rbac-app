"use client";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SocialAuth } from "../social-auth";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: SignInValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      toast.success("Signed in successfully");
      router.push(redirect ?? "/dashboard");
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect ?? "/dashboard",
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Left side - Orange Banner */}
        <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-b from-orange-500 to-orange-400 p-10 text-white md:flex">
          <h2 className="text-3xl leading-snug font-bold">
            Simplify management with <br /> our dashboard.
          </h2>
          <p className="mt-4 text-sm opacity-90">
            Simplify your e-commerce management with our user-friendly admin
            dashboard.
          </p>
          <div className="mt-10 flex items-end justify-center">
            {/* Replace with your own 3D characters or illustration */}
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

          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="mb-6 text-sm text-gray-500">
            Please login to your account
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        autoComplete="current-password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-orange-500 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                Login
              </LoadingButton>

              <div className="my-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">Or Login with</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <SocialAuth />
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-orange-500 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
