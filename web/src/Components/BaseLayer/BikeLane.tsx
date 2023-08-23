import React from "react";
import { BaseLayerProps } from "./Street";

export class BikeLaneBaseLayer extends React.Component<BaseLayerProps> {
  constructor(props: BaseLayerProps) {
    super(props);
  }

  render() {
    if (this.props.hide || this.props.layer === undefined) return <></>;
    return (
      <>
        {this.props.layer?.features?.map((d, i) => (
          <path
            key={"bikelane" + i}
            d={this.props.path(d) as string}
            transform="translate(2,2)"
            stroke="green"
            strokeWidth={2}
            fill="none"
          />
        ))}
      </>
    );
  }
}
