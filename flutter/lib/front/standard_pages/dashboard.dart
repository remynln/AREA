import 'dart:convert';
import 'dart:ui';

import 'package:area/front/standard_pages/pages.dart';
import 'package:area/front/standard_pages/settings_popup.dart';
import 'package:area/front/standard_pages/user_popup.dart';
import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';

import 'package:area/api/service/service_display.dart';
import 'package:area/api/area/area_display.dart';

import '../admin/admin_popup.dart';

class DashboardWidget extends StatefulWidget {
  final String token;

  const DashboardWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<DashboardWidget> createState() => _DashboardWidgetState();
}

class _DashboardWidgetState extends State<DashboardWidget> {
  bool _isBasicService = true;
  String user = "User";
  bool isAdmin = false;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    try {
      String token_info;
      token_info = widget.token.split('.')[1];
      token_info += token_info.length % 4 == 0 ? '' : (token_info.length % 4 == 3 ? '=' : '==');
      user = jsonDecode(utf8.fuse(base64).decode(token_info))["username"];
      isAdmin = jsonDecode(utf8.fuse(base64).decode(token_info))["admin"];
    } catch (e) {
      print(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: ListView(children: <Widget>[
        Row(children: <Widget>[
          Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Padding(
                    padding: const EdgeInsetsDirectional.only(start: 20),
                    child: Text("Hello $user !",
                        style: TextStyle(
                            fontSize: 26,
                            color: Colors.white,
                            fontFamily: "RobotoMono",
                            fontWeight: FontWeight.bold))),
                const SizedBox(height: 8),
                const Padding(
                    padding: EdgeInsetsDirectional.only(start: 20),
                    child: Text("Welcome back on Sergify.",
                        style: TextStyle(
                            fontSize: 16,
                            color: Color.fromRGBO(200, 200, 200, 100),
                            fontFamily: "RobotoMono")))
              ]),
          Spacer(),
          IconButton(
                  onPressed: () {
                    openSettings(widget.token, isAdmin, context, setState);
                  },
                  splashRadius: 22,
              style: ButtonStyle(
                side: MaterialStatePropertyAll(BorderSide(width: 0.2))
              ),
                  icon: const Icon(Icons.settings_outlined,
                      size: 30,
                      color: Colors.white)),
          SizedBox(width: 5)
        ]),
        const SizedBox(height: 40),
        Row(
          children: <Widget>[
            const Padding(
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
        SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(children: <Widget>[
              GestureDetector(
                  onTap: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                PagesWidget(token: widget.token, index: 1)));
                  },
                  child: SvgPicture.asset("assets/dashboard/add.svg",
                      alignment: Alignment.topLeft)),
              SizedBox(width: 5),
              AreaDisplay(token: widget.token, isDashboardDisplay: true),
            ])),
        SizedBox(height: 20),
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
        ServiceDisplay(isBasicService: _isBasicService, token: widget.token, setStateParent: setState),
      ])),
    );
  }
}
