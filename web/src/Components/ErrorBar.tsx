import React from "react";

export interface ErrorProps {
  error: string | null;
}

export class ErrorBar extends React.Component<ErrorProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (this.props.error) {
      return (
        <div className="error-bar">
          <div>{this.props.error}</div>
        </div>
      );
    }
  }
}
