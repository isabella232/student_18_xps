package dedis.epfl.ch.xpsflutter;

import android.os.Bundle;

import io.flutter.app.FlutterActivity;
import io.flutter.plugins.GeneratedPluginRegistrant;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;

import ch.epfl.dedis.lib.crypto.SchnorrSig;
import ch.epfl.dedis.lib.crypto.Point;
import ch.epfl.dedis.lib.crypto.Scalar;
import ch.epfl.dedis.lib.crypto.Ed25519Point;
import ch.epfl.dedis.lib.crypto.Ed25519Scalar;
import ch.epfl.dedis.lib.Hex;
import ch.epfl.dedis.calypso.Encryption;
import ch.epfl.dedis.lib.exception.CothorityCryptoException;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.security.SecureRandom;

public class MainActivity extends FlutterActivity {
    private static final String CHANNEL = "ch.epfl.dedis/cothority";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GeneratedPluginRegistrant.registerWith(this);

        new MethodChannel(getFlutterView(), CHANNEL).setMethodCallHandler(
                new MethodCallHandler() {
                    @Override
                    public void onMethodCall(MethodCall call, Result result) {
                        if (call.method.equals("schnorrSignAndVerify")) {
                            result.success(schnorrSignAndVerify());
                        } else {
                            result.notImplemented();
                        }
                    }
                });
    }

    private boolean schnorrSignAndVerify()

    {

        byte[] msg = "Hello Schnorr".getBytes();
        byte[] sigBuf = Hex.parseHexBinary("b95fc52a5fd2e18aa7ace5b2250c2a25e368f75c148ea3403c8f32b5f100781b" +
                "362c668aab4cf50eafdc2fcf45214c0dfbe86fce72e4632158c02c571e977306");
        SchnorrSig sig = new SchnorrSig(sigBuf);
        Point pub = new Ed25519Point("59d7fd947fc88e47d3f878e82e26629dea7a28e8d4233f11068a6b464e195bfd");
        Scalar s = new Ed25519Scalar(new byte[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1});
        return sig.verify(msg, pub);
    }
}
