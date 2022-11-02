import 'package:flutter/material.dart';

import 'package:area/api/connection.dart';
import 'package:area/api/answer/services_answer.dart';
import 'package:area/api/service/services.dart';

Widget displayServices(ServicesAnswer? servicesAnswer, context) {
  List<Widget> list = [];
  List<Service> allServices = Services.BasicServices + Services.GamesServices;

  if (servicesAnswer == null) {
    return Container();
  }
  for (var index = 0; index < allServices.length; index++) {
    if (servicesAnswer.not_connected.contains(allServices[index].name) ==
        false) {
      continue;
    }
    list.add(GestureDetector(
        onTap: () {
          print(allServices[index].name);
        },
        child: Image.asset(allServices[index].connected_image,
            filterQuality: FilterQuality.high)));
    list.add(const SizedBox(height: 20));
  }
  list.add(Container(
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
        "CONFIRM",
      ),
    ),
  ));
  return (Column(children: list));
}

Widget getActionServices(String token, context) {
  return FutureBuilder(
    future: ApiService().getConnectedServices(token),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.done) {
        return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: displayServices(snapshot.data, context));
      } else {
        return Container(
            width: MediaQuery.of(context).size.width / 1.8,
            height: MediaQuery.of(context).size.height / 2,
            child:
                Center(child: CircularProgressIndicator(color: Colors.white)));
      }
    },
  );
}

void openActionService(context, String token) {
  showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
            backgroundColor: Color.fromRGBO(60, 60, 60, 1),
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(
                Radius.circular(
                  30,
                ),
              ),
            ),
            title: const Text(
              "Action's Service",
              style: TextStyle(
                  fontSize: 23,
                  color: Colors.white,
                  fontFamily: "RobotoMono",
                  fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            content: SizedBox(
                height: 500,
                width: 600,
                child: Padding(
                    padding: const EdgeInsetsDirectional.only(start: 20),
                    child: Row(children: <Widget>[
                      getActionServices(token, context)
                    ]))));
      });
}
