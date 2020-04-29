import React, { FormEvent } from "react";
import { render } from "@testing-library/react";
import Notification from "./Notification";

describe('Notification component', () => {
    it("renders Notification component", () => {
        const props = {
            date: "",
            type: "",
            name: "",
            img: []
        }
        const { container } = render(
            <Notification {...props} />
        );
        expect(container.firstChild).toMatchSnapshot();
      });
}) 