import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

function TestingVitestConf() {
  return <h1>Hello World!</h1>;
}

test("Testing vitest config", () => {
  render(<TestingVitestConf />);
  expect(screen.getByRole("heading", { level: 1, name: "Hello World!" }))
    .toBeDefined;
});
