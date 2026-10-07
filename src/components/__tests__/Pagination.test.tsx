import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Pagination from "../Pagination";

const pageInfo = {
  hasPreviousPage: true,
  hasNextPage: true,
  startCursor: "start",
  endCursor: "end",
};

describe("Pagination", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination
        basePath="/collections/kids"
        pageInfo={{ ...pageInfo, hasPreviousPage: false, hasNextPage: false }}
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("keeps the filter in the previous and next links", () => {
    render(
      <Pagination
        basePath="/collections/kids"
        pageInfo={pageInfo}
        query={{ available: "true" }}
      />,
    );

    expect(screen.getByRole("link", { name: /previous/i }).getAttribute("href"))
      .toBe("/collections/kids?available=true&before=start");
    expect(screen.getByRole("link", { name: /next/i }).getAttribute("href"))
      .toBe("/collections/kids?available=true&after=end");
  });
});