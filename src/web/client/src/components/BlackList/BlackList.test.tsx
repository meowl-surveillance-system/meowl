import React from "react";
import { render } from "@testing-library/react";
import BlackList from "./BlackList";

describe('Notification component', () => {
  it("renders Notification component", () => {
    const { container } = render(
      <BlackList isLoggedIn={true} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}) 