import React from "react";
import * as d3 from "d3";
import { Clouds, CurrentPin, RouteLayer } from "./Components";
import { BikeShareBaseLayer, LightsBaseLayer, ParksBaseLayer, PropertyBaseLayer, StreetsBaseLayer } from "./Components/BaseLayer";

export interface MapProps {
  mapData: Record<string, d3.ExtendedFeatureCollection>;
  routeData: d3.ExtendedFeatureCollection;
  directions: any[] | null;
  current?: { long: number; lat: number };
  step?: number | null;
  zoom?: number;
}

class Map extends React.Component<MapProps> {
  constructor(props: MapProps) {
    super(props);
  }

  render() {
    const height = 800;
    const width = 800;
    const margin = 0;

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
          <StreetsBaseLayer path={path} layer={this.props.mapData.streets} />
          <PropertyBaseLayer path={path} layer={this.props.mapData.properties} />
          <ParksBaseLayer path={path} layer={this.props.mapData.parks} />
          <BikeShareBaseLayer hide={this.props.step === null} path={path} zoom={this.props.zoom}/>
          <LightsBaseLayer hide={true || this.props.step === null} path={path} layer={this.props.mapData.signals}/>
          <RouteLayer directions={this.props.directions} step={this.props.step} path={path} layer={this.props.routeData} />
          <CurrentPin path={path} width={800} height={800} current={this.props.current} />
        </svg>
      </div>
    );
  }
}

export default Map;
