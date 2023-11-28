import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

test("renders header", () => {
  const { getByText } = render(<App />);
  const title = getByText(/Image Uploading App/i);
  expect(title).toBeInTheDocument();
});

test("renders body", async () => {
  const { container } = render(<App />);
  const body = container.querySelector(".App-body");
  expect(body).not.toBeNull();
  expect(body).toBeInTheDocument();
});