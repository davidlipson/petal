import React from "react";
import { BaseLayerProps } from "./Street";

export class RoadEdgeBaseLayer extends React.Component<BaseLayerProps> {
  constructor(props: BaseLayerProps) {
    super(props);
  }

  render() {
    if (this.props.hide || this.props.layer === undefined) return <></>;
    return (
      <>
        {this.props.layer?.features?.map((d, i) => (
          <path
            key={"edge" + i}
            d={this.props.path(d) as string}
            fill="#DDD"
            opacity={0.4}
            stroke="#BBB"

            />
        ))}
      </>
    );
  }
}
