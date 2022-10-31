import 'dart:ui';

import 'package:area/front/standard_pages/pages.dart';
import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';

import 'package:area/api/service/service_display.dart';

class DashboardWidget extends StatefulWidget {
  final String token;

  const DashboardWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<DashboardWidget> createState() => _DashboardWidgetState();
}

class _DashboardWidgetState extends State<DashboardWidget> {
  bool _isBasicService = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: ListView(children: <Widget>[
        Row(children: <Widget>[
          Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const <Widget>[
                Padding(
                    padding: EdgeInsetsDirectional.only(start: 20),
                    child: Text("Hello User !",
                        style: TextStyle(
                            fontSize: 26,
                            color: Colors.white,
                            fontFamily: "RobotoMono",
                            fontWeight: FontWeight.bold))),
                SizedBox(height: 8),
                Padding(
                    padding: EdgeInsetsDirectional.only(start: 20),
                    child: Text("Welcome back on Sergify.",
                        style: TextStyle(
                            fontSize: 16,
                            color: Color.fromRGBO(95, 100, 126, 100),
                            fontFamily: "RobotoMono")))
              ]),
          Spacer(),
          Padding(
              padding: EdgeInsetsDirectional.only(end: 10),
              child: IconButton(
                  onPressed: () {
                    print("HERE!");
                  },
                  splashRadius: 22,
                  iconSize: 50,
                  icon: const Icon(Icons.account_circle_rounded,
                      color: Colors.white))),
        ]),
        SizedBox(height: 40),
        Row(
          children: <Widget>[
            Padding(
                padding: EdgeInsetsDirectional.only(start: 20),
                child: Text("Workflows",
                    style: TextStyle(
                        fontSize: 26,
                        color: Colors.white,
                        fontFamily: "RobotoMono",
                        fontWeight: FontWeight.bold))),
            Spacer(),
            Padding(
                padding: EdgeInsetsDirectional.only(end: 20),
                child: TextButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  PagesWidget(token: widget.token, index: 2)));
                    },
                    child: const Text("View All",
                        style: TextStyle(
                            color: Color.fromRGBO(238, 13, 36, 100),
                            fontSize: 14,
                            fontFamily: "Poppins")))),
          ],
        ),
        GestureDetector(
            onTap: () {
              print("coucou");
            },
            child: SvgPicture.asset("assets/dashboard/add.svg",
                alignment: Alignment.topLeft)),
        SizedBox(height: 25),
        Row(children: <Widget>[
          Padding(
              padding: EdgeInsetsDirectional.only(start: 15),
              child: TextButton(
                  onPressed: () => setState(() {
                        if (_isBasicService) {
                          return;
                        }
                        _isBasicService = true;
                      }),
                  child: Text("Basic Services",
                      style: TextStyle(
                          color: _isBasicService ? Colors.white : Colors.grey,
                          fontFamily: "Roboto",
                          fontWeight: FontWeight.bold,
                          fontSize: 20)))),
          TextButton(
              onPressed: () => setState(() {
                    if (_isBasicService == false) {
                      return;
                    }
                    _isBasicService = false;
                  }),
              child: Text("Game Services",
                  style: TextStyle(
                      color: _isBasicService ? Colors.grey : Colors.white,
                      fontFamily: "Roboto",
                      fontWeight: FontWeight.bold,
                      fontSize: 20)))
        ]),
        SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ServiceDisplay(isBasicService: _isBasicService)),
      ])),
    );
  }
}
