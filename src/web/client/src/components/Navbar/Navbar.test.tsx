import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar component", () => {
  it("should render the Navbar component", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const { container } = render(
      <Router>
        <Navbar isLoggedIn={false} onAuthChange={onAuthChangeMock} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onAuthChange on logoutSubmit", async () => {
    const onAuthChangeMock = jest.fn();
    const navbarMock = new Navbar({
      onAuthChange: onAuthChangeMock,
      isLoggedIn: false,
    });
    await navbarMock.logoutSubmit();
    expect(onAuthChangeMock).toHaveBeenCalled();
  });
});
