"use client";

import "./globals.css";
import ErrorState from "@/components/ErrorState";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <title>Something went wrong | Cedar</title>
        <main className="page-container">
          <ErrorState
            title="Something went wrong"
            message="The store is having trouble right now. Please try again in a moment."
            digest={error.digest}
            onRetry={retry}
          />
        </main>
      </body>
    </html>
  );
}
