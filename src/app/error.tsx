"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-container">
      <ErrorState
        title="Something went wrong"
        message="We couldn't load this page from the store. Please try again in a moment."
        digest={error.digest}
        onRetry={retry}
      />
    </main>
  );
}
