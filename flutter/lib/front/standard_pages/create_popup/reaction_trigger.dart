import 'package:flutter/material.dart';

void openReactionTrigger(context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: Color.fromRGBO(90, 90, 90, 100),
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
            style: TextStyle(fontSize: 24.0, color: Colors.white),
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
                    Text("IP", style: TextStyle(color: Colors.white)),
                    SizedBox(width: 40),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8.0),
                        child: TextField(
                          decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: "TEST",
                              hintStyle: TextStyle(color: Colors.grey)),
                        ),
                      ),
                    )
                  ]),
                  Row(children: <Widget>[
                    Text("PORT", style: TextStyle(color: Colors.white)),
                    SizedBox(width: 15),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8.0),
                        child: TextField(
                          decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: "TEST2",
                              hintStyle: TextStyle(color: Colors.grey)),
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
                        print("HERE");
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
