import React from "react";
import { shallow } from "enzyme";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar component", () => {
  it("should render the Navbar component", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const { container } = render(
      <Router>
        <Navbar isLoggedIn={false} onAuthChange={onAuthChangeMock} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // will get network request failed error if this test is put right below
  // or after the "should call renderIsLoggedIn when isLoggedIn is true" test
  it("should call renderIsNotLoggedIn when isLoggedIn is false", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const wrapper: any = shallow(
      <Navbar isLoggedIn={false} onAuthChange={onAuthChangeMock} />,
    );
    const spy: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsNotLoggedIn",
    );
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalled();
  });

  it("should call onAuthChange on logoutSubmit", async () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const navbarMock = new Navbar({
      onAuthChange: onAuthChangeMock,
      isLoggedIn: false,
    });
    await navbarMock.logoutSubmit();
    expect(onAuthChangeMock).toHaveBeenCalled();
  });

  it("should call renderIsLoggedIn when isLoggedIn is true", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const wrapper: any = shallow(
      <Navbar isLoggedIn={true} onAuthChange={onAuthChangeMock} />,
    );
    const spy: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsLoggedIn",
    );
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalled();
  });
});
