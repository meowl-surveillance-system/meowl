import React, { FormEvent } from "react";
import { shallow } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./Register";

describe("Register component", () => {
  let registerWrapper: any;
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
      target: {
        name: "email",
        value: "test@test.com",
      },
    };

    historyMock = {
      push: jest.fn(),
    };

    onAuthChangeMock = jest.fn();

    registerWrapper = shallow(
      <Register
        isLoggedIn={false}
        onAuthChange={onAuthChangeMock}
        history={historyMock}
      />,
    );
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

  it("should call preventDefault on onSubmit", async () => {
    await registerWrapper.instance().onSubmit(eventMock);
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  it("should call onAuthChange on onSubmit", async () => {
    await registerWrapper.instance().onSubmit(eventMock);
    expect(onAuthChangeMock).toHaveBeenCalled();
  });

  it("should set email field when onChange is called", () => {
    registerWrapper.instance().onChange(eventMock);
    expect(registerWrapper.instance().state.email).toEqual(
      eventMock.target.value,
    );
  });
});
