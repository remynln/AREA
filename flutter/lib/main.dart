import 'dart:async';
import 'dart:ui';

import 'package:area/api/answer/login_answer.dart';
import 'package:area/api/answer/google_answer.dart';
import 'package:area/api/service.dart';
import 'package:flutter/foundation.dart';

import 'package:flutter/material.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:flutter/services.dart';

import 'package:uni_links/uni_links.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  static const String _title = 'Sergify';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: _title,
        theme: new ThemeData(scaffoldBackgroundColor: Colors.black),
        home: AnimatedSplashScreen(
          splash: 'assets/sergify.png',
          splashIconSize: double.infinity,
          backgroundColor: Colors.black,
          nextScreen: MyStatefulWidget(),
          splashTransition: SplashTransition.fadeTransition,
          duration: 3000,
        ));
  }
}

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({Key? key}) : super(key: key);

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  TextEditingController nameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  late LoginAnswer? loginAnswer;
  GoogleLoginAnswer _googleLoginAnswer = GoogleLoginAnswer();

  bool _initialURILinkHandled = false;
  Uri? _initialUri;
  Uri? _currentUri;
  Object? _err;

  StreamSubscription? _streamSubscription;

  @override
  void initState() {
    super.initState();
    _initUriHandler();
    _incomingLinkHandler();
  }

  @override
  void dispose() {
    _streamSubscription?.cancel();
    super.dispose();
  }

  Future<void> _initUriHandler() async {
    if (!_initialURILinkHandled) {
      _initialURILinkHandled = true;
      print("Invoked _initUriHandler");
      try {
        final initialUri = await getInitialUri();
        if (initialUri != null) {
          print("initial uri is $initialUri");
          if (!mounted) return;
          setState(() {
            _initialUri = initialUri;
          });
        } else {
          print("initial uri is null !");
        }
      } on PlatformException {
        print("Failed to received initial uri");
      } on FormatException catch (err) {
        if (!mounted) return;
        print("Bad initial uri received !");
        setState(() {
          _err = err;
        });
      }
    }
  }

  void _checkUriToken(Map<String, String> query) {
    if (query.containsKey("token")) {
      setState(() {
        _googleLoginAnswer.token = query["token"]!;
      });
    }
  }

  void _incomingLinkHandler() {
    if (!kIsWeb) {
      _streamSubscription = uriLinkStream.listen((Uri? uri) {
        if (!mounted) return;
        print('New URI received: $uri');
        _checkUriToken(uri!.queryParameters);
        setState(() {
          _currentUri = uri;
          _err = null;
        });
      }, onError: (Object err) {
        if (!mounted) return;
        print('Error occured: $err');
        setState(() {
          _currentUri = null;
          if (err is FormatException)
            _err = err;
          else
            _err = null;
        });
      });
    }
  }

  void handleLogin() async {
    loginAnswer = await ApiService()
        .handleLogin(nameController.text, passwordController.text);
    print(loginAnswer?.token);
  }

  void handleGoogleLogin() async {
    await ApiService().handleGoogleLogin("sergify://google");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
      Image.asset(
        'assets/sergify.png',
        height: 200,
        width: 500,
        fit: BoxFit.fitWidth,
        scale: 1,
      ),
      SizedBox(height: 30),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: TextField(
          controller: nameController,
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "Username or Email",
            fillColor: Color.fromRGBO(68, 68, 68, 1),
          ),
        ),
      ),
      SizedBox(height: 20),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: TextField(
          controller: passwordController,
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "Password",
            fillColor: Color.fromRGBO(68, 68, 68, 1),
          ),
        ),
      ),
      TextButton(
        onPressed: () {
          //forgot password screen
        },
        style: TextButton.styleFrom(
          foregroundColor: Colors.red,
        ),
        child: const Text(
          'Forgot Password',
        ),
      ),
      Container(
        height: 45,
        padding: const EdgeInsets.symmetric(horizontal: 60),
        child: ElevatedButton(
            child: const Text('LOGIN'),
            onPressed: () {
              handleLogin();
              print(nameController.text);
              print(passwordController.text);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStatePropertyAll<Color>(
                    Color.fromRGBO(191, 27, 44, 1)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(9.0))))),
      ),
      SizedBox(height: 30),
      Container(
          alignment: Alignment.topCenter,
          child: const Text('Or continue with',
              style: TextStyle(fontSize: 15, color: Colors.grey))),
      SizedBox(height: 10),
      Container(
        height: 45,
        padding: EdgeInsets.symmetric(horizontal: 80),
        child: ElevatedButton.icon(
          onPressed: () {
            handleGoogleLogin();
          },
          icon: Image.asset("assets/google.png", width: 18),
          style: OutlinedButton.styleFrom(
              side:
                  BorderSide(width: 1.0, color: Color.fromRGBO(191, 27, 44, 1)),
              backgroundColor: Colors.transparent),
          label: Text('Google'), // <-- Text
        ),
      ),
      SizedBox(height: 30),
      Text("Don't have an account?",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, color: Colors.white)),
      TextButton(
        onPressed: () {
          //forgot password screen
        },
        style: TextButton.styleFrom(
          foregroundColor: Color.fromRGBO(191, 27, 44, 1),
        ),
        child: const Text(
          'Register here',
          style: TextStyle(fontSize: 16)
        ),
      ),
    ])));
  }
}
