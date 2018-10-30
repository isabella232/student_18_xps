/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, ToolbarAndroid, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions, Router, Scene} from "react-native-router-flux";
import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const lib = require("./shared/lib");
const Convert = lib.dedjs.Convert;
const Net = lib.dedjs.network.NSNet;
const RequestPath = lib.dedjs.network.RequestPath;
const DecodeType = lib.dedjs.network.DecodeType;
const Helper = lib.dedjs.Helper;
const StatusExtractor = require("./shared/lib/dedjs/extractor/StatusExtractor");


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
 * TODO method not working, need to be fixed. Issue might be related to WS in react native
 * @param server
 * @param context
 */
function loadServerStats(server) {
    console.log("Loading stats for server: " + server.websocketAddr);

    const address = server.websocketAddr;
    const cothoritySocket = new Net.Socket(address, RequestPath.STATUS);
    const statusRequestMessage = {};

    Net.getServerIdentityFromAddress(server.addr)
        .then(serverIdentity => {
            cothoritySocket.send(RequestPath.STATUS_REQUEST, DecodeType.STATUS_RESPONSE, statusRequestMessage)
                .then(response => {
                    console.log("Server responded");
                    response.conode = server;
                    response.serveridentity = serverIdentity;
                    console.log("Response=", response);
                    let statsList = createStatsList(response);

                    console.log(statsList);
                    return statsList;
                })
                .catch(function (error) {
                    console.log("Error communicating with server.", error.message);
                    console.log(error.stack);
                    return {
                        status: {Generic: {field: {Version: error}}},
                        conode: server
                    }
                });
        })
        .catch(error => {
            console.log("Error getting server identity.", error);
            console.log(error.stack);
        });
}



function createStatsList(conodeStatus) {
    let statsList = [];

    const stat = {
        title: "",
        info: ""
    };

    stat.title = "Description";
    stat.info = StatusExtractor.getDescription(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Address";
    stat.info = StatusExtractor.getAddress(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "ID (hex)";
    stat.info = StatusExtractor.getID(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Public Key (hex)";
    stat.info = StatusExtractor.getPublicKey(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Services";
    stat.info = StatusExtractor.getServices(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "System";
    stat.info = StatusExtractor.getSystem(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Host";
    stat.info = StatusExtractor.getHost(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Port";
    stat.info = StatusExtractor.getPort(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "ConnectionType";
    stat.info = StatusExtractor.getConnectionType(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Version";
    stat.info = StatusExtractor.getVersion(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "TX Bytes";
    stat.info = StatusExtractor.getTXBytes(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "RX Bytes";
    stat.info = StatusExtractor.getRXBytes(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    stat.title = "Uptime";
    stat.info = StatusExtractor.getUptime(conodeStatus);
    statsList.push(Helper.deepCopy(stat));

    return statsList;
}


class HomePage extends Component {
    // Tab routes here
    ConodeStatsRoute = () => (
        <View style={styles.container}>
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
    BenchmarkRoute = () => (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                {"Start benchmark by pressing the floating button (1000 Schnorr's signatures and validations)."}
            </Text>
            <ActionButton
                buttonColor='#2196F3'
                renderIcon={active => (<Icon name="md-alarm" style={styles.actionButtonIcon}/>)}
                fixNativeFeedbackRadius={true}
                onPress={() => this.startBenchmark()}>
            </ActionButton>
        </View>
    );

    // /!\ Constructor is called again when the app goes back to the HomePage with Actions.homePage() !
    constructor() {
        super();
        this.state = {
            conodeJSON: null,
            conode: null,
            index: 0,
            routes: [
                { key: 'conodeStatsRoute', title: 'Conode status' },
                { key: 'benchmarkRoute', title: 'Benchmark' },
            ],
        };
        // here we check the memory and load the stored conode if any.
        storage.load({
            key: 'conode',
        }).then(ret => {
            // found data go to then()
            this.setState({conodeJSON: ret});
            this.setState({conode: Convert.parseJsonServerIdentity(ret)});

            try {

                loadServerStats(this.state.conode);
            }
            catch (error) {
                console.error(error);
            }


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
                    title="XPS - react-native"
                    titleColor={'#FFFFFF'}/>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        conodeStatsRoute: this.ConodeStatsRoute,
                        benchmarkRoute: this.BenchmarkRoute,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
            </View>
        );
    }

    startBenchmark() {
        //TODO run 1000 signatures in background thread
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

