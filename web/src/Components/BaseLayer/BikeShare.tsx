import axios from "axios";
import { ExtendedFeature, ExtendedFeatureCollection } from "d3-geo";
import React from "react";
import { BaseLayerProps } from "./Street";

export interface BikeShareState {
  layer: ExtendedFeatureCollection | null;
}

export class BikeShareBaseLayer extends React.Component<
  BaseLayerProps,
  BikeShareState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      layer: null,
    };
  }
  componentDidMount(): void {
    axios
      .get(
        `https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information`
      )
      .then((results) => {
        if (results.data?.data?.stations?.length > 0) {
          const features: ExtendedFeature[] = results.data.data.stations.map(
            (station: any) => {
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [station.lon, station.lat],
                },
                properties: station,
              };
            }
          );
          this.setState({
            layer: {
              type: "FeatureCollection",
              features,
            },
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render(): React.ReactNode {
    if (this.props.hide || this.state.layer === undefined) return <></>;
    return (
      <>
        {this.state.layer?.features?.map((d, i) => (
          <circle
            key={"bike-share" + i}
            cx={this.props.path.centroid(d)[0]}
            cy={this.props.path.centroid(d)[1]}
            fill="rgb(78,171,80)"
            stroke="rgb(42,100,75)"
            strokeWidth={1.5}
            r={4}
          />
        ))}
      </>
    );
  }
}
