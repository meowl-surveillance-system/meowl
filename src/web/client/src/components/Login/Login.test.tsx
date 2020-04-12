import React from "react";
import { shallow } from "enzyme";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login component", () => {
  let loginWrapper: any;
  let onAuthChangeMock: jest.Mock;
  let historyMock: object;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  beforeEach(() => {
    // Mock Fetch
    const mockSuccessResponse = "successfully logged in";
    const mockTextPromise: Promise<any> = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise: Promise<any> = Promise.resolve({
      text: () => mockTextPromise,
    });
    jest.spyOn(window, "fetch").mockImplementation(() => mockFetchPromise);

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
