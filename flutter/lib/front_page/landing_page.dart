import 'package:flutter/material.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'login.dart';


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
        )
    );
  }
}