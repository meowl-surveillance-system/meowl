import React, { FormEvent } from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./Register";

describe("Register component", () => {
  let registerWrapper: ShallowWrapper<{}, {}, Register>;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  beforeEach(() => {
    // Mock Fetch
    const mockSuccessResponse = "successfully registered";
    const mockTextPromise: Promise<string> = Promise.resolve(
      mockSuccessResponse,
    );
    const mockFetchPromise: Promise<object> = Promise.resolve({
      text: () => mockTextPromise,
    });
    jest
      .spyOn(window, "fetch")
      .mockImplementation(() => mockFetchPromise as Promise<Response>);

    preventDefaultMock = jest.fn();
    eventMock = {
      preventDefault: preventDefaultMock,
      target: {
        name: "email",
        value: "test@test.com",
      },
    };

    registerWrapper = shallow(<Register isLoggedIn={false} />);
  });

  it("renders Register component", () => {
    const { container } = render(
      <Router>
        <Register isLoggedIn={false} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call preventDefault on onSubmit", async () => {
    await registerWrapper.instance().onSubmit(eventMock);
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  it("should set email field when onChange is called", () => {
    registerWrapper.instance().onChange(eventMock);
    expect(registerWrapper.instance().state.email).toEqual(
      eventMock.target.value,
    );
  });
});
