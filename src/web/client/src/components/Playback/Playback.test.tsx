import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Playback from "./Playback";

describe("Playback component", () => {
  test("renders Playback component", () => {
    const { container } = render(<Playback />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
