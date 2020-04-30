import React from "react";
import { render } from "@testing-library/react";
import NotificationList from "./NotificationList";

describe('NotificationList component', () => {
  it('renders NotificationList component', () => {
    const { container } = render(
      <NotificationList />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
})