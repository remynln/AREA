import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:area/front/standard_pages/create_popup/action_service.dart';
import 'package:area/front/standard_pages/create_popup/action_trigger.dart';
import 'package:area/front/standard_pages/create_popup/reaction_service.dart';
import 'package:area/front/standard_pages/create_popup/reaction_trigger.dart';

class CreateWidget extends StatefulWidget {
  final String token;

  const CreateWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<CreateWidget> createState() => _CreateWidgetState();
}

class _CreateWidgetState extends State<CreateWidget> {
  bool _actionTrigger = false;
  bool _reactionService = false;
  bool _reactionTrigger = false;

  Container displayButton(String title, bool isTrigger, Function function) {
    return Container(
      padding: EdgeInsets.only(left: 20, right: 20, bottom: 40),
      height: 270.0,
      width: 100.0,
      color: Colors.transparent,
      child: Container(
          decoration: BoxDecoration(
              color: Color.fromRGBO(100, 100, 100, 100),
              borderRadius: BorderRadius.all(Radius.circular(24))),
          child: Column(
            children: <Widget>[
              Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Text(title,
                      style: TextStyle(
                          fontSize: 23,
                          color: Colors.white,
                          fontFamily: "RobotoMono",
                          fontWeight: FontWeight.bold))),
              SizedBox(height: 20),
              ElevatedButton(
                  onPressed: () {
                    function();
                  },
                  style: ButtonStyle(
                      fixedSize:
                          const MaterialStatePropertyAll<Size>(Size(250, 120)),
                      backgroundColor: const MaterialStatePropertyAll<Color>(
                          Color.fromRGBO(80, 80, 80, 100)),
                      shape: MaterialStatePropertyAll<RoundedRectangleBorder>(
                          RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                              side: const BorderSide(color: Colors.black)))),
                  child: const Icon(Icons.add, size: 30))
            ],
          )),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
      const Padding(
          padding: EdgeInsetsDirectional.only(start: 20),
          child: Text("New Workflow",
              style: TextStyle(
                  fontSize: 26,
                  color: Colors.white,
                  fontFamily: "RobotoMono",
                  fontWeight: FontWeight.bold))),
      SizedBox(height: 50),
      displayButton("Action's Service", false, () {
        openActionService(context, widget.token);
        setState(() {
          _actionTrigger = _actionTrigger ? false : true;
        });
      }),
      _actionTrigger
          ? displayButton("Action's Trigger", true, () {
              openActionTrigger(context);

              setState(() {
                _reactionService = _reactionService ? false : true;
              });
            })
          : Container(),
      _reactionService
          ? displayButton("Reaction's Service", true, () {
              openReactionService(context);
              setState(() {
                _reactionTrigger = _reactionTrigger ? false : true;
              });
            })
          : Container(),
      _reactionTrigger
          ? displayButton("Reaction's Trigger", true, () {
              openReactionTrigger(context);
            })
          : Container()
    ])));
  }
}
