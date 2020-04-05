import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute component", () => {
  test("renders ProtectedRoute component", () => {
    const { container } = render(
      <Router>
        <ProtectedRoute isLoggedIn={false} redirectPath={"/"} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
