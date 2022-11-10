import 'package:area/api/area/area_display.dart';
import 'package:flutter/material.dart';
import 'package:area/supplemental/anim_delay.dart';

class WorkflowsWidget extends StatefulWidget {
  final String token;

  const WorkflowsWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<WorkflowsWidget> createState() => _WorkflowsWidgetState();
}

class _WorkflowsWidgetState extends State<WorkflowsWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
                DelayedAnimation(
                delay: 800,
      child : const Padding(
          padding: EdgeInsetsDirectional.only(start: 20),
          child: Text("Workflows",
              style: TextStyle(
                  fontSize: 26,
                  color: Colors.white,
                  fontFamily: "RobotoMono",
                  fontWeight: FontWeight.bold)))),
      SizedBox(height: 30),
            DelayedAnimation(
                delay: 1000,
      child : AreaDisplay(token: widget.token, isDashboardDisplay: false)
            )])));
  }
}
