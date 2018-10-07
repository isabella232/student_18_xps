/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import HomePage from './HomePage'
import ScanScreen from './ScanScreen'
import { Actions, Router, Scene } from "react-native-router-flux";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="homePage" component={HomePage} hideNavBar />
                    <Scene key="scanScreen" component={ScanScreen} hideNavBar/>
                </Scene>
            </Router>
        );
    }
}

export default App;
