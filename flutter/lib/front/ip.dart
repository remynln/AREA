import 'package:flutter/material.dart';

import 'package:area/api/endpoints.dart';

void openIP(context) {
  TextEditingController new_ip = TextEditingController();
  TextEditingController new_port = TextEditingController();

  showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
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
            "Modify IP Address",
            style: TextStyle(fontSize: 24.0),
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
                  Row(children: <Widget>[
                    Text("IP"),
                    SizedBox(width: 40),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8.0),
                        child: TextField(
                          controller: new_ip,
                          decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: ApiConstants.ip),
                        ),
                      ),
                    )
                  ]),
                  Row(children: <Widget>[
                    Text("PORT"),
                    SizedBox(width: 15),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8.0),
                        child: TextField(
                          controller: new_port,
                          decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: ApiConstants.port),
                        ),
                      ),
                    )
                  ]),
                  Container(
                    width: double.infinity,
                    height: 60,
                    padding: const EdgeInsets.all(8.0),
                    child: ElevatedButton(
                      onPressed: () {
                        if (new_ip.text.isNotEmpty) {
                          ApiConstants.ip = new_ip.text;
                        }
                        if (new_port.text.isNotEmpty) {
                          ApiConstants.port = new_port.text;
                        }
                        Navigator.of(context).pop();
                      },
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromRGBO(191, 27, 44, 1)),
                      child: const Text(
                        "Modify",
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      });
}
