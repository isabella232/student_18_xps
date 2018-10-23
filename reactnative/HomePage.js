/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, ToolbarAndroid} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions, Router, Scene} from "react-native-router-flux";
import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';

const lib = require("./shared/lib");
const dedjs = lib.dedjs;
const Convert = dedjs.Convert;
const UserClass = dedjs.object.user;
const User = new UserClass();
User.load();

const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: null,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
        //unused mechanism for this app
    }
});

/**
 * Saves the given conodeJSON into memory
 * @param conodeJSON JSON containing information about a conode
 */
function saveConodeJSON(conodeJSON) {
    storage.save({
        key: 'conode',   // Note: Do not use underscore("_") in key!
        data: conodeJSON,
    });
    console.debug("Saved conodeJSON!");
}

/**
 * Triggers the loading of server stats to be displayed
 * @param server
 * @param context
 */
function loadServerStats(server, context) {
    User.getRosterStatus().then((value) => {
        const conodeAndStatusPair = User._statusList[0];
        if (conodeAndStatusPair !== undefined) {
            context.statsList.empty();
            context.statsList.load(conodeAndStatusPair);
        }
    });
}


class HomePage extends Component {

    // /!\ Constructor is called again when the app goes back to the HomePage with Actions.homePage() !
    constructor() {
        super();
        this.state = {
            conodeJSON: null,
            conode: null
        };
        // here we check the memory and load the stored conode if any.
        storage.load({
            key: 'conode',
        }).then(ret => {
            // found data go to then()
            this.setState({conodeJSON: ret});
            this.setState({conode: Convert.parseJsonServerIdentity(ret)});

            //TODO fix this failing silently
            User.addServer(this.state.conode);

            console.debug("Saved conode loaded: " + ret);
        }).catch(err => {
            // any exception including data not found
            // goes to catch()
            console.debug("No conode stored!");
            this.setState({conodeJSON: null});
        });
        console.debug("HomePage - constructor called");
    }

    /**
     * Deletes the stored conode JSON info from the memory and reset its corresponding state (triggering a UI refresh)
     */
    deleteConode() {
        storage.remove({
            key: 'conode'
        });
        this.setState({conodeJSON: null});
        console.debug("Removed stored conode.");
    }

    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    title="XPS React Native"
                    titleColor={'#FFFFFF'}/>
                <Text style={styles.welcome}>
                    {this.state.conodeJSON ? this.state.conodeJSON : "You have no conode stored. Feel free to add one!"}
                </Text>
                <FlatList
                    data={[{key: 'a'}, {key: 'b'}]}
                    renderItem={({item}) => <Text>{item.key}</Text>}
                />
                {this.state.conodeJSON == null ?
                    // The floating action button to ADD a conode server, opens the QR Code scanner
                    <ActionButton
                        buttonColor='#2196F3'
                        renderIcon={active => (<Icon name="md-add" style={styles.actionButtonIcon}/>)}
                        fixNativeFeedbackRadius={true}
                        hide={!this.state.conodeJSON} /* fixes feedback animation being square */
                        onPress={() => Actions.scanScreen()}>
                    </ActionButton> :
                    // The floating action button to REMOVE a conode server
                    <ActionButton
                        buttonColor='#ff3300'
                        hide={this.state.conodeJSON}
                        renderIcon={active => (<Icon name="md-trash" style={styles.actionButtonIcon}/>)}
                        fixNativeFeedbackRadius={true} /* fixes feedback animation being square */
                        onPress={() => this.deleteConode()}>
                    </ActionButton>
                }
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


export default HomePage;
exports.saveConodeJSON = saveConodeJSON;

