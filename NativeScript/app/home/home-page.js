const app = require("application");

const lib = require("../shared/lib");
const dedjs = lib.dedjs;
const Wallet = dedjs.object.pop.Wallet;
const User = dedjs.object.user.get;
const Log = dedjs.Log;
const Convert = dedjs.Convert;
const Helper = dedjs.Helper;
const ObjectType = dedjs.ObjectType;
const ScanToReturn = lib.scan_to_return;

const HomeViewModel = require("./home-view-model");


function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
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
        page.bindingContext.conodes.push({
            name: string
        });
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.scanQRCode = scanQRCode;
