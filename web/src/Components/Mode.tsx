import React from "react";

export interface ModeState {
  hoveredMode: number | null;
}

export interface ModeProps {
  setMode: (mode: number) => void;
  currentMode: number;
}

export class Mode extends React.Component<ModeProps, ModeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      hoveredMode: null,
    };
    this.handleSetMode = this.handleSetMode.bind(this);
  }

  handleSetMode(mode: number): void {
    this.props.setMode(mode);
  }

  // dedup this code
  render(): React.ReactNode {
    return (
      <>
        <div id="modes-slider">
          {[...Array(5)].map((m, i) => {
            return (
              <div className="modes-slider-button">
                <div
                  onClick={() => this.handleSetMode(i)}
                  onMouseEnter={() => this.setState({ hoveredMode: i })}
                  onMouseLeave={() => this.setState({ hoveredMode: null })}
                  className={`slider-selector ${
                    this.props.currentMode === i ? "selected-mode" : ""
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
        <div id="modes">
          <div
            className={`mode ${
              this.props.currentMode === 0 ? "selected-mode" : ""
            }`}
            onClick={() => this.handleSetMode(0)}
          >
            Fast
          </div>
          <div
            className={`mode ${
              this.props.currentMode === 10 ? "selected-mode" : ""
            }`}
            onClick={() => this.handleSetMode(10)}
          >
            Safe
          </div>
        </div>
      </>
    );
  }
}
