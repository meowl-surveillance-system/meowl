import React from "react";
import { mount, ShallowWrapper, shallow } from "enzyme";
import { render } from "@testing-library/react";
import { State } from "./TrainingDataUploader";
import TrainingDataUploader from "./TrainingDataUploader";

describe("TrainingDataUploader component", () => {
  let trainingDataUploaderWrapper: ShallowWrapper<{}, State, TrainingDataUploader>;
  let onAuthChangeMock: jest.Mock;
  beforeEach(() => {
    onAuthChangeMock = jest.fn();
    trainingDataUploaderWrapper = shallow(
      <TrainingDataUploader
        isLoggedIn={false}
        onAuthChange={onAuthChangeMock}
      />
    );
  });

  it("should render the TrainingDataUploader component", () => {
    const { container } = render(
      <TrainingDataUploader
        isLoggedIn={false}
        onAuthChange={onAuthChangeMock}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call uploadFile twice', async () => {
    const fileStubs: File[] = [
      new File([], 'dummy.txt'),
      new File([], 'dummy2.txt'),
    ];
    const fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(Promise.resolve(new Response('')));
    trainingDataUploaderWrapper = trainingDataUploaderWrapper.setState({ selectedFiles: fileStubs });
    expect(await trainingDataUploaderWrapper.instance().onFilesUpload()).toEqual(true);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should click on fileInputRef', () => {
    const clickMock = jest.fn();
    Object.defineProperty(
      trainingDataUploaderWrapper.instance(),
      'fileInputRef',
      { value: { click: clickMock } }
    );
    trainingDataUploaderWrapper.instance().promptFileInput();
    expect(clickMock).toHaveBeenCalled();
  });
});
