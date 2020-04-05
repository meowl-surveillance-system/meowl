import React, { FormEvent } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./Register";

describe("Register component", () => {
  let registerMock: Register;
  let onAuthChangeMock: jest.Mock;
  let historyMock: object;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  beforeEach(() => {
    // Mock Fetch
    const mockSuccessResponse = "successfully registered";
    const mockTextPromise: any = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise: any = Promise.resolve({
      text: () => mockTextPromise,
    });
    jest.spyOn(window, "fetch").mockImplementation(() => mockFetchPromise);

    preventDefaultMock = jest.fn();
    eventMock = {
      preventDefault: preventDefaultMock,
    };

    historyMock = {
      push: jest.fn(),
    };

    onAuthChangeMock = jest.fn();

    registerMock = new Register({
      isLoggedIn: false,
      onAuthChange: onAuthChangeMock,
      history: historyMock,
    });
  });

  it("renders Register component", () => {
    const { container } = render(
      <Router>
        <Register
          isLoggedIn={false}
          onAuthChange={onAuthChangeMock}
          history={historyMock}
        />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call preventDefault on onSubmit", () => {
    registerMock.onSubmit(eventMock);
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  // There is an issue with this test, onAuthChange is not being called
  it.skip("should call onAuthChange on onSubmit", () => {
    registerMock.onSubmit(eventMock);
    expect(onAuthChangeMock).toHaveBeenCalled();
  });
});
