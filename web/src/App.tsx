import React from "react";
import "./App.css";
import Map from "./Map";
import axios from "axios";
import { ExtendedFeature, ExtendedFeatureCollection } from "d3-geo";
import {
  Directions,
  DirectionsViewer,
  ErrorBar,
  MapLoading,
  Search,
  ToggleMode,
} from "./Components";
import { time } from "console";
import { backgroundColourByTime } from "./helpers";

export enum Mode {
  SEARCH = "SEARCH",
  DIRECTIONS = "DIRECTIONS",
}

export interface AppState {
  routeData: ExtendedFeatureCollection;
  loading: boolean;
  addresses: string[];
  mapData: Record<string, ExtendedFeatureCollection>;
  current: { long: number; lat: number } | null;
  step: number | null;
  directions: any[] | null;
  mode: Mode;
  zoom: number;
  error: string | null;
  currentDate: Date;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      routeData: {
        type: "FeatureCollection",
        features: [],
      } as ExtendedFeatureCollection,
      loading: false,
      addresses: [],
      step: null,
      directions: null,
      zoom: 0.5,
      current: null,
      mapData: {} as Record<string, ExtendedFeatureCollection>,
      mode: Mode.SEARCH,
      currentDate: new Date(),
    };
    this.search = this.search.bind(this);
    this.updateStep = this.updateStep.bind(this);
  }

  // TODO button to switch between modes, either zoom in on current location with panning OR
  // zoom out to full view of route with two points as start and end + some extra buffer arround
  // change mapData to be full area of route but zoom in on DIRECTION VIEW

  // add closest address from current location on mount

  setBaseLayer(lat?: number, long?: number): void {
    if (lat && long) {
      axios
        .get(
          `http://localhost:3000/base?km=${this.state.zoom}&lat=${lat}&long=${long}`
        )
        .then((res) => {
          console.log(res);
          this.setState({
            mapData: res.data,
            current: {
              long,
              lat,
            } /*{ long: long || -79.42384, lat: lat || 43.64453 }*/,
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  success = (position: GeolocationPosition): void => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Current location", latitude, longitude);
    this.setBaseLayer(latitude, longitude);
  };

  error = (): void => {
    this.setBaseLayer(43.64453, -79.42384);
  };

  setCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  componentDidMount(): void {
    this.setCurrentLocation();
    setInterval(() => {
      this.setState({ currentDate: new Date() });
    }, 10000); //  change distance between updates
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
  search(start_address: string, end_address: string, safety: number): void {
    const start = encodeURIComponent(start_address);
    const end = encodeURIComponent(end_address);
    this.setState({ loading: true, mode: Mode.DIRECTIONS });
    axios
      .get(
        `http://localhost:3000/route?start_address=${start}&end_address=${end}&safety=${safety}`
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
              road: { id: number; name: string };
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
        this.setState({
          loading: false,
          mode: Mode.SEARCH,
        });
        this.setError(err.response.data);
      });
  }

  // fix this
  toggleView = (): void => {
    if (this.state.mode === Mode.SEARCH && this.state.step !== null) {
      this.setState({ mode: Mode.DIRECTIONS });
    } else {
      this.setState({ mode: Mode.SEARCH });
    }
    if (this.state.step !== null) {
      this.updateStep(this.state.step);
    }
  };

  setError = (error: string): void => {
    this.setState({ error });
    setTimeout(() => {
      this.setState({ error: null });
    }, 5000);
  };

  // could move className App into its own class and pass children props
  // def can make this cleaner
  render(): React.ReactNode {
    const searchMode = (
      <>
        <Search submitSearch={this.search} />
        <ErrorBar error={this.state.error} />
      </>
    );
    let main = (
      <MapLoading message={"Loading..."} current={this.state.current} />
    );
    if (!this.state.loading) {
      main = (
        <>
          <Map
            current={this.state.current}
            step={this.state.step}
            mapData={this.state.mapData}
            routeData={this.state.routeData}
            directions={this.state.directions}
            zoom={this.state.zoom}
          />
          {this.state.step !== null && this.state.directions && (
            <div id="direction-container">
              <div id="directions-top-bar">
                <DirectionsViewer directions={this.state.directions} />
              </div>
              <div id="direction-bottom-bar">
                <Directions
                  updateStep={this.updateStep}
                  step={this.state.step}
                  directions={this.state.directions}
                />
                <ToggleMode
                  mode={
                    (this.state.mode as Mode) === Mode.SEARCH
                      ? Mode.DIRECTIONS
                      : Mode.SEARCH
                  }
                  toggleMode={this.toggleView}
                />
              </div>
            </div>
          )}
        </>
      );
    }

    const currentColours = backgroundColourByTime(
      //this.state.currentDate.getHours()
      5
    );
    console.log(currentColours.innerColour);

    return (
      <div
        className="App"
        style={{
          background: `radial-gradient(${currentColours.innerColour}, ${currentColours.outerColour})`,
        }}
      >
        {this.state.mode === Mode.SEARCH ? searchMode : main}
        <ErrorBar error={this.state.error} />
      </div>
    );
  }
}
