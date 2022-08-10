import React from "react";
import "./Game.js.css";

class Ball extends React.Component {
  render() {
    let ballStyle = {
      position: "absolute",
      width: "10px",
      height: "10px",
      backgroundColor: "black",
      left: this.props.p[0] - 3,
      top: this.props.p[1] - 3,
      borderRadius: "100%"
    };
    return <div style={ballStyle} />;
  }
}

class Paddle extends React.Component {
  render() {
    let paddleStyle = {
      position: "absolute",
      left: this.props.p[0],
      top: this.props.p[1] - 20,
      width: "5px",
      height: "40px",
      backgroundColor: this.props.color
    };
    return <div style={paddleStyle} />;
  }
}

export class Pong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftPaddlePos: [10, 50],
      rightPaddlePos: [390, 50],
      ballPos: [200, 50],
      ballSpeed: [5, 0],
      score: [0, 0],
      suspendedSpeed: [0, 0],
      paused: false,
      pauseButtonText: "Pause"
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    this._interval = setInterval(this.handleTimer, 100);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    clearInterval(this._interval);
  }

  handleKeyDown = (e) => {
    if (!this.state.paused) {
      if (e.keyCode === 38) {
        if (this.state.rightPaddlePos[1] > 20) {
          this.setState({
            rightPaddlePos: [
              this.state.rightPaddlePos[0],
              this.state.rightPaddlePos[1] - 1
            ]
          });
        }
      }
      if (e.keyCode === 40) {
        if (this.state.rightPaddlePos[1] < 81) {
          this.setState({
            rightPaddlePos: [
              this.state.rightPaddlePos[0],
              this.state.rightPaddlePos[1] + 1
            ]
          });
        }
      }
      if (e.keyCode === 87) {
        if (this.state.leftPaddlePos[1] > 20) {
          this.setState({
            leftPaddlePos: [
              this.state.leftPaddlePos[0],
              this.state.leftPaddlePos[1] - 1
            ]
          });
        }
      }
      if (e.keyCode === 83) {
        if (this.state.leftPaddlePos[1] < 81) {
          this.setState({
            leftPaddlePos: [
              this.state.leftPaddlePos[0],
              this.state.leftPaddlePos[1] + 1
            ]
          });
        }
      }
    }
  };

  handleTimer = () => {
    this.moveBall();
  };

  moveBall = () => {
    this.detectHit();
    this.setState({
      ballPos: [
        this.state.ballPos[0] + this.state.ballSpeed[0],
        this.state.ballPos[1] + this.state.ballSpeed[1]
      ]
    });
  };

  detectHit = () => {
    if (this.state.ballPos[0] <= 5) {
      //Right win
      this.setState({ score: [this.state.score[0], this.state.score[1] + 1] });
      this.resetLevel(-1);
    }
    if (this.state.ballPos[0] >= 395) {
      //Left win
      this.setState({ score: [this.state.score[0] + 1, this.state.score[1]] });
      this.resetLevel(1);
    }
    if (this.state.ballPos[1] >= 95 || this.state.ballPos[1] <= 5) {
      //Upper / lower bar hit
      this.setState({
        ballSpeed: [this.state.ballSpeed[0], this.state.ballSpeed[1] * -1]
      });
    }
    if (
      Math.abs(this.state.rightPaddlePos[0] - this.state.ballPos[0]) < 7.5 &&
      this.state.ballPos[1] > this.state.rightPaddlePos[1] - 25 &&
      this.state.ballPos[1] < this.state.rightPaddlePos[1] + 25
    ) {
      this.hitPaddle();
    } else if (
      Math.abs(this.state.leftPaddlePos[0] - this.state.ballPos[0]) < 7.5 &&
      this.state.ballPos[1] > this.state.leftPaddlePos[1] - 25 &&
      this.state.ballPos[1] < this.state.leftPaddlePos[1] + 25
    ) {
      this.hitPaddle();
    }
  };

  hitPaddle = () => {
    this.setState({
      ballSpeed: [
        -this.state.ballSpeed[0],
        (Math.floor(Math.random() * 2) + 1) *
          -1 *
          Math.sign(this.state.ballSpeed[1] + 0.01)
      ]
    });
  };

  resetLevel = (direction) => {
    this.setState({
      ballPos: [200, 50],
      ballSpeed: [direction * 5, 0],
      leftPaddlePos: [10, 50],
      rightPaddlePos: [390, 50]
    });
  };

  resetGame = () => {
    this.setState({
      ballPos: [200, 50],
      ballSpeed: [5, 0],
      leftPaddlePos: [10, 50],
      rightPaddlePos: [390, 50],
      score: [0, 0]
    });
  };

  pauseGame = () => {
    if (!this.state.paused) {
      this.setState({
        suspendedSpeed: [this.state.ballSpeed[0], this.state.ballSpeed[1]],
        paused: true,
        ballSpeed: [0, 0],
        pauseButtonText: "Resume"
      });
    } else {
      this.setState({
        ballSpeed: [this.state.suspendedSpeed[0], this.state.suspendedSpeed[1]],
        paused: false,
        suspendedSpeed: [0, 0],
        pauseButtonText: "Pause"
      });
    }
  };

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div className={"tableStyle"}>
          <div>
            <div className={"Cell1"}> Player 1</div>
            <div className={"Cell2"}> Player 2</div>
          </div>
        </div>
        <div>
          <div className={"boardStyle"}>
            <div className={"leftStyle"} />
            <div className={"rightStyle"} />
            <Ball p={this.state.ballPos} />
            <Paddle p={this.state.leftPaddlePos} color={"blue"} />
            <Paddle p={this.state.rightPaddlePos} color={"red"} />
          </div>
        </div>
        <div className={"tableStyle"}>Scores</div>
        <div className={"tableStyle"}>
          <div>
            <div className={"Cell1"}> {this.state.score[0]} </div>
            <div className={"Cell2"}> {this.state.score[1]} </div>
          </div>
        </div>
        <div className={"tableStyle"}>
          <div>
            <div className={"Cell1"}>
              <button onClick={this.pauseGame}>
                {this.state.pauseButtonText}
              </button>
            </div>
            <div className={"Cell2"}>
              <button onClick={this.resetGame}> Restart</button>
            </div>
          </div>
        </div>
        <div className={"tableStyle"}>
          {" "}
          Controls
          <div className={"Cell1"} style={{ color: "blue" }}>
            <ul>
              <li>Up: w</li>
              <li>Down: s</li>
            </ul>
          </div>
          <div className={"Cell2"} style={{ color: "red" }}>
            <ul>
              <li>Up: &uarr;</li>
              <li>Down: &darr;</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
