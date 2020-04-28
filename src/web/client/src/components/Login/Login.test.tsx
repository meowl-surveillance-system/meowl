import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login component", () => {
  let loginWrapper: ShallowWrapper<{}, {}, Login>;
  let onAuthChangeMock: jest.Mock;
  let historyMock: object;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  beforeEach(() => {
    // Mock Fetch
    const mockSuccessResponse = "successfully logged in";
    const mockTextPromise: Promise<string> = Promise.resolve(
      mockSuccessResponse,
    );
    const mockFetchPromise: Promise<object> = Promise.resolve({
      text: () => mockTextPromise,
    });
    const mockSuccessResponseAdmin = "successfully logged in";
    const mockTextPromiseAdmin: Promise<string> = Promise.resolve(
      mockSuccessResponseAdmin,
    );
    const mockFetchPromiseAdmin: Promise<object> = Promise.resolve({
      json: () => mockTextPromiseAdmin,
    });
    jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() => mockFetchPromise as Promise<Response>);
    jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() => mockFetchPromiseAdmin as Promise<Response>);

    preventDefaultMock = jest.fn();
    eventMock = {
      preventDefault: preventDefaultMock,
      target: {
        name: "username",
        value: "goat",
      },
    };

    historyMock = {
      push: jest.fn(),
    };

    onAuthChangeMock = jest.fn();

    loginWrapper = shallow(
      <Login
        isLoggedIn={false}
        onAuthChange={onAuthChangeMock}
        history={historyMock}
      />,
    );
  });
  it("renders Login component", () => {
    const { container } = render(
      <Login
        isLoggedIn={false}
        history={historyMock}
        onAuthChange={onAuthChangeMock}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call preventDefault on loginSubmit", async () => {
    await loginWrapper.instance().loginSubmit(eventMock);
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  it("should call onAuthChange on loginSubmit", async () => {
    await loginWrapper.instance().loginSubmit(eventMock);
    expect(onAuthChangeMock).toHaveBeenCalled();
  });

  it("should set username filed when handleChange is called", () => {
    loginWrapper.instance().handleChange(eventMock);
    expect(loginWrapper.instance().state.username).toEqual(
      eventMock.target.value,
    );
  });
});
