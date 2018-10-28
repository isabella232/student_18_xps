require("globals"); // necessary to bootstrap tns modules on the new thread

global.onmessage = function(msg) {
    console.log("Starting Schnorr benchmark...");
    const Kyber = msg.data.kyber;
    console.log("Loaded Kyber");
    const schnorr = Kyber.sign.schnorr;
    console.log("Loaded schnorr");
    const nist = Kyber.curve.nist;
    console.log("Loaded nist");

    const group = new nist.Curve(nist.Params.p256);
    const secretKey = group.scalar().pick();
    const publicKey = group.point().mul(secretKey, null);

    const t0 = new Date().getMilliseconds();

    let i;
    let verificationError = false;
    const statusMsg = {
        status : 0,
        success: true,
        time: -1,
        errorMsg: ""
    };

    for (i = 0; i < 1000; i++) {
        const message = new Uint8Array([i, i + 1, i + 2, i + 3]);

        const sig = schnorr.sign(group, secretKey, message);

        verificationError = !schnorr.verify(group, publicKey, message, sig);

        statusMsg.status = 100 * i / 1000;
        statusMsg.success = !verificationError;
        statusMsg.time = new Date().getTime() - t0;

        global.postMessage(statusMsg);

        if (verificationError) {
            statusMsg.errorMsg = `An error occurred while verifying signature (i=${i})`;
            break;
        }

        if (i % 100 === 0) {
            console.log(`Benchmark: ${100 * i / 1000}%`);
        }
    }
};
