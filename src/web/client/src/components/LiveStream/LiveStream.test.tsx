import React from "react";
import { shallow } from "enzyme";
import { render } from "@testing-library/react";
import LiveStream from "./LiveStream";

describe("LiveStream component", () => {
  let mockCollection: object;
  let mockJsonPromise: Promise<any>;
  let mockFetchPromise: Promise<any>;
  beforeEach(() => {
    mockCollection = { okbigboi: "hooomygod" };
    mockJsonPromise = Promise.resolve(mockCollection);
    mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(window, "fetch").mockImplementation(() => mockFetchPromise);
  });

  it("renders the LiveStream component", () => {
    const { container } = render(<LiveStream />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should set url when getURL is called", () => {
    const mockState: object = {
      ip: "127.0.0.1",
      port: "3000",
    };
    const streamId = "1";
    const wrapper: any = shallow(<LiveStream />);
    wrapper.instance().setState(mockState);
    wrapper.instance().getURL(streamId);
    expect(wrapper.instance().state.url).toEqual(
      `http://127.0.0.1:3000/hls/${streamId}.m3u8`,
    );
  });

  it("should set liveCameraStreamIds", async () => {
    const wrapper: any = shallow(<LiveStream />);
    await wrapper.instance().componentDidMount();
    expect(wrapper.instance().state.liveCameraStreamIds).toEqual(
      mockCollection,
    );
  });
});
