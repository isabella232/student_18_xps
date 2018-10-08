import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {Actions} from "react-native-router-flux";
import "./HomePage"
import {saveConodeJSON} from "./HomePage";

class ScanScreen extends Component {

    /**
     * Triggered when the QR Code scanner reads a code successfully. It saves the JSON info into memory and goes back
     * to home page
     * @param e read data from QR Code
     */
    onSuccess(e) {
        console.debug("Scanned: " + e.data);
        saveConodeJSON(e.data);
        Actions.homePage();
    }

    render() {
        return (
            <QRCodeScanner
                onRead={this.onSuccess.bind(this)}
                topContent={
                    <Text>
                        Scan the conode QR Code
                    </Text>
                }
            />
        );
    }
}

const styles = StyleSheet.create({});

export default ScanScreen;
