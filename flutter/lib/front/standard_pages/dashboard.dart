import 'dart:convert';
import 'dart:ui';

import 'package:area/front/standard_pages/pages.dart';
import 'package:area/front/standard_pages/settings_popup.dart';
import 'package:area/front/standard_pages/user_popup.dart';
import 'package:flutter/material.dart';
import 'package:area/supplemental/anim_delay.dart';

import 'package:flutter_svg/flutter_svg.dart';
import 'package:page_transition/page_transition.dart';
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
      token_info += token_info.length % 4 == 0
          ? ''
          : (token_info.length % 4 == 3 ? '=' : '==');
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
                DelayedAnimation(
                    delay: 0,
                    child: Padding(
                        padding: const EdgeInsetsDirectional.only(start: 20),
                        child: Text("Hello $user !",
                            style: TextStyle(
                                fontSize: 26,
                                color: Colors.white,
                                fontFamily: "RobotoMono",
                                fontWeight: FontWeight.bold)))),
                const SizedBox(height: 8),
                const DelayedAnimation(
                    delay: 100,
                    child: Padding(
                        padding: EdgeInsetsDirectional.only(start: 20),
                        child: Text("Welcome back on Sergify.",
                            style: TextStyle(
                                fontSize: 16,
                                color: Color.fromRGBO(200, 200, 200, 100),
                                fontFamily: "RobotoMono")))),
              ]),
          Spacer(),
          DelayedAnimation(
              delay: 200,
              child: IconButton(
                  onPressed: () {
                    openSettings(widget.token, isAdmin, context, setState);
                  },
                  splashRadius: 22,
                  style: ButtonStyle(
                      side: MaterialStatePropertyAll(BorderSide(width: 0.2))),
                  icon: const Icon(Icons.settings_outlined,
                      size: 30, color: Colors.white))),
          SizedBox(width: 5)
        ]),
        const SizedBox(height: 40),
        Row(
          children: <Widget>[
            const DelayedAnimation(
                delay: 300,
                child: Padding(
                    padding: EdgeInsetsDirectional.only(start: 20),
                    child: Text("Workflows",
                        style: TextStyle(
                            fontSize: 26,
                            color: Colors.white,
                            fontFamily: "RobotoMono",
                            fontWeight: FontWeight.bold)))),
            Spacer(),
            DelayedAnimation(
                delay: 400,
                child: Padding(
                    padding: EdgeInsetsDirectional.only(end: 20),
                    child: TextButton(
                        onPressed: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PagesWidget(
                                      token: widget.token, index: 2)));
                        },
                        child: const Text("View All",
                            style: TextStyle(
                                color: Color.fromRGBO(238, 13, 36, 100),
                                fontSize: 14,
                                fontFamily: "Poppins"))))),
          ],
        ),
        SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(children: <Widget>[
              DelayedAnimation(
                  delay: 500,
                  child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => PagesWidget(
                                    token: widget.token, index: 1)));
                      },
                      child: SvgPicture.asset("assets/dashboard/add.svg",
                          alignment: Alignment.topLeft))),
              SizedBox(width: 5),
              DelayedAnimation(
                delay: 600,
                child:
                    AreaDisplay(token: widget.token, isDashboardDisplay: true),
              )
            ])),
        SizedBox(height: 20),
        Row(children: <Widget>[
          DelayedAnimation(
              delay: 700,
              child: Padding(
                  padding: EdgeInsetsDirectional.only(start: 10),
                  child: Text("Services",
                      style: TextStyle(
                          color: _isBasicService ? Colors.white : Colors.grey,
                          fontFamily: "Roboto",
                          fontWeight: FontWeight.bold,
                          fontSize: 20)))),
          Spacer(),
          DelayedAnimation(
              delay: 700,
              child: Padding(
              padding: EdgeInsets.only(right: 10),
              child: TextButton(
                  onPressed: () {
                    setState(() {});
                  },
                  style: ButtonStyle(
                      side: MaterialStatePropertyAll<BorderSide>(BorderSide(
                          color: Color.fromRGBO(191, 27, 44, 10), width: 1.5))),
                  child: Text("REFRESH",
                      style:
                          TextStyle(color: Color.fromRGBO(191, 27, 44, 10), fontSize: 13)))))
        ]),
        ServiceDisplay(
            isBasicService: _isBasicService,
            token: widget.token,
            setStateParent: setState)
      ])),
    );
  }
}
