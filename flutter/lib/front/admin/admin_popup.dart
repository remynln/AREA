import 'dart:developer';

import 'package:area/api/answer/user_answer.dart';
import 'package:area/front/admin/user_admin_popup.dart';
import 'package:flutter/material.dart';

import 'package:area/api/request.dart';

List<Widget> getUsersWidgets(String token, context, StateSetter setStateParent, List<UserAnswer>? answer, String search) {
  List<Widget> list = [];

  if (answer == null || answer == []) {
    return [];
  }
  for (var element in answer!) {
    if (!element.username.toUpperCase().contains(search.toUpperCase())) {
      continue;
    }
    list.add(Container(
        constraints: BoxConstraints(minHeight: 100, minWidth: 290),
        padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
        color: Colors.transparent,
        child: ElevatedButton(
            onPressed: () {
              openUserAsAdmin(token, context, setStateParent, element);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStatePropertyAll(
                    Color.fromRGBO(100, 100, 100, 100)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24.0)))),
            child: Column(children: [
              SizedBox(height: 10),
              Text(element.username,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: Colors.white,
                      fontFamily: "Roboto",
                      fontWeight: FontWeight.bold,
                      fontSize: 20)),
              SizedBox(height: 10),
              Text(element.email,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: Colors.white, fontFamily: "Roboto", fontSize: 15)),
              SizedBox(height: 10)
            ]))));
  }
  return list;
}

void openAdmin(String token, context) {
  TextEditingController search = TextEditingController();

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
            title: Text(
              "Admin page",
              style: const TextStyle(fontSize: 24.0, color: Colors.white),
              textAlign: TextAlign.center,
            ),
            content: SizedBox(
                height: 440,
                width: 300,
                child: FutureBuilder(
                  future: ApiService().getUsers(token),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.done && snapshot.data != null) {
                      return Column(children: [
                        Row(children: [
                          Expanded(
                              child: Padding(
                                  padding: EdgeInsets.only(left: 25),
                                  child: TextField(
                                    controller: search,
                                    textInputAction: TextInputAction.go,
                                    onSubmitted: ((String value) => setState(() {})),
                                    style: const TextStyle(color: Colors.white),
                                    textAlign: TextAlign.center,
                                    decoration: InputDecoration(
                                      border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(14.0)),
                                      filled: true,
                                      hintStyle: const TextStyle(
                                          color:
                                              Color.fromRGBO(148, 163, 184, 1),
                                          fontStyle: FontStyle.italic),
                                      hintText: "Search username",
                                      fillColor:
                                          const Color.fromRGBO(68, 68, 68, 1),
                                    ),
                                  ))),
                          SizedBox(width: 10),
                          IconButton(
                              padding: EdgeInsets.only(right: 20),
                              onPressed: (() => setState(() {})),
                              icon: Icon(Icons.search, color: Colors.white))
                        ]),
                        SizedBox(height: 10),
                        Expanded(
                            child: SingleChildScrollView(
                                padding: EdgeInsets.only(top: 10),
                                scrollDirection: Axis.vertical,
                                clipBehavior: Clip.antiAlias,
                                child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: getUsersWidgets(
                                        token, context, setState, snapshot.data, search.text))))
                      ]);
                    } else if (snapshot.connectionState == ConnectionState.done) {
                      return Container();
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
