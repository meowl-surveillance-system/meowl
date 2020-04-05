import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

describe("Login component", () => {
  it("renders Login component", () => {
    const historyMock: object = {
      push: jest.fn(),
    };
    const onAuthChangeMock: jest.Mock = jest.fn();
    const { container } = render(
      <Login
        isLoggedIn={false}
        history={historyMock}
        onAuthChange={onAuthChangeMock}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
