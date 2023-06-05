import { ExtendedFeature } from "d3-geo";
import React from "react";
import { Mode } from "../App";

export interface ToggleModeProps {
  toggleMode: () => void;
  mode: Mode;
}

export class ToggleMode extends React.Component<ToggleModeProps> {
  constructor(props: ToggleModeProps) {
    super(props);
  }

  // change this to dynamic, moving across screen instead of stationary center
  render(): React.ReactNode {
    return (
      <div onClick={this.props.toggleMode} id="toggle-mode">
        <div>{this.props.mode}</div>
      </div>
    );
  }
}
