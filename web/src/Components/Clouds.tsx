import React from "react";

export interface CloudsState {
  clouds: any[];
}
//fix

export class Clouds extends React.Component<{}, CloudsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      clouds: [
        {
          width: "500px",
          height: "275px",
          borderRadius: "50%",
          filter: "url(#filter)",
          boxShadow: "400px 400px 60px 0px #fff",
          position: "absolute",
          top: -400,
          left: -500,
          opacity: 0.5
        },
        {
            width: 800,
            height: 275,
            borderRadius: "50%",
            filter: "url(#filter)",
            boxShadow: "400px 400px 60px 0px #fff",
            position: "absolute",
            overflow: "hidden",
            top: 200,
            right: 200,
            opacity: 0.5
          },
      ],
    };
  }

 componentDidMount() {
    const interval = setInterval(() => {
        let cloud = {...this.state.clouds[0]};
        let cloud2 = {...this.state.clouds[1]};
        cloud.left = cloud.left - 1;
        cloud2.right = cloud2.right - 1;
        this.setState({ clouds: [cloud, cloud2] })
    }, 50);
    setTimeout(() => {  
        clearInterval(interval);
    }, 35000);
  }

  render() {
    return (
      <>
        <div className="cloud" style={this.state.clouds[0]}></div>
        <div className="cloud" style={this.state.clouds[1]}></div>
      </>
    );
  }
}
