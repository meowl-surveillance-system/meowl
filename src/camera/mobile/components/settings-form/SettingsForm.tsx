import React from 'react';
import { Modal, Button } from 'react-native';
import { Text, Input, ButtonGroup } from 'react-native-elements';

class SettingsForm extends React.Component<SettingsFormProps> {
  constructor(props: SettingsFormProps) {
    super(props);

  }

  updateProps(props: object) {
    this.props.updateProps(props);
  }

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
        visible={this.props.modalVisible}
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
            this.updateProps({ modalVisible: false });
          }}
          title="Done"
        />
      </Modal>
    );
  }
}

export default SettingsForm;