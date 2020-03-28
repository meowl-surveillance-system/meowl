import React from 'react';
import { Modal, Button } from 'react-native';
import { Text, Input, ButtonGroup } from 'react-native-elements';

/**
 * A form that controls variable rates for RTMP streaming
 * TODO(chc5): Create unit tests for SettingsForm component
 */
class SettingsForm extends React.Component<SettingsFormProps> {
  constructor(props: SettingsFormProps) {
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
   * Renders SettingsForm component with inputs that updates the overall App state
   */
  render() {
    const fpsBtns: string[] = ['15', '20', '24', '30'];
    const fpsIndexMap: { [fps: number]: number } = {
      15: 0,
      20: 1,
      24: 2,
      30: 3,
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.settingsFormVisible}
      >
        <Text style={{ fontSize: 22 }}>
          Stream Link:
          </Text>
        <Input
          onChangeText={(outputLink) => this.updateProps({ outputLink: outputLink })}
          value={this.props.outputLink}
          placeholder="rtmp://"
        />
        <Text style={{ fontSize: 22 }}>
          Video Bit Rate:
        </Text>
        <Input
          onChangeText={(videoBitRate) => this.updateProps({ videoBitRate: parseInt(videoBitRate) })}
          value={this.props.videoBitRate.toString()}
          placeholder="8000000 (Recommended)"
        /><Text style={{ fontSize: 22 }}>
          Audio Bit Rate:
      </Text>
        <Input
          onChangeText={(audioBitRate) => this.updateProps({ audioBitRate: parseInt(audioBitRate) })}
          value={this.props.audioBitRate.toString()}
          placeholder="128000 (Recommended)"
        />
        <Text style={{ fontSize: 22 }}>
          Frames Per Second
          </Text>
        <ButtonGroup
          onPress={(selectedIndex) => this.updateProps({ fps: parseInt(fpsBtns[selectedIndex]) })}
          selectedIndex={fpsIndexMap[this.props.fps]}
          buttons={fpsBtns}
          containerStyle={{ height: 100 }}
        />
        <Button
          onPress={() => {
            this.updateProps({ settingsFormVisible: false });
          }}
          title="Done"
        />
      </Modal>
    );
  }
}

export default SettingsForm;