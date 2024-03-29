import { ExtendedFeature } from "d3-geo";
import React from "react";

export interface CurrentPinProps {
  current: { long: number; lat: number } | null;
  path: d3.GeoPath<any, d3.GeoPermissibleObjects>;
}

export const PIN_COLOUR = "#FAA8A0"

export class CurrentPin extends React.Component<CurrentPinProps> {
  constructor(props: CurrentPinProps) {
    super(props);
  }

  // change this to dynamic, moving across screen instead of stationary center
  render(): React.ReactNode {
    if (this.props.current) {
      const feature: ExtendedFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [this.props.current?.long, this.props.current?.lat],
        },
        properties: {},
      };
      return (
        this.props.current && (
          <>
            <circle
              cx={this.props.path.centroid(feature)[0]}
              cy={this.props.path.centroid(feature)[1]}
              r={10}
              fill={PIN_COLOUR}
              opacity={0.5}
              key={"current-back"}
            >
              <animate
                attributeName="r"
                values="6;10;6"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              key={"current"}
              cx={this.props.path.centroid(feature)[0]}
              cy={this.props.path.centroid(feature)[1]}
              r={5}
              fill="#EEE"
              stroke={PIN_COLOUR}
              strokeWidth={2}
            />
          </>
        )
      );
    }
    return <></>;
  }
}
