import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PasswordReset from "./PasswordReset";

describe("PasswordReset component", () => {
  let passwordResetWrapper: ShallowWrapper<{}, {}, PasswordReset>;
  let matchMock: object;
  let historyMock: object;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  let mockSuccessResponse: string;
  let mockJsonPromise: Promise<string>;
  let mockFetchPromise: Promise<object>;
  beforeEach(() => {
    mockSuccessResponse = "Successfully updated password";
    mockJsonPromise = Promise.resolve(mockSuccessResponse);
    mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise });
    jest
      .spyOn(window, "fetch")
      .mockImplementation(() => mockFetchPromise as Promise<Response>);
    matchMock = {
      params: {
        token: "muda",
      },
    };
    historyMock = {
      push: jest.fn(),
    };
    preventDefaultMock = jest.fn();
    eventMock = {
      preventDefault: preventDefaultMock,
      target: {
        name: "password",
        value: "beeetch",
      },
    };
    passwordResetWrapper = shallow(
      <PasswordReset match={matchMock} history={historyMock} />,
    );
  });

  it("renders PasswordReset component", () => {
    const { container } = render(
      <Router>
        <PasswordReset match={matchMock} history={historyMock} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("should set successMessage on successful resolve", async () => {
    await passwordResetWrapper.instance().onSubmit(eventMock);
    expect(passwordResetWrapper.instance().state.successMessage).toEqual(
      mockSuccessResponse,
    );
  });
  it("should not set failMessage on promise reject", async () => {
    await passwordResetWrapper.instance().onSubmit(eventMock);
    expect(passwordResetWrapper.instance().state.failMessage).toEqual("");
  });
  it("should set password field when onChange is called", () => {
    passwordResetWrapper.instance().onChange(eventMock);
    expect(passwordResetWrapper.instance().state.password).toEqual(
      eventMock.target.value,
    );
  });
});
