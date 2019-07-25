import React from "react";
import { render } from "react-dom";
import Toast from "../src/Toast/Toast";

class App extends React.Component {
  componentDidMount(){
    setTimeout( Toast.show('test toast'),500)
  }
  render(){
    return <div>sadasd</div>
  }
}

render(<App />, document.getElementById("root"));
