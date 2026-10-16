import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ErrorState from "../ErrorState";

describe("ErrorState", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the title and message as an alert", () => {
    render(<ErrorState title="Something went wrong" message="Please try again." onRetry={() => {}} />);

    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeDefined();
    expect(screen.getByText("Please try again.")).toBeDefined();
  });

  it("calls onRetry when Try again is clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Something went wrong" message="Please try again." onRetry={onRetry} />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("shows the error reference when a digest is given", () => {
    render(<ErrorState title="Something went wrong" message="Please try again." digest="abc123" onRetry={() => {}} />);

    expect(screen.getByText("Error reference: abc123")).toBeDefined();
  });

  it("hides the error reference without a digest", () => {
    render(<ErrorState title="Something went wrong" message="Please try again." onRetry={() => {}} />);

    expect(screen.queryByText(/Error reference/)).toBeNull();
  });
});
