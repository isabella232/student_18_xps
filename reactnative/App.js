/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ToolbarAndroid} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    title="XPS React Native"
                    titleColor={'#FFFFFF'}/>
                <Text style={styles.welcome}>You have no conode stored. Feel free to add one!</Text>
                <ActionButton
                              buttonColor='#9b59b6'
                              onPress={() => console.log("addButton tapped!")}
                              icon={<Icon name="md-add" style={styles.actionButtonIcon}/>}
                              fixNativeFeedbackRadius={true}> /* fixes feedback animation being square */
                </ActionButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    toolbar: {
        backgroundColor: '#2196F3',
        height: 56, //must set a height, see https://github.com/facebook/react-native/issues/5293
        alignSelf: 'stretch',
    },
});
