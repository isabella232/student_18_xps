import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:barcode_scan/barcode_scan.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(new MyApp());

const String DEFAULT_CONODE_TEXT =
    'You have no conode stored. Feel free to add one!';

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Flutter Demo',
      theme: new ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or press Run > Flutter Hot Reload in IntelliJ). Notice that the
        // counter didn't reset back to zero; the application is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: new MyHomePage(title: 'XPS - Flutter'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  static const platform = const MethodChannel('ch.epfl.dedis/cothority');

  String _conodeJSON = "";
  bool errorScanning = false;
  String benchmarkStatus = "Start benchmark by pressing the floating button (1000 Schnorr's signatures and validations).";


  @override
  void initState() {
    super.initState();
    _loadJSON();
  }

  //Loads the conode JSON info saved in memory
  _loadJSON() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _conodeJSON = (prefs.getString('conodeJSON') ?? "");
      this.errorScanning = false;
    });
  }

  //Saves the conode JSON to memory
  _saveJSON() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      prefs.setString('conodeJSON', _conodeJSON);
    });
  }

  //Delete the conode JSON stored in memory
  _deleteJSON() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      prefs.remove('conodeJSON');
      this._conodeJSON = "";
      this.errorScanning = false;
    });
  }

  Future scan() async {
    try {
      String barcode = await BarcodeScanner.scan();
      setState(() {
        this._conodeJSON = barcode;
        this.errorScanning = false;
      });
      _saveJSON();
    } on PlatformException catch (e) {
      if (e.code == BarcodeScanner.CameraAccessDenied) {
        setState(() {
          this._conodeJSON = 'The user did not grant the camera permission!';
        });
      } else {
        setState(() {
          this._conodeJSON = 'Unknown error: $e';
        });
      }
      setState(() => this.errorScanning = true);
    } on FormatException {
      setState(() {
        this._conodeJSON =
            'null (User returned using the "back"-button before scanning anything. Result)';
        this.errorScanning = true;
      });
    } catch (e) {
      setState(() {
        this._conodeJSON = 'Unknown error: $e';
        this.errorScanning = true;
      });
    }
  }

  Future<Null> startBenchmark() async {
    String benchmarkStatus = "Benchmark started...";
    int start = new DateTime.now().millisecondsSinceEpoch;
    for (int i=0; i <1000; i++){
      try {
        final bool signValid = await platform.invokeMethod('schnorrSignAndVerify');
        if (signValid) {
          benchmarkStatus = "Benchmark: ${100*i/1000}%";
        }
      } on PlatformException catch (e) {
        benchmarkStatus = "Failed to start Schnorr's signature benchmark '${e.message}'.";
      }

      setState(() {
        this.benchmarkStatus = benchmarkStatus;
      });
    }
    int end = new DateTime.now().millisecondsSinceEpoch;
    setState(() {
      this.benchmarkStatus = "Benchmark completed in ${end - start}ms";
    });

  }


  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: new AppBar(
          // Here we take the value from the MyHomePage object that was created by
          // the App.build method, and use it to set our appbar title.
          title: new Text(widget.title),
          bottom: TabBar(
            tabs: [
              Tab(text: "Conode Status"),
              Tab(text: "Benchmark"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            Scaffold(
              floatingActionButton: (_conodeJSON == "" || errorScanning
                  ? new FloatingActionButton(
                      onPressed: scan,
                      tooltip: 'Add',
                      child: new Icon(Icons.add),
                    )
                  : new FloatingActionButton(
                      backgroundColor: Color.fromARGB(255, 255, 0, 0),
                      onPressed: _deleteJSON,
                      tooltip: 'Delete',
                      child: new Icon(Icons.delete),
                    )),
              body: new Center(
                child: new Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    _conodeJSON == "" || errorScanning
                        ? new Text(DEFAULT_CONODE_TEXT)
                        : new Text(
                            _conodeJSON,
                          ),
                  ],
                ),
              ),
            ),
            Scaffold(
              floatingActionButton: new FloatingActionButton(
                onPressed: startBenchmark,
                tooltip: 'Benchmark',
                child: new Icon(Icons.alarm),
              ),
              body: new Center(
                child: new Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[new Text(benchmarkStatus)],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
