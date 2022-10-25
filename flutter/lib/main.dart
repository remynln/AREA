import 'dart:async';
import 'dart:ui';

import 'package:flutter/foundation.dart';

import 'package:flutter/material.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';

import 'package:area/front/login.dart';

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
          nextScreen: LoginWidget(),
          splashTransition: SplashTransition.fadeTransition,
          duration: 3000,
        ));
  }
}