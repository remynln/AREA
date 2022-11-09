import 'package:flutter/material.dart';

import 'package:area/api/request.dart';

import 'package:area/front/admin/admin_popup.dart';
import 'package:area/front/ip.dart';
import 'package:area/front/standard_pages/user_popup.dart';

import '../connection_pages/login.dart';

Widget getSettingsWidget(String title, Function function) {
  return (Container(
      constraints: BoxConstraints(minHeight: 100, minWidth: 290),
      padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
      color: Colors.transparent,
      child: ElevatedButton(
        onPressed: () {
          function();
        },
        style: ButtonStyle(
            backgroundColor:
                MaterialStatePropertyAll(Color.fromRGBO(100, 100, 100, 100)),
            shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24.0)))),
        child: Text(title,
            textAlign: TextAlign.center,
            style: TextStyle(
                color: Colors.white,
                fontFamily: "Roboto",
                fontWeight: FontWeight.bold,
                fontSize: 20)),
      )));
}

void openSettings(String token, bool isAdmin, context, setStateParent) {
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
            contentPadding: const EdgeInsets.only(top: 20.0, bottom: 10),
            title: Text(
              "Settings page",
              style: const TextStyle(fontSize: 24.0, color: Colors.white),
              textAlign: TextAlign.center,
            ),
            content: SizedBox(
                height: 300,
                width: 200,
                child: Column(children: <Widget>[
                  getSettingsWidget("IP", () {
                    openIP(context);
                  }),
                  isAdmin
                      ? getSettingsWidget("ADMIN", () {
                          openAdmin(token, context);
                        })
                      : getSettingsWidget("USER", () {
                          openUser(token, context, setStateParent);
                        }),
                  getSettingsWidget("LOGOUT", () {
                    Navigator.pushAndRemoveUntil<void>(
                        context,
                        MaterialPageRoute<void>(
                            builder: (BuildContext context) => const LoginWidget()),
                        ModalRoute.withName('/'));
                  }),
                ])),
          );
        });
      });
}
