import { ExtendedFeature } from "d3-geo";
import React from "react";
import { Mode } from "../App";

export interface ToggleModeProps {
  toggleMode: () => void;
  mode: Mode;
}

export interface ToggleModeState {
  show: boolean;
}

export class ToggleMode extends React.Component<
  ToggleModeProps,
  ToggleModeState
> {
  constructor(props: ToggleModeProps) {
    super(props);
    this.state = {
      show: true,
    };
  }

  // change this to dynamic, moving across screen instead of stationary center
  render(): React.ReactNode {
    console.log(this.state);
    if (this.state.show) {
      return (
        <div onClick={this.props.toggleMode} id="toggle-mode">
          <div>{this.props.mode}</div>
        </div>
      );
    }
    return <></>;
  }
}
