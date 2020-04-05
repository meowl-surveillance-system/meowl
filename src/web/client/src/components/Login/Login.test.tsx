import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

describe("Login component", () => {
  it("renders Login component", () => {
  	const { container } = render(<Login />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
