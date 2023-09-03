import React from "react";
import { BaseLayerProps } from "./Street";

export class BlocksBaseLayer extends React.Component<BaseLayerProps> {
  constructor(props: BaseLayerProps) {
    super(props);
  }

  render() {
    if (this.props.hide || this.props.layer === undefined) return <></>;
    return (
      <>
        {this.props.layer?.features?.map((d, i) => (
          <>
            <path
              key={"property-shade" + i}
              d={this.props.path(d) as string}
              transform="translate(2,2)"
              stroke="#555"
              fill="#888"
              opacity={0.2}
            />
          </>
        ))}
      </>
    );
  }
}
