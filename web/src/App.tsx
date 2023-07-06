import React from "react";
import "./App.css";
import Map from "./Map";
import axios from "axios";
import { ExtendedFeature, ExtendedFeatureCollection } from "d3-geo";
import { Search } from "./Search";
import { Directions, ToggleMode } from "./Components";

export enum Mode {
  FULLVIEW = "FULLVIEW",
  DIRECTIONS = "DIRECTIONS",
}

export const ZOOM_OUT = 0.75;
export const ZOOM_IN = 0.25;

export interface AppState {
  routeData: ExtendedFeatureCollection;
  loading: boolean;
  addresses: string[];
  mapData: Record<string, ExtendedFeatureCollection>;
  current: { long: number; lat: number };
  step: number | null;
  directions: any[] | null;
  mode: Mode | null;
  zoom: number;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      routeData: {
        type: "FeatureCollection",
        features: [],
      } as ExtendedFeatureCollection,
      loading: false,
      addresses: [],
      step: null,
      directions: null,
      zoom: ZOOM_OUT,
      current: { long: -79.42384, lat: 43.64453 },
      mapData: {} as Record<string, ExtendedFeatureCollection>,
      mode: Mode.FULLVIEW,
    };
    this.search = this.search.bind(this);
    this.updateStep = this.updateStep.bind(this);
  }

  // TODO button to switch between modes, either zoom in on current location with panning OR
  // zoom out to full view of route with two points as start and end + some extra buffer arround
  // change mapData to be full area of route but zoom in on DIRECTION VIEW

  setBaseLayer(lat?: number, long?: number): void {
    axios
      .get(
        `http://localhost:3000/base?km=${this.state.zoom}&lat=${lat}&long=${long}`
      )
      .then((res) => {
        this.setState({
          mapData: res.data,
          current: { long: long || -79.42384, lat: lat || 43.64453 },
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount(): void {
    this.setBaseLayer();
  }

  updateStep = (step: number | null): void => {
    this.setState({ step });
    if (
      step !== null &&
      this.state.directions &&
      this.state.directions.length > step
    ) {
      const position: GeoJSON.Point =
        this.state.directions[step].edge.a_geometry;
      this.setBaseLayer(position.coordinates[1], position.coordinates[0]);
    }
  };

  // TODO fix error when address has symbols / apostrophe
  search(start_address: string, end_address: string): void {
    const start = encodeURIComponent(start_address);
    const end = encodeURIComponent(end_address);
    this.setState({ loading: true, zoom: ZOOM_IN, mode: Mode.DIRECTIONS });
    axios
      .get(
        `http://localhost:3000/route?start_address=${start}&end_address=${end}`
      )
      .then((res) => {
        const features = [] as ExtendedFeature[];
        const directions = [] as any[]; // fix anys!
        // use nx lib to abstract direction interface
        res.data.directions.forEach(
          (direction: {
            direction: any;
            edge: {
              geometry: GeoJSON.MultiLineString;
              road: {id: number; name: string;};
              a_name: string;
              b_name: string;
            };
          }) => {
            directions.push(direction);
            features.push({
              type: "Feature",
              geometry: direction.edge.geometry,
              properties: {
                road: direction.edge.road,
                a_name: direction.edge.a_name,
                b_name: direction.edge.b_name,
              },
            });
          }
        );
        if (res.data.directions && res.data.directions.length > 0) {
          const position: GeoJSON.Point =
            res.data.directions[0].edge.a_geometry;
          this.setBaseLayer(position.coordinates[1], position.coordinates[0]);
        }
        this.setState({
          routeData: {
            type: "FeatureCollection",
            features,
          },
          step: features.length > 0 ? 0 : null,
          directions,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  // fix this
  toggleView = (): void => {
    if (this.state.mode === Mode.FULLVIEW && this.state.step !== null) {
      this.setState({ mode: Mode.DIRECTIONS, zoom: ZOOM_IN });
    } else {
      this.setState({ mode: Mode.FULLVIEW, zoom: ZOOM_OUT });
    }
    if (this.state.step !== null) {
      this.updateStep(this.state.step);
    }
  };

  render(): React.ReactNode {
    return (
      <div className="App">
        {this.state.loading ? (
          <div id="loading">Loading...</div>
        ) : (
          <Search submitSearch={this.search} />
        )}
        {Object.keys(this.state.mapData).length > 0 && (
          <Map
            current={this.state.current}
            step={this.state.step}
            mapData={this.state.mapData}
            routeData={this.state.routeData}
            directions={this.state.directions}
            zoom={this.state.zoom}
          />
        )}
        <div id="direction-container">
          {this.state.step !== null && this.state.directions && (
            <Directions
              updateStep={this.updateStep}
              step={this.state.step}
              directions={this.state.directions}
            />
          )}
          {this.state.mode && this.state.step !== null && (
            <ToggleMode mode={this.state.mode} toggleMode={this.toggleView} />
          )}
        </div>
      </div>
    );
  }
}
