import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Weather from "./components/weatherComponent/weather";

class App extends React.Component {

    render() {
        return (
            <Router>
                <Route exact path="/" render={() => (
                    <Redirect to="/weather"/>
                )}/>
                <Route
                    path="/weather/:location?/:weekday?"
                    component={Weather}
                />
            </Router>
        )
    }
}
export default App;
