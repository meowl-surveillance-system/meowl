import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminRoute from "./AdminRoute";

describe("AdminRoute component", () => {
  test("renders ProtectedRoute component", () => {
    const { container } = render(
      <Router>
        <AdminRoute isLoggedIn={false} isAdmin={false} redirectPath={"/"} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders Redirect when isLoggedIn is false", () => {
    const wrapper: ShallowWrapper<{}, {}, AdminRoute> = shallow(
      <AdminRoute isLoggedIn={false} isAdmin={false} redirectPath={"/"} />,
    );
    expect(wrapper.find("Redirect")).toHaveLength(1);
  });

  it("renders Redirect when isAdmin is false", () => {
    const wrapper: ShallowWrapper<{}, {}, AdminRoute> = shallow(
      <AdminRoute isLoggedIn={true} isAdmin={false} redirectPath={"/"} />,
    );
    expect(wrapper.find("Redirect")).toHaveLength(1);
  });

  it("renders Route when isLoggedIn and isAdmin is true", () => {
    const wrapper: ShallowWrapper<{}, {}, AdminRoute> = shallow(
      <AdminRoute isLoggedIn={true} isAdmin={true} redirectPath={"/"} />,
    );
    expect(wrapper.find("Route")).toHaveLength(1);
  });
});
