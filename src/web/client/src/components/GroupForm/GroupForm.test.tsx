import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import GroupForm from "./GroupForm";

describe("GroupForm component", () => {
  let GroupFormWrapper: ShallowWrapper<{}, {}, GroupForm>;
  let eventMock: any;
  let preventDefaultMock: jest.Mock;
  let mockSuccessResponse: string;
  let mockTextPromise: Promise<string>;
  let mockFetchPromise: Promise<object>;
  beforeEach(() => {
    mockSuccessResponse = "Successfully added user to group";
    mockTextPromise = Promise.resolve(mockSuccessResponse);
    mockFetchPromise = Promise.resolve({ text: () => mockTextPromise });
    jest
      .spyOn(window, "fetch")
      .mockImplementation(() => mockFetchPromise as Promise<Response>);
    preventDefaultMock = jest.fn();
    eventMock = {
      preventDefault: preventDefaultMock,
      target: {
        name: "groupId",
        value: "muda",
      },
    };
    GroupFormWrapper = shallow(<GroupForm />);
  });
  test("renders GroupForm component", () => {
    const { container } = render(
      <Router>
        <GroupForm />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("should set successMessage on successful resolve", async () => {
    await GroupFormWrapper.instance().onSubmit(eventMock);
    expect(GroupFormWrapper.instance().state.successMessage).toEqual(
      mockSuccessResponse,
    );
  });
  it("should not set failMessage on promise reject", async () => {
    await GroupFormWrapper.instance().onSubmit(eventMock);
    expect(GroupFormWrapper.instance().state.failMessage).toEqual("");
  });
  it("should set groupId field when onChange is called", () => {
    GroupFormWrapper.instance().onChange(eventMock);
    expect(GroupFormWrapper.instance().state.groupId).toEqual(
      eventMock.target.value,
    );
  });
});
