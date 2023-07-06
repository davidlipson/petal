import React from "react";
import { BaseLayerProps } from "./BaseLayer";

export interface RouteProps extends BaseLayerProps {
  step?: number | null;
  directions: any[] | null;
}

export class RouteLayer extends React.Component<RouteProps> {
  constructor(props: RouteProps) {
    super(props);
  }

  roadColor(roadType: number, idx: number): string {
    switch (roadType) {
      case 203001:
        return "blue";
      default:
        return "orange";
    }
  }

  roadWidth(idx: number): number {
    return 3;
  }

  render() {
    if (this.props.layer === undefined || this.props.directions === null)
      return <></>;
    const features = this.props.layer.features;
    const directions = this.props.directions;

    return (
      <>
        {features.map((d, i) => {
          return (
            <>
              <path
                onMouseEnter={() => {
                  console.log(
                    d.properties,
                    this.props.directions ? this.props.directions[i] : null
                  );
                }}
                key={"route" + i}
                d={this.props.path(d) as string}
                stroke={this.roadColor(d.properties?.road?.id, i)}
                strokeWidth={this.roadWidth(i)}
                fill="none"
                stroke-dasharray={d.properties?.a_name === 'CURRENT-POSITION' || d.properties?.b_name === 'ENDING-POSITION' ? 3 : 0}
              />
            </>
          );
        })}
      </>
    );
  }
}
