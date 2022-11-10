import 'package:area/front/admin/areas_admin_popup.dart';
import 'package:flutter/material.dart';

import 'package:area/api/answer/user_answer.dart';
import 'package:area/front/standard_pages/user_popup.dart';

void openUserAsAdmin(String token, context, setStateParent, UserAnswer answer) {
  bool adminValue = false;
  TextEditingController controller = TextEditingController();

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
              "User page (ADMIN)",
              style: TextStyle(fontSize: 24.0, color: Colors.white),
              textAlign: TextAlign.center,
            ),
            content: SizedBox(
                height: 530,
                width: 300,
                child: SingleChildScrollView(
                    scrollDirection: Axis.vertical,
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: getUserInformationBasicWidgets(answer) +
                            <Widget>[
                              TextButton(
                                  onPressed: () {
                                    openAreasUserAsAdmin(token, context, setStateParent, answer.id);
                                  },
                                  style: const ButtonStyle(
                                      side:
                                          MaterialStatePropertyAll<BorderSide>(
                                              BorderSide(
                                                  color: Colors.white,
                                                  width: 1.5))),
                                  child: const Text("VIEW AREAS",
                                      style: TextStyle(color: Colors.white))),
                              const SizedBox(height: 10),
                              const Divider(color: Colors.white),
                              const SizedBox(height: 10),
                              Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 20),
                                  child: TextField(
                                    controller: controller,
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
                                      hintText: "Enter new username",
                                      fillColor:
                                          const Color.fromRGBO(68, 68, 68, 1),
                                    ),
                                  )),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text("Admin ?",
                                      style: (TextStyle(
                                          color: Colors.white,
                                          fontFamily: "Roboto"))),
                                  SizedBox(width: 10),
                                  Checkbox(
                                      checkColor: Colors.green,
                                      fillColor: const MaterialStatePropertyAll(
                                          Colors.white),
                                      value: adminValue,
                                      onChanged: (bool? value) {
                                        adminValue = value!;
                                        setState(() {});
                                      })
                                ],
                              ),
                              TextButton(
                                  onPressed: () {
                                    updateUserInformation(
                                        token, setStateParent, controller.text,
                                        user_id: answer.id,
                                        isAdmin: true,
                                        updateAdmin: adminValue);
                                  },
                                  style: const ButtonStyle(
                                      side:
                                          MaterialStatePropertyAll<BorderSide>(
                                              BorderSide(
                                                  color: Color.fromRGBO(
                                                      62, 149, 49, 100),
                                                  width: 1.5))),
                                  child: const Text("UPDATE USERNAME",
                                      style: TextStyle(
                                          color: Color.fromRGBO(
                                              62, 149, 49, 100)))),
                              const SizedBox(height: 10),
                              const Divider(color: Colors.white),
                              const SizedBox(height: 10),
                              TextButton(
                                  onPressed: () {
                                    deleteUserVerification(context, token,
                                        user_id: answer.id);
                                  },
                                  style: const ButtonStyle(
                                      side:
                                          MaterialStatePropertyAll<BorderSide>(
                                              BorderSide(
                                                  color: Color.fromRGBO(
                                                      191, 27, 44, 100),
                                                  width: 1.5))),
                                  child: const Text("DELETE ACCOUNT",
                                      style: TextStyle(
                                          color: Color.fromRGBO(
                                              191, 27, 44, 100))))
                            ]))),
          );
        });
      });
}
