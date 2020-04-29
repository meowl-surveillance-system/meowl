import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AccountRecovery from "./AccountRecovery";

describe("AccountRecovery component", () => {
  let AccountRecoveryWrapper: ShallowWrapper<{}, {}, AccountRecovery>;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  let mockSuccessResponse: string;
  let mockJsonPromise: Promise<string>;
  let mockFetchPromise: Promise<object>;
  beforeEach(() => {
    mockSuccessResponse = "Successfully sent password reset email";
    mockJsonPromise = Promise.resolve(mockSuccessResponse);
    mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise });
    jest
      .spyOn(window, "fetch")
      .mockImplementation(() => mockFetchPromise as Promise<Response>);
    preventDefaultMock = jest.fn();
    eventMock = {
      preventDefault: preventDefaultMock,
      target: {
        name: "username",
        value: "beeetch",
      },
    };
    AccountRecoveryWrapper = shallow(<AccountRecovery />);
  });
  test("renders AccountRecovery component", () => {
    const { container } = render(
      <Router>
        <AccountRecovery />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("should set successMessage on successful resolve", async () => {
    await AccountRecoveryWrapper.instance().onSubmit(eventMock);
    expect(AccountRecoveryWrapper.instance().state.successMessage).toEqual(
      mockSuccessResponse,
    );
  });
  it("should not set failMessage on promise reject", async () => {
    await AccountRecoveryWrapper.instance().onSubmit(eventMock);
    expect(AccountRecoveryWrapper.instance().state.failMessage).toEqual("");
  });
  it("should set password field when onChange is called", () => {
    AccountRecoveryWrapper.instance().onChange(eventMock);
    expect(AccountRecoveryWrapper.instance().state.username).toEqual(
      eventMock.target.value,
    );
  });
});
