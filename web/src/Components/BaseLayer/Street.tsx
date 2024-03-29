import React from "react";

export interface BaseLayerProps {
  layer?: d3.ExtendedFeatureCollection;
  path: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  hide?: boolean;
  zoom?: number;
}

export class StreetsBaseLayer extends React.Component<BaseLayerProps> {
  constructor(props: BaseLayerProps) {
    super(props);
  }

  streetWidth(type: number): number {
    switch (type) {
      case 203001:
        return 3;
      case 202001:
        return 4;
      case 201300:
        return 1;
      case 201500:
        return 1;
      case 201200:
        return 2;
      case 201700:
        return 0.35;
      default:
        return 1;
    }
  }

  render() {
    if (this.props.hide || this.props.layer === undefined) return <></>;
    let renderedStreets: Record<string, number> = {};
    return this.props.layer?.features?.map((d, i) => {
      renderedStreets[d.properties?.street_name] =
        renderedStreets[d.properties?.street_name] + 1 || 0;
      const renderStreetName = false // renderedStreets[d.properties?.street_name] === 0;
      return (
        <>
          <path
            key={"street-line" + i}
            id={"street-line" + i}
            d={this.props.path(d) as string}
            stroke="#fef1C0"
            strokeWidth={this.streetWidth(d.properties?.street_type)}
            fill="none"
            strokeDasharray="8 20"
          />
          {renderStreetName && (
            <text className="street-text" fill="#000055" fontSize={5}>
              <textPath method="stretch" href={"#street-line" + i}>
                {d.properties?.street_name}
              </textPath>
            </text>
            // fix naming with joining street sections together
          )}
        </>
      );
    });
  }
}
