const app = require("application");
const applicationSettings = require("application-settings");

const Observable = require("tns-core-modules/data/observable").Observable;

const lib = require("../shared/lib");
const dedjs = lib.dedjs;
const Convert = dedjs.Convert;
const ScanToReturn = lib.scan_to_return;
const User = require("../shared/lib/dedjs/object/user/User").get;
const Kyber = require("@dedis/kyber-js");
const schnorr = Kyber.sign.schnorr;
const nist = Kyber.curve.nist;
const Blake = require("@stablelib/blake2xs").BLAKE2Xs;

const HomeViewModel = require("./home-view-model");


/**
 * Called whenever this page is opened by the user.
 * @param args given by context
 */
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();

    // here we bind the observable server property to a listener to refresh the displayed info
    page.bindingContext.addEventListener(Observable.propertyChangeEvent, (args) => {
        console.log("propertyChangeEvent [eventName]: ", args.eventName);
        console.log("propertyChangeEvent [propertyName]: ", args.propertyName);
        console.log("propertyChangeEvent [value]: ", args.value);
        console.log("propertyChangeEvent [oldValue]: ", args.oldValue);

        switch (args.propertyName) {
            case "server":
                page.bindingContext.isServerEmpty = args.value === null || args.value === undefined || args.value === "";
                if (!page.bindingContext.isServerEmpty) {
                    // set the server info and store the server
                    applicationSettings.setString("server", Convert.serverIdentityToJson(args.value));
                    User.addServer(args.value);
                    loadServerStats(args.value, page.bindingContext);
                }
                else {
                    applicationSettings.setString("server", "");
                }
                console.log("serverToStore saved is ", args.value);
                break;
            default:
                break;
        }
    });
    // we load the stored JSON server info and check if it's valid
    const storedServer = applicationSettings.getString("server");
    console.log("storedServer is ", storedServer);
    if (storedServer !== undefined && storedServer !== null && storedServer !== "") {
        page.bindingContext.server = Convert.parseJsonServerIdentity(storedServer);
        User.addServer(page.bindingContext.server);
        loadServerStats(page.bindingContext.server, page.bindingContext);
    }
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

/**
 * Scans a provided QRCode and pushes the scanned text in the conode list.
 * @param args given by the fab-button's context when 'onTap' is called
 */
function scanQRCode(args) {
    const page = args.object;
    ScanToReturn.scan().then((string) => {
        let conode;

        try {
            conode = Convert.parseJsonServerIdentity(string);
        }
        catch (error) {
            console.log(`Error parsing JSON : ${string} (${error})`);
        }

        if (conode === undefined) {
            console.log(`Attempting TOML parsing... : ${string}`);
            try {
                conode = Convert.parseTomlRoster(string).list[0];
            }
            catch (error) {
                console.log(`Error parsing TOML : ${string} (${error})`);
            }
        }

        if (conode === undefined) {
            return Promise.reject("parsing error");
        }
        page.bindingContext.set("server", conode);
    });
}

/**
 * Deletes the server by setting to 'undefined' in the binding context
 * @param args given by the context
 */
function deleteServer(args) {
    console.log("Deleting server...");
    const page = args.object;
    page.bindingContext.set("server", undefined);
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

function startSchnorrBenchmark(args) {
    console.log("Starting Schnorr benchmark...");

    const group = new nist.Curve(nist.Params.p256);
    const secretKey = group.scalar().pick();
    const publicKey = group.point().mul(secretKey, null);

    const t0 = new Date().getMilliseconds();

    let i;
    let verificationError = false;
    for (i = 0; i < 1000; i++) {
        const message = new Uint8Array([i, i + 1, i + 2, i + 3]);

        const sig = schnorr.sign(group, secretKey, message);
        verificationError = !schnorr.verify(group, publicKey, message, sig);
        if (verificationError) {
            break;
        }
        if (i % 100 === 0) {
            console.log(`Benchmark: ${100 * i / 1000}%`);
        }
    }
    if (verificationError) {
        console.log(`An error occurred while verifying signatures (i=${i})`);

    }
    else {
        const t1 = new Date().getTime();
        const text = `Benchmark completed in ${t1 - t0} ms.`;
        console.log(text);
    }
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.scanQRCode = scanQRCode;
exports.deleteServer = deleteServer;
exports.startSchnorrBenchmark = startSchnorrBenchmark;
