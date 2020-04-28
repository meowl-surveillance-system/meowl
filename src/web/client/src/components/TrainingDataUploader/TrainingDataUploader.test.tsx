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
    // console.log(trainingDataUploaderWrapper.debug());
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

  it('should call uploadFile twice', () => {
    const fileStubs: File[] = [
      new File([], 'dummy.txt'),
      new File([], 'dummy2.txt'),
    ];
    // const uploadFileSpy: jest.SpyInstance = jest.spyOn(TrainingDataUploader, '');
    trainingDataUploaderWrapper = trainingDataUploaderWrapper.setState({ selectedFiles: fileStubs });
    trainingDataUploaderWrapper.instance().onFilesUpload();
  });
});
