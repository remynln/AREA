import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:area/front/ip.dart';

class SettingsWidget extends StatefulWidget {
  const SettingsWidget({Key? key}) : super(key: key);

  @override
  State<SettingsWidget> createState() => _SettingsWidgetState();
}

class _SettingsWidgetState extends State<SettingsWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: ListView(children: <Widget>[
      const SizedBox(height: 20),
      Container(
        height: 30,
        alignment: Alignment.topCenter,
        child: ElevatedButton(
            onPressed: () {
              openIP(context);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all<Color>(
                    const Color.fromRGBO(191, 27, 44, 1)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(9.0)))),
            child: const Text('IP')),
      ),
    ])));
  }
}
