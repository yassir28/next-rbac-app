"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SocialAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  async function handleSocialSignIn(provider: "google" | "github") {
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect ?? "/dashboard",
    });

    setLoading(false);

    if (error) {
      console.error(error.message || "Something went wrong");
    }
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={loading}
        onClick={() => handleSocialSignIn("google")}
      >
        <GoogleIcon width="0.98em" height="1em" />
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={loading}
        onClick={() => handleSocialSignIn("github")}
      >
        <GitHubIcon />
        Github
      </Button>
    </div>
  );
}
