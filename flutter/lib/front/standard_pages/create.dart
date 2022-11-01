import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';

import 'package:area/api/service/service_display.dart';
import 'package:area/front/ip.dart';

class CreateWidget extends StatefulWidget {
  final String token;

  const CreateWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<CreateWidget> createState() => _CreateWidgetState();
}

class _CreateWidgetState extends State<CreateWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
      Padding(
          padding: EdgeInsetsDirectional.only(start: 20),
          child: Text("Create your workflow :)",
              style: TextStyle(
                  fontSize: 23,
                  color: Colors.white,
                  fontFamily: "RobotoMono",
                  fontWeight: FontWeight.bold))),
      SizedBox(height: 50),
      Container(
        padding: EdgeInsets.symmetric(horizontal: 20),
        height: 230.0,
        width: 100.0,
        color: Colors.transparent,
        child: Container(
            decoration: BoxDecoration(
                color: Color.fromRGBO(140, 140, 140, 100),
                borderRadius: BorderRadius.all(Radius.circular(10.0))),
            child: Column(
              children: <Widget>[
                Padding(
                    padding: EdgeInsets.only(top: 10),
                    child: Text("Actions services",
                        style: TextStyle(
                            fontSize: 23,
                            color: Colors.white,
                            fontFamily: "RobotoMono",
                            fontWeight: FontWeight.bold))),
                SizedBox(height: 20),
                ElevatedButton(
                    onPressed: () {
                      print("CHOOSE ACTION SERVICE");
                    },
                    child: Container(
                        height: 120.0,
                        width: 100.0,
                        color: Colors.transparent,
                        child: Container(
                            decoration: BoxDecoration(
                                color: Color.fromRGBO(140, 140, 140, 100),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(10.0))))))
              ],
            )),
      ),
      SizedBox(height: 40),
      Container(
        padding: EdgeInsets.symmetric(horizontal: 20),
        height: 230.0,
        width: 100.0,
        color: Colors.transparent,
        child: Container(
            decoration: BoxDecoration(
                color: Color.fromRGBO(140, 140, 140, 100),
                borderRadius: BorderRadius.all(Radius.circular(10.0)))),
      ),
      SizedBox(height: 40),
      Container(
        width: double.infinity,
        height: 50,
        padding: const EdgeInsets.symmetric(horizontal: 120),
        child: ElevatedButton(
          onPressed: () {
            print("NEXT");
          },
          style: ElevatedButton.styleFrom(
              backgroundColor: Color.fromRGBO(191, 27, 44, 1)),
          child: const Text(
            "NEXT",
          ),
        ),
      ),
    ])));
  }
}
