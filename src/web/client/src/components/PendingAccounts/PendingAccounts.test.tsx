import React from "react";
import { shallow } from "enzyme";
import { render } from "@testing-library/react";
import PendingAccounts from "./PendingAccounts";

describe("PendingAccounts component", () => {
  let mockArray: Array<string>;
  let mockJsonPromise: Promise<Array<string>>;
  let mockFetchPromise: Promise<object>;
  beforeEach(() => {
    mockArray = ["hooomygod", "endme"];
    mockJsonPromise = Promise.resolve(mockArray);
    mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() => mockFetchPromise as Promise<Response>);
  });

  it("renders the PendingAccounts component", () => {
    const { container } = render(<PendingAccounts />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should reject selected account", () => {
    const mockState: object = {
      selectedAccount: mockArray[0],
    };
    const wrapper: any = shallow(<PendingAccounts />);
    wrapper.instance().setState(mockState);
    const mockTextPromise = Promise.resolve("testMsg");
    const mockRejectPromise = Promise.resolve({
      text: () => mockTextPromise,
    });
    jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() => mockRejectPromise as Promise<Response>);
    jest.spyOn(window, "alert").mockImplementationOnce(() => {});
    wrapper.instance().rejectAccount();
    const mockRequest = {
      body: '{"username":"' + wrapper.instance().state.selectedAccount + '"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    expect(window.fetch).toHaveBeenCalledWith(
      `/auth/rejectRegistration`,
      mockRequest,
    );
  });

  it("should approve selected account", () => {
    const mockState: object = {
      selectedAccount: mockArray[1],
    };
    const wrapper: any = shallow(<PendingAccounts />);
    wrapper.instance().setState(mockState);
    const mockTextPromise = Promise.resolve("testMsg");
    const mockApprovePromise = Promise.resolve({
      text: () => mockTextPromise,
    });
    jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() => mockApprovePromise as Promise<Response>);
    jest.spyOn(window, "alert").mockImplementationOnce(() => {});
    wrapper.instance().approveAccount();
    const mockRequest = {
      body: '{"username":"' + wrapper.instance().state.selectedAccount + '"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    };
    expect(window.fetch).toHaveBeenCalledWith(
      `/auth/approveRegistration`,
      mockRequest,
    );
  });
});
