const app = require("application");

const Observable = require("tns-core-modules/data/observable").Observable;

const lib = require("../shared/lib");
const dedjs = lib.dedjs;
const Convert = dedjs.Convert;
const ScanToReturn = lib.scan_to_return;
const ServerIdentity = require("../shared/cothority/lib/identity");

const HomeViewModel = require("./home-view-model");


function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();

    page.bindingContext.addEventListener(Observable.propertyChangeEvent, (args) => {
        // args is of type PropertyChangeData
        console.log("propertyChangeEvent [eventName]: ", args.eventName);
        console.log("propertyChangeEvent [propertyName]: ", args.propertyName);
        console.log("propertyChangeEvent [value]: ", args.value);
        console.log("propertyChangeEvent [oldValue]: ", args.oldValue);
        page.getViewById("conodeLabel").text = args.value.toString();
    });
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

        page.bindingContext.server = conode;
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.scanQRCode = scanQRCode;
