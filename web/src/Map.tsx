import React from "react";
import * as d3 from "d3";
import { Clouds, CurrentPin, MapLoading, RouteLayer } from "./Components";
import {
  BikeLaneBaseLayer,
  BikeShareBaseLayer,
  BlocksBaseLayer,
  LightsBaseLayer,
  ParksBaseLayer,
  PropertyBaseLayer,
  RoadEdgeBaseLayer,
  StreetsBaseLayer,
} from "./Components/BaseLayer";

export interface MapProps {
  mapData: Record<string, d3.ExtendedFeatureCollection>;
  routeData: d3.ExtendedFeatureCollection;
  directions: any[] | null;
  current: { long: number; lat: number } | null;
  step?: number | null;
  zoom?: number;
}

class Map extends React.Component<MapProps> {
  constructor(props: MapProps) {
    super(props);
  }

  render() {
    const height = 1000;
    const width = 1000;
    const margin = 0;

    if (Object.keys(this.props.mapData).length > 0) {
      var projection = d3.geoMercator().fitExtent(
        [
          [margin, margin],
          [width - margin, height - margin],
        ],
        this.props.mapData.streets?.features?.length > 0
          ? this.props.mapData.streets
          : this.props.routeData
      );
      var path = d3.geoPath().projection(projection);
      // also could simplified centreline_graph on direction response to extend each segment under some conditions and simplify the graph
      return (
        <div id="map-div">
          {false && <Clouds />}
          <svg
            id="mapSvg"
            transform={`rotate(${
              this.props.step !== null && this.props.directions
                ? -this.props.directions[this.props.step as number]?.edge
                    ?.arriving_angle - 180 || 16.7
                : 16.7
            })`}
            width={width}
            height={height}
          >
            <filter id="filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".02"
                numOctaves="10"
              />
              <feDisplacementMap in="SourceGraphic" scale="180" />
            </filter>
            <RoadEdgeBaseLayer path={path} layer={this.props.mapData.edge} />
            <StreetsBaseLayer path={path} layer={this.props.mapData.streets} />
            <BikeLaneBaseLayer
              hide={true}
              path={path}
              layer={this.props.mapData.bikelanes}
            />
            <PropertyBaseLayer
              path={path}
              layer={this.props.mapData.properties}
            />
            <BlocksBaseLayer path={path} layer={this.props.mapData.blocks} />
            <ParksBaseLayer path={path} layer={this.props.mapData.parks} />
            <RouteLayer
              directions={this.props.directions}
              step={this.props.step}
              path={path}
              layer={this.props.routeData}
            />
            <BikeShareBaseLayer
              hide={this.props.step === null}
              path={path}
              zoom={this.props.zoom}
            />
            <LightsBaseLayer
              hide={this.props.step === null}
              path={path}
              layer={this.props.mapData.signals}
            />
            <CurrentPin path={path} current={this.props.current} />
          </svg>
        </div>
      );
    }
    return (
      <MapLoading
        message={"Unable to locate you... are you out of town?"}
        current={this.props.current}
      />
    );
  }
}

export default Map;
