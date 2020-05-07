import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import GroupPlayback from "./GroupPlayback";

describe("GroupPlayback component", () => {

  it("should render the GroupPlayback component", () => {
    const { container } = render(
     <Router>
        <GroupPlayback />
     </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});