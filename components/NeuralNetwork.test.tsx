import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { motionValue } from "framer-motion";
import NeuralNetwork from "./NeuralNetwork";

describe("NeuralNetwork", () => {
  it("renders a decorative canvas without crashing", () => {
    const { container } = render(
      <NeuralNetwork progress={motionValue(0)} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });
});
