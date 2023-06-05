import React from "react";
import { BaseLayerProps } from "./Street";

export class LightsBaseLayer extends React.Component<BaseLayerProps> {
  constructor(props: BaseLayerProps) {
    super(props);
  }

  render() {
    if (this.props.hide || this.props.layer === undefined) return <></>;
    return (
      <>
        {this.props.layer?.features?.map((d, i) => (
          <g>
            <rect
              key={"light" + i}
              x={this.props.path.centroid(d)[0]}
              y={this.props.path.centroid(d)[1] - 6}
              width={6}
              height={12}
              fill="yellow"
            />
            <circle
              key={"lightg" + i}
              cx={this.props.path.centroid(d)[0] + 2.5}
              cy={this.props.path.centroid(d)[1] - 3}
              r={1.2}
              fill="green"
            />
            <circle
              key={"lighto" + i}
              cx={this.props.path.centroid(d)[0] + 2.5}
              cy={this.props.path.centroid(d)[1]}
              r={1.2}
              fill="orange"
            />
            <circle
              key={"lightr" + i}
              cx={this.props.path.centroid(d)[0] + 2.5}
              cy={this.props.path.centroid(d)[1] + 3}
              r={1.2}
              fill="red"
            />
          </g>
        ))}
      </>
    );
  }
}
