import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar component", () => {
  it("should render the Navbar component", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const { container } = render(
      <Router>
        <Navbar
          isLoggedIn={false}
          isAdmin={false}
          onAuthChange={onAuthChangeMock}
        />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // will get network request failed error if this test is put right above
  // or below the "should call renderIsLoggedIn when isLoggedIn is true" test
  it("should call renderIsNotLoggedIn when isLoggedIn is false", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const wrapper: ShallowWrapper<{}, {}, Navbar> = shallow(
      <Navbar
        isLoggedIn={false}
        isAdmin={false}
        onAuthChange={onAuthChangeMock}
      />,
    );
    const spy: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsNotLoggedIn",
    );
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalled();
  });

  // this also gets network request failed error when put right above
  // or below should call renderIsLoggedIn when isLoggedIn is true" test
  it("should call renderIsLoggedIn and renderIsAdminwhen isLoggedIn and isAdmin is true", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const wrapper: ShallowWrapper<{}, {}, Navbar> = shallow(
      <Navbar
        isLoggedIn={true}
        isAdmin={true}
        onAuthChange={onAuthChangeMock}
      />,
    );
    const spy: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsLoggedIn",
    );
    const spyAdmin: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsAdmin",
    );
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalled();
    expect(spyAdmin).toHaveBeenCalled();
  });

  it("should call onAuthChange on logoutSubmit", async () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const navbarMock = new Navbar({
      onAuthChange: onAuthChangeMock,
      isLoggedIn: false,
      isAdmin: false,
    });
    await navbarMock.logoutSubmit();
    expect(onAuthChangeMock).toHaveBeenCalled();
  });

  it("should call renderIsLoggedIn when isLoggedIn is true", () => {
    const onAuthChangeMock: jest.Mock = jest.fn();
    const wrapper: ShallowWrapper<{}, {}, Navbar> = shallow(
      <Navbar
        isLoggedIn={true}
        isAdmin={false}
        onAuthChange={onAuthChangeMock}
      />,
    );
    const spy: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsLoggedIn",
    );
    const spyAdmin: jest.SpyInstance = jest.spyOn(
      wrapper.instance(),
      "renderIsAdmin",
    );
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalled();
    expect(spyAdmin).not.toHaveBeenCalled();
  });
});
