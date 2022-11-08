import 'package:area/api/answer/user_answer.dart';
import 'package:flutter/material.dart';

import 'package:area/api/request.dart';

Future<void> updateUserInformation(
    String token, setStateParent, String new_username) async {
  await ApiService().updateUserInformation(token, new_username);
  setStateParent(() {});
}

List<Widget> getUserInformationWidgets(
    String token, setStateParent, UserAnswer? answer) {
  TextEditingController controller = TextEditingController();

  return (<Widget>[
    const Divider(color: Colors.white),
    const SizedBox(height: 10),
    Text("Username: ${answer!.username}",
        style: const TextStyle(
            color: Colors.white,
            fontFamily: "Roboto",
            fontWeight: FontWeight.bold,
            fontSize: 20)),
    const SizedBox(height: 10),
    Text("Email: ${answer.email}",
        style: const TextStyle(
            color: Colors.white, fontFamily: "Roboto", fontSize: 15)),
    const SizedBox(height: 10),
    const Divider(color: Colors.white),
    const SizedBox(height: 10),
    Text("Created at: ${answer.createdAt}",
        style: const TextStyle(
            color: Colors.white, fontFamily: "Roboto", fontSize: 13)),
    const SizedBox(height: 5),
    Text("Updated at: ${answer.updatedAt}",
        style: const TextStyle(
            color: Colors.white, fontFamily: "Roboto", fontSize: 13)),
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
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: const TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "Enter new username",
            fillColor: const Color.fromRGBO(68, 68, 68, 1),
          ),
        )),
    TextButton(
        onPressed: () {
          updateUserInformation(token, setStateParent, controller.text);
        },
        style: const ButtonStyle(
            side: MaterialStatePropertyAll<BorderSide>(BorderSide(
                color: Color.fromRGBO(62, 149, 49, 100), width: 1.5))),
        child: const Text("UPDATE USERNAME",
            style: TextStyle(color: Color.fromRGBO(62, 149, 49, 100))))
  ]);
}

void openUser(String token, context, setStateParent) {
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
            "User page",
            style: const TextStyle(fontSize: 24.0, color: Colors.white),
            textAlign: TextAlign.center,
          ),
          content: SizedBox(
              height: 300,
              child: FutureBuilder(
                future: ApiService().getUserInformation(token),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.done) {
                    return SingleChildScrollView(
                        scrollDirection: Axis.vertical,
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: getUserInformationWidgets(
                                token, setStateParent, snapshot.data)));
                  } else {
                    return const Center(
                        child: CircularProgressIndicator(color: Colors.white));
                  }
                },
              )),
        );
      });
}
