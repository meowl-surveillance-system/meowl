import React from "react";
import { render } from "@testing-library/react";
import UserGroups from "./UserGroups";

describe("UserGroup component", () => {

  it("should render the UserGroup component", () => {
    const { container } = render(
      <UserGroups />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});