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
    if (
      (this.props.zoom && this.props.zoom > 0.5) ||
      this.props.hide ||
      this.state.layer === undefined
    )
      return <></>;
    return (
      <>
        {this.state.layer?.features?.map((d, i) => (
          <>
            <circle
              key={"bike-share-outer" + i}
              cx={this.props.path.centroid(d)[0]}
              cy={this.props.path.centroid(d)[1]}
              fill="white"
              opacity={0.2}
              stroke="white"
              strokeWidth={2}
              r={10}
            />
            <circle
              key={"bike-share-outer" + i}
              cx={this.props.path.centroid(d)[0]}
              cy={this.props.path.centroid(d)[1]}
              fill="white"
              stroke="rgb(42,100,75)"
              strokeWidth={2}
              r={7}
            />
            <circle
              key={"bike-share" + i}
              cx={this.props.path.centroid(d)[0]}
              cy={this.props.path.centroid(d)[1]}
              fill="rgb(78,171,80)"
              stroke="rgb(42,100,75)"
              strokeWidth={3}
              r={4}
            />
          </>
        ))}
      </>
    );
  }
}
