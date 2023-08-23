import React from "react";

export interface MapLoadingProps {
  message: string;
  current: { long: number; lat: number } | null;
}

export class MapLoading extends React.Component<MapLoadingProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div id="map-load-fail">
        <svg id="map-load-fail-dots" height="50px">
          <circle
            cx="50%"
            cy="50%"
            r={20}
            fill="white"
            opacity={0.5}
            key={"current-back"}
          >
            <animate
              attributeName="r"
              values="6;10;6"
              dur="4s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="60%"
            cy="50%"
            r={20}
            fill="white"
            opacity={0.5}
            key={"current-back"}
          >
            <animate
              attributeName="r"
              values="6;10;6"
              begin="-1s"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="40%"
            cy="50%"
            r={20}
            fill="white"
            opacity={0.5}
            key={"current-back"}
          >
            <animate
              attributeName="r"
              values="6;10;6"
              begin="-2s"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <p>{this.props.message}</p>
        {this.props.current && (
          <p id="current-coords">
            ({this.props.current.lat}, {this.props.current.long})
          </p>
        )}
      </div>
    );
  }
}
