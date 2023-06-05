import React from "react";
import { BaseLayerProps } from "./Street";

export class ParksBaseLayer extends React.Component<BaseLayerProps> {
  constructor(props: BaseLayerProps) {
    super(props);
  }

  render() {
    if (this.props.hide || this.props.layer === undefined) return <></>;
    return (
      <>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="2" height="2">
          <path
            d="M-1,1 l2,-2
           M0,4 l4,-4
           M3,5 l2,-2"
            stroke="#6FF873"
            strokeWidth={1}
          />
        </pattern>
        {this.props.layer?.features?.map((d, i) => (
          <>
            <path
              key={"park-back" + i}
              d={this.props.path(d) as string}
              fill="#69d873"
              className="park-background"
            />
            <path
              key={"park" + i}
              d={this.props.path(d) as string}
              fill="url(#hatch)"
              className="park-path"
            />
          </>
        ))}
      </>
    );
  }
}
