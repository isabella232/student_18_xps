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
import ch.epfl.dedis.lib.ServerIdentity;
import ch.epfl.dedis.lib.exception.CothorityCommunicationException;
import ch.epfl.dedis.status.StatusRPC;
import ch.epfl.dedis.lib.proto.OnetProto;
import ch.epfl.dedis.lib.proto.StatusProto;

import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;

import org.json.JSONObject;
import org.json.JSONException;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.security.SecureRandom;
import java.util.Map;
import java.net.URI;
import java.net.URISyntaxException;

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
                        } else if (call.method.equals("getConodeStatus")){
                            try {
                                String jsonStr = call.argument("json");
                                JSONObject json= new JSONObject(jsonStr);
                                String address = json.getString("address");
                                String pub = json.getString("public");
                                ServerIdentity id = new ServerIdentity(buildURI(address), pub);
                                result.success(getConodeStatus(id));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            } catch (CothorityCommunicationException e) {
                                e.printStackTrace();
                            }
                        } else {
                            result.notImplemented();
                        }
                    }
                });
    }

    private boolean schnorrSignAndVerify()

    {

        byte[] msg = [0,1,2,3];
        byte[] sigBuf = Hex.parseHexBinary("b95fc52a5fd2e18aa7ace5b2250c2a25e368f75c148ea3403c8f32b5f100781b" +
                "362c668aab4cf50eafdc2fcf45214c0dfbe86fce72e4632158c02c571e977306");
        SchnorrSig sig = new SchnorrSig(sigBuf);
        Point pub = new Ed25519Point("59d7fd947fc88e47d3f878e82e26629dea7a28e8d4233f11068a6b464e195bfd");
        Scalar s = new Ed25519Scalar(new byte[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1});
        return sig.verify(msg, pub);
    }

    /**
     * Make an RPC to the conode identified by its server identity (sid) to get its status.
     * @param sid The server identity of the conode.
     * @return a map of status information
     * @throws CothorityCommunicationException if something went wrong
     */
    private static String getConodeStatus(ServerIdentity sid) throws CothorityCommunicationException {
        try {
            StatusProto.Request.Builder b = StatusProto.Request.newBuilder();
            ByteString msg = ByteString.copyFrom(sid.SendMessage("Status/Request", b.build().toByteArray()));

            StatusProto.Response resp = StatusProto.Response.parseFrom(msg);
            Map<String, OnetProto.Status> statusMap = resp.getStatusMap();
            JSONObject jsonData = getJsonFromMap(statusMap.get("Db").getFieldMap());
            return jsonData.toString(4);
        } catch (InvalidProtocolBufferException e) {
            throw new CothorityCommunicationException(e);
        } catch (JSONException e) {
            throw new IllegalArgumentException("Malformed JSON");
        }
    }

    private static JSONObject getJsonFromMap(Map<String, ?> map) throws JSONException {
        JSONObject jsonData = new JSONObject();
        for (String key : map.keySet()) {
            Object value = map.get(key);
            if (value instanceof Map<?, ?>) {
                value = getJsonFromMap((Map<String, String>) value);
            }
            jsonData.put(key, value);
        }
        return jsonData;
    }

    private static URI buildURI(String str) {
        try {
            return new URI(str);
        } catch (URISyntaxException e) {
            throw new IllegalStateException("Unable to setup test services", e);
        }
    }
}
