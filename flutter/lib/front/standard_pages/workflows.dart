import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';

import 'package:area/api/service/service_display.dart';
import 'package:area/front/ip.dart';

class WorkflowsWidget extends StatefulWidget {
  const WorkflowsWidget({Key? key}) : super(key: key);

  @override
  State<WorkflowsWidget> createState() => _WorkflowsWidgetState();
}

class _WorkflowsWidgetState extends State<WorkflowsWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: ListView(children: const <Widget>[
      Text("Currently working on...\nPlease wait :)",
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white, fontSize: 24))
    ])));
  }
}
