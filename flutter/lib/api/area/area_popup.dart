import 'dart:convert';

import 'package:area/api/request.dart';
import 'package:flutter/material.dart';

import 'package:area/api/endpoints.dart';
import 'package:area/api/answer/area_answer.dart';

Color getColorByStatus(String status) {
  if (status == "starting" || status == "started") {
    return (Color.fromRGBO(62, 149, 49, 100));
  } else if (status == "stopping" || status == "stopped") {
    return (Color.fromRGBO(191, 27, 44, 100));
  } else if (status == "locked") {
    return (Colors.white);
  }
  return (Colors.orangeAccent);
}

void deleteArea(String token, String area_id, setStateParent) async {
  await ApiService().deleteArea(token, area_id);
  setStateParent((){});
}

void openArea(String token, context, setStateParent, AreaAnswer answer) {
  showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: Color.fromRGBO(60, 60, 60, 1),
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(
                30.0,
              ),
            ),
          ),
          contentPadding: const EdgeInsets.only(
            top: 10.0,
          ),
          title: Text(
            "Your Workflow",
            style: const TextStyle(fontSize: 24.0, color: Colors.white),
            textAlign: TextAlign.center,
          ),
          content: SizedBox(
            height: 240,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text("Title: ${answer.title}",
                      style: TextStyle(
                          color: Colors.white,
                          fontFamily: "Roboto",
                          fontWeight: FontWeight.bold,
                          fontSize: 20)),
                  SizedBox(height: 5),
                  Text("Description: ${answer.description}",
                      style: TextStyle(
                          color: Colors.white,
                          fontFamily: "Roboto",
                          fontSize: 15)),
                  SizedBox(height: 10),
                  Divider(color: Colors.white),
                  SizedBox(height: 10),
                  Center(
                      child: Text("Status: ${answer.status}",
                          style: TextStyle(
                              color: getColorByStatus(answer.status)))),
                  SizedBox(height: 10),
                  Divider(color: Colors.white),
                  SizedBox(height: 10),
                  Text("Action: ${answer.action}",
                      style: TextStyle(color: Colors.white)),
                  Text("Action parameters: ${answer.action_params}",
                      style: TextStyle(color: Colors.white)),
                  SizedBox(height: 10),
                  Divider(color: Colors.white),
                  SizedBox(height: 10),
                  Text("Reaction: ${answer.reaction}",
                      style: TextStyle(color: Colors.white)),
                  Text("Reaction parameters: ${answer.reaction_params}",
                      style: TextStyle(color: Colors.white)),
                  SizedBox(height: 10),
                  Divider(color: Colors.white),
                  SizedBox(height: 10),
                  Center(
                      child: TextButton(
                          onPressed: () {
                            deleteArea(token, answer.id, setStateParent);
                            Navigator.of(context).pop();
                            },
                          style: ButtonStyle(
                              side: MaterialStatePropertyAll<BorderSide>(
                                  BorderSide(
                                      color: Color.fromRGBO(191, 27, 44, 10),
                                      width: 1.5))),
                          child: Text("DELETE",
                              style: TextStyle(
                                  color: Color.fromRGBO(191, 27, 44, 10))))),
                  SizedBox(height: 20)
                ],
              ),
            ),
          ),
        );
      });
}
