import React from "react";

export interface DirectionsViewerProps {
  directions: any[];
}

export class DirectionsViewer extends React.Component<
  DirectionsViewerProps,
  {}
> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <div id="directions-viewer"></div>;
  }
}
