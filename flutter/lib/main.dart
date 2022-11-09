import 'package:flutter/material.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';

import 'package:area/front/connection_pages/login.dart';
import 'package:area/front/connection_pages/register.dart';
import 'package:page_transition/page_transition.dart';

void main() => runApp(MaterialApp(
    title: "Sergify",
    theme: ThemeData(scaffoldBackgroundColor: Colors.black),
    initialRoute: '/',
    routes: {
      '/login': (context) => const LoginWidget(),
      '/register': (context) => const RegisterWidget()
    },
    home: AnimatedSplashScreen(
      splash: 'assets/sergify.png',
      splashIconSize: double.infinity,
      backgroundColor: Colors.black,
      nextScreen: const LoginWidget(),
      splashTransition: SplashTransition.fadeTransition,
      pageTransitionType: PageTransitionType.bottomToTop,
      duration: 3000,
    )));
