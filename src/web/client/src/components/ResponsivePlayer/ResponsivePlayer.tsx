import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import './ResponsivePlayer.css';

interface Props {
	url: string;
	controls: boolean
}
interface State {}

export default class ResponsivePlayer extends Component<Props, State> {
  render () {
    return (
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url={this.props.url}
          controls={this.props.controls}
          width='100%'
          height='100%'
        />
      </div>
    )
  }
}