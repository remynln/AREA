import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:area/api/service/services.dart';
import 'package:area/api/connection.dart';
import 'package:area/api/answer/services_answer.dart';

import 'package:area/front/standard_pages/create_popup/action_service.dart';
import 'package:area/front/standard_pages/create_popup/action_trigger.dart';
import 'package:area/front/standard_pages/create_popup/reaction_service.dart';
import 'package:area/front/standard_pages/create_popup/reaction_trigger.dart';

class CreateWidget extends StatefulWidget {
  final String token;

  const CreateWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<CreateWidget> createState() => _CreateWidgetState();
}

class _CreateWidgetState extends State<CreateWidget> {
  Service _actionService = Service("", "", "", []);
  Service _actionTrigger = Service("", "", "", []);
  Service _reactionService = Service("", "", "", []);
  Service _reactionTrigger = Service("", "", "", []);

  Color switchColor() {
    if (_actionService.name.isEmpty) {
      return (Colors.grey);
    } else {
      return (const Color.fromRGBO(191, 27, 44, 1));
    }
  }

  Widget displayActionServices(
      ServicesAnswer? servicesAnswer, context, bool changed, setState, setStateWidget) {
    List<Widget> list = [];
    List<Service> allServices = Services.BasicServices + Services.GamesServices;

    if (servicesAnswer == null) {
      return Container();
    }
    for (var index = 0; index < allServices.length; index++) {
      if (servicesAnswer.connected.contains(allServices[index].name) == false) {
        continue;
      }
      list.add(GestureDetector(
          onTap: () {
            changed = !changed;
            _actionService.name = allServices[index].name;
            setState(() {});
          },
          child: allServices[index].name == _actionService.name
              ? Image.asset(allServices[index].not_connected_image)
              : Image.asset(allServices[index].connected_image,
                  filterQuality: FilterQuality.high)));
      list.add(const SizedBox(height: 20));
    }
    list.add(Container(
      height: 60,
      padding: const EdgeInsets.all(8.0),
      child: ElevatedButton(
        onPressed: () {
          if (_actionService.name.isNotEmpty) {
            _actionService = allServices
                .firstWhere((element) => _actionService.name == element.name);
            setStateWidget((){});
          } else
            return;
          Navigator.of(context).pop();
        },
        style: ElevatedButton.styleFrom(backgroundColor: switchColor()),
        child: const Text(
          "CONFIRM",
        ),
      ),
    ));
    return (Column(children: list));
  }

  Widget getActionServices(context, bool changed, setState, setStateWidget) {
    return FutureBuilder(
      future: ApiService().getConnectedServices(widget.token),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: displayActionServices(
                  snapshot.data, context, changed, setState, setStateWidget));
        } else {
          return Container(
              width: MediaQuery.of(context).size.width / 1.8,
              height: MediaQuery.of(context).size.height / 2,
              child: Center(
                  child: CircularProgressIndicator(color: Colors.white)));
        }
      },
    );
  }

  void openActionService(context, StateSetter setStateWidget) {
    bool changed = false;

    if (_actionService.name.isNotEmpty &&
        _actionService.not_connected_image.isEmpty) {
      _actionService.name = "";
    }
    showDialog(
        context: context,
        builder: (context) {
          return StatefulBuilder(builder: (builder, setState) {
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
                          getActionServices(context, changed, setState, setStateWidget)
                        ]))));
          });
        });
  }

  Container displayButton(
      String title, String image, bool isTrigger, Function function) {
    return Container(
      padding: EdgeInsets.only(left: 20, right: 20, bottom: 40),
      height: 270.0,
      width: 100.0,
      color: Colors.transparent,
      child: Container(
          decoration: BoxDecoration(
              color: Color.fromRGBO(100, 100, 100, 100),
              borderRadius: BorderRadius.all(Radius.circular(24))),
          child: Column(
            children: <Widget>[
              Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Text(title,
                      style: TextStyle(
                          fontSize: 23,
                          color: Colors.white,
                          fontFamily: "RobotoMono",
                          fontWeight: FontWeight.bold))),
              SizedBox(height: 20),
              RawMaterialButton(
                onPressed: () {
                  function();
                },
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: const BorderSide(color: Colors.black)),
                fillColor: const Color.fromRGBO(80, 80, 80, 100),
                child: image.isEmpty
                    ? const Icon(Icons.add, size: 30)
                    : Image.asset(image),
                constraints: BoxConstraints(minWidth: 230, minHeight: 120),
              )
            ],
          )),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
      const Padding(
          padding: EdgeInsetsDirectional.only(start: 20),
          child: Text("New Workflow",
              style: TextStyle(
                  fontSize: 26,
                  color: Colors.white,
                  fontFamily: "RobotoMono",
                  fontWeight: FontWeight.bold))),
      SizedBox(height: 50),
      displayButton(
          "Action's Service", _actionService.not_connected_image, false, () {
        openActionService(context, setState);
      }),
      _actionService.not_connected_image.isNotEmpty
          ? displayButton(
              "Action's Trigger", _actionTrigger.not_connected_image, true, () {
              openActionTrigger(context);
            })
          : Container(),
      _actionTrigger.not_connected_image.isNotEmpty
          ? displayButton(
              "Reaction's Service", _reactionService.not_connected_image, true,
              () {
              openReactionService(context);
            })
          : Container(),
      _reactionService.not_connected_image.isNotEmpty
          ? displayButton(
              "Reaction's Trigger", _reactionTrigger.not_connected_image, true,
              () {
              openReactionTrigger(context);
            })
          : Container()
    ])));
  }
}
