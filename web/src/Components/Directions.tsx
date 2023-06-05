import React from "react";

export interface DirectionsProps {
  step: number;
  updateStep: (step: number) => void;
  directions: any[];
}

export class Directions extends React.Component<DirectionsProps, {}> {
  constructor(props: any) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" && this.props.step > 0) {
      this.props.updateStep(this.props.step - 1);
    } else if (
      event.key === "ArrowRight" &&
      this.props.step < this.props.directions.length - 1
    ) {
      this.props.updateStep(this.props.step + 1);
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  toMeters = (len: number): string => {
    return `${Math.ceil(len / 5) * 5}m`;
    // account for shorterning KM etc
  };

  render() {
    const direction = this.props.directions[this.props.step];
    return (
      <div id="route-info">
        <div className="route-info-header">
          {direction.directive}
        </div>
      </div>
    );
  }
}
