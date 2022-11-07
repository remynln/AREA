import 'dart:async';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'package:area/api/answer/login_answer.dart';
import 'package:area/api/answer/google_answer.dart';
import 'package:area/api/request.dart';

import 'package:area/front/ip.dart';
import 'package:area/front/connection_pages/register.dart';
import 'package:area/front/standard_pages/pages.dart';

import 'package:uni_links/uni_links.dart';

import 'package:fluttertoast/fluttertoast.dart';

class LoginWidget extends StatefulWidget {
  const LoginWidget({Key? key}) : super(key: key);

  @override
  State<LoginWidget> createState() => _LoginWidgetState();
}

class _LoginWidgetState extends State<LoginWidget> {
  TextEditingController nameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  late LoginAnswer? loginAnswer;
  GoogleLoginAnswer _googleLoginAnswer = GoogleLoginAnswer();

  bool _initialURILinkHandled = false;
  Uri? _initialUri;
  Uri? _currentUri;
  Object? _err;

  StreamSubscription? _streamSubscription;

  MaterialStatesController? loginController = MaterialStatesController();

  @override
  void initState() {
    _initUriHandler();
    _incomingLinkHandler();
    super.initState();
  }

  @override
  void dispose() {
    _streamSubscription?.cancel();
    nameController.dispose();
    passwordController.dispose();
    loginController!.dispose();
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
            _checkUriToken(_initialUri!.queryParameters, _initialUri!.host);
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

  void _checkUriToken(Map<String, String> query, String host) {
    if (query.containsKey("token") && host == "google") {
      setState(() {
        _googleLoginAnswer.token = query["token"]!;
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    PagesWidget(token: _googleLoginAnswer!.token.toString(), index: 0)));
      });
    } else if (query.containsKey("token")) {
      setState(() {
        loginAnswer!.token = query["token"]!;
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    PagesWidget(token: loginAnswer!.token.toString(), index: 0)));
      });
    }
  }

  void _incomingLinkHandler() {
    if (!kIsWeb) {
      _streamSubscription = uriLinkStream.listen((Uri? uri) {
        if (!mounted) return;
        print('New URI received: $uri');
        _checkUriToken(uri!.queryParameters, uri!.host);
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
    if (getCredentialsStatus() == false) return;
    loginAnswer = await ApiService()
        .handleLogin(nameController.text, passwordController.text);
    if (loginAnswer == null) {
      Fluttertoast.showToast(
          msg: "Error : Invalid IP Address!",
          timeInSecForIosWeb: 3,
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color.fromRGBO(191, 27, 44, 1),
          textColor: Colors.white,
          fontSize: 14);
    } else if (loginAnswer?.message != null) {
      Fluttertoast.showToast(
          msg: "Error : ${loginAnswer?.message}!",
          timeInSecForIosWeb: 3,
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color.fromRGBO(191, 27, 44, 1),
          textColor: Colors.white,
          fontSize: 14);
    } else {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) =>
                  PagesWidget(token: loginAnswer!.token.toString(), index: 0)));
    }
  }

  void handleGoogleLogin() async {
    try {
      await ApiService().handleGoogleLogin("sergify://google");
    } catch (e) {
      log(e.toString());
    }
  }

  bool getCredentialsStatus() {
    if (nameController.text.isEmpty || passwordController.text.length < 8)
      return false;
    return true;
  }

  Color getColor(Set<MaterialState> states) {
    if (getCredentialsStatus() == false)
      return (Colors.grey);
    else
      return (Color.fromRGBO(191, 27, 44, 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
      Container(
        height: 30,
        alignment: Alignment.topLeft,
        child: ElevatedButton(
            onPressed: () {
              openIP(context);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all<Color>(
                    const Color.fromRGBO(191, 27, 44, 1)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(9.0)))),
            child: const Text('IP')),
      ),
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
          onChanged: (_) {
            loginController!.notifyListeners();
          },
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
          onChanged: (_) {
            loginController!.notifyListeners();
          },
          obscureText: true,
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
      SizedBox(height: 20),
      Container(
        height: 45,
        padding: const EdgeInsets.symmetric(horizontal: 60),
        child: ElevatedButton(
            statesController: loginController,
            child: const Text('LOGIN'),
            onPressed: () {
              handleLogin();
              print(nameController.text);
              print(passwordController.text);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStateProperty.resolveWith(getColor),
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
          icon: Image.asset("assets/google_login.png", width: 18),
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
          style: TextStyle(fontSize: 16, color: Colors.white)),
      TextButton(
        onPressed: () {
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => const RegisterWidget()));
        },
        style: TextButton.styleFrom(
          foregroundColor: Color.fromRGBO(191, 27, 44, 1),
        ),
        child: const Text('Register here', style: TextStyle(fontSize: 16)),
      ),
    ])));
  }
}
