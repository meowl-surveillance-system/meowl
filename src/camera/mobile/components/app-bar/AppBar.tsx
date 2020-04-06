import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

/**
 * The AppBar component controls all the main features of MeowlMobile
 */
class AppBar extends React.Component<AppBarProps> {
  constructor(props: AppBarProps) {
    super(props);
  }

  /**
   * Updates the main state of outer components
   * @param props - Property to be updated
   */
  updateProps(props: object) {
    this.props.updateProps(props);
  }

  /**
   * Renders the AppBar component
   *
   * The AppBar contains isPublishing button, settingFormVisible button,
   * flashEnabled button and video-switch button
   */
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          backgroundColor: 'navy',
        }}>
        {this.props.isPublishing ? (
          <Icon
            type="material-community"
            name="video-off"
            onPress={() => this.updateProps({ isPublishing: false })}
            reverse={true}
          />
        ) : (
            <Icon
              type="material-community"
              name="video"
              style={{ backgroundColor: 'transparent' }}
              onPress={() => this.updateProps({ isPublishing: true })}
              reverse={true}
            />
          )}
        <Icon
          type="material-community"
          name="settings"
          onPress={() => this.updateProps({ settingsFormVisible: true })}
          reverse={true}
          disabled={this.props.isPublishing}
        />
        <Icon
          type="material-community"
          name="video-switch"
          onPress={() => {
            this.updateProps({
              flashEnabled: false,
              isViewingFrontCamera: !this.props.isViewingFrontCamera,
            });
          }}
          reverse={true}
        />
        {this.props.flashEnabled ? (
          <Icon
            type="material-community"
            name="flash-off"
            onPress={() => this.updateProps({ flashEnabled: false })}
            reverse={true}
            underlayColor="transparent"
            disabled={this.props.isViewingFrontCamera}
          />
        ) : (
            <Icon
              type="material-community"
              name="flash"
              onPress={() => this.updateProps({ flashEnabled: true })}
              reverse={true}
              disabled={this.props.isViewingFrontCamera}
            />
          )}
      </View>
    );
  }
}

export default AppBar;
