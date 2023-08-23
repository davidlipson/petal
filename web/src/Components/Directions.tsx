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
    const perc = Math.floor(
      (100 * this.props.step) / (this.props.directions.length - 1)
    );
    const col = (255 * this.props.step) / (this.props.directions.length - 1);
    return (
      <div id="route-info">
        <div id="progress-bar">
          <div
            style={{
              backgroundColor: `rgb(${255 - col},${col},0)`,
              width: `${perc}%`,
            }}
            id={perc === 100 ? `complete-progress` : ''}
          ></div>
        </div>
        <div className="route-info-header">
          {direction.edge.street_name} - {direction.edge.road.name} -{" "}
          {direction.edge.bike_lanes.length > 0 ? "Bike Lane" : "No Bike Lane"}
        </div>
      </div>
    );
  }
}
