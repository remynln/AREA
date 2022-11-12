import 'dart:core';

import 'package:area/api/request.dart';
import 'package:flutter/material.dart';

import 'package:area/front/standard_pages/settings_popup.dart';

import 'package:area/api/answer/area_answer.dart';
import 'package:area/api/area/area_popup.dart';
import 'package:area/api/endpoints.dart';

List<Widget> getAreasFromUser(
    String token, context, setStateParent, List<AreaAnswer>? answer) {
  List<Widget> list = [];

  if (answer == null || answer == [] || answer.length == 0) {
    return [Text("NO AREAS", style: TextStyle(color: Colors.white, fontFamily: "Roboto"))];
  }
  for (AreaAnswer area in answer) {
    list.add(getSettingsWidget(area.title, () {
      openArea(token, context, setStateParent, area);
    }));
  }
  return (list);
}

void openAreasUserAsAdmin(
    String token, context, setStateParent, String user_id) {
  showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setState) {
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
            title: const Text(
              "Areas page (ADMIN)",
              style: TextStyle(fontSize: 24.0, color: Colors.white),
              textAlign: TextAlign.center,
            ),
            content: SizedBox(
                height: 530,
                width: 300,
                child: FutureBuilder(
                  future: ApiService().getUserAreas(token, user_id: user_id),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.done) {
                      return SingleChildScrollView(
                          padding: EdgeInsets.only(top: 10),
                          scrollDirection: Axis.vertical,
                          clipBehavior: Clip.antiAlias,
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: getAreasFromUser(token, context, setStateParent, snapshot.data)));
                    } else {
                      return const Center(
                          child:
                              CircularProgressIndicator(color: Colors.white));
                    }
                  },
                )),
          );
        });
      });
}
