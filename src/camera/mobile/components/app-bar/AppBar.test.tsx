import 'react-native';
import React from 'react';
import AppBar from './AppBar';

import renderer from 'react-test-renderer';

describe('AppBar Component', () => {
  let appBarInstance: AppBar;
  let updatePropsMock: jest.Mock;
  beforeEach(() => {
    updatePropsMock = jest.fn();
    appBarInstance = new AppBar({
      flashEnabled: false,
      isPublishing: false,
      isViewingFrontCamera: false,
      settingsFormVisible: false,
      updateProps: updatePropsMock,
    });
  });

  it('renders correctly', () => {
    const container = renderer
      .create(
        <AppBar
          flashEnabled={false}
          isPublishing={false}
          isViewingFrontCamera={false}
          settingsFormVisible={false}
          updateProps={obj => { }}
        />,
      )
      .toJSON();
    expect(container).toMatchSnapshot();
  });

  it('should call props.updateProps on updates', async () => {
    appBarInstance.updateProps({ isPublishing: true });
    expect(updatePropsMock).toHaveBeenLastCalledWith({ isPublishing: true });
  });
});
