import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {Actions} from "react-native-router-flux";

class ScanScreen extends Component {
    onSuccess(e) {
        Actions.homePage({scanResult : e.data});
        /*Linking
            .openURL(e.data)
            .catch(err => console.error('An error occured', err));*/
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

const styles = StyleSheet.create({
});

export default ScanScreen;
