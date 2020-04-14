import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute component", () => {
  test("renders ProtectedRoute component", () => {
    const { container } = render(
      <Router>
        <ProtectedRoute isLoggedIn={false} redirectPath={"/"} />
      </Router>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders Redirect when isLoggedIn is false", () => {
    const wrapper: ShallowWrapper<{}, {}, ProtectedRoute> = shallow(
      <ProtectedRoute isLoggedIn={false} redirectPath={"/"} />,
    );
    expect(wrapper.find("Redirect")).toHaveLength(1);
  });

  it("renders Route when isLoggedIn is true", () => {
    const wrapper: ShallowWrapper<{}, {}, ProtectedRoute> = shallow(
      <ProtectedRoute isLoggedIn={true} redirectPath={"/"} />,
    );
    expect(wrapper.find("Route")).toHaveLength(1);
  });
});
