import 'dart:convert';
import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:area/api/service/services.dart';
import 'package:area/api/connection.dart';
import 'package:area/api/answer/services_answer.dart';
import 'package:area/api/answer/actions_answer.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:simple_form_builder/formbuilder.dart';
import 'package:simple_form_builder/global/checklistModel.dart';

import '../../api/answer/reactions_answer.dart';

class CreateWidget extends StatefulWidget {
  final String token;

  const CreateWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<CreateWidget> createState() => _CreateWidgetState();
}

class _CreateWidgetState extends State<CreateWidget> {
  bool _titleSubmitment = false;
  TextEditingController _titleController = TextEditingController();
  Service _actionService = Service("", "", "", []);
  ActionsAnswer _actionTrigger = ActionsAnswer();
  late Map<String, dynamic> _actionDetail;
  late String _condition;
  Service _reactionService = Service("", "", "", []);
  ReactionsAnswer _reactionTrigger = ReactionsAnswer();
  List<TextEditingController> _reactionDetail = [];

  Color switchColor(String name) {
    if (name.isEmpty) {
      return (Colors.grey);
    } else {
      return (const Color.fromRGBO(191, 27, 44, 1));
    }
  }

  Widget displayServices(ServicesAnswer? servicesAnswer, context, setState,
      setStateWidget, bool isAction) {
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
            if (isAction) {
              _actionService.name = allServices[index].name;
            } else {
              _reactionService.name = allServices[index].name;
            }
            setState(() {});
          },
          child: allServices[index].name ==
                  (isAction ? _actionService.name : _reactionService.name)
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
          if (isAction && _actionService.name.isNotEmpty) {
            _actionService = allServices
                .firstWhere((element) => _actionService.name == element.name);
            setStateWidget(() {});
          } else if (!isAction && _reactionService.name.isNotEmpty) {
            _reactionService = allServices
                .firstWhere((element) => _reactionService.name == element.name);
            setStateWidget(() {});
          } else {
            return;
          }
          Navigator.of(context).pop();
        },
        style: ElevatedButton.styleFrom(
            backgroundColor: switchColor(
                isAction ? _actionService.name : _reactionService.name)),
        child: const Text(
          "CONFIRM",
        ),
      ),
    ));
    return (Column(children: list));
  }

  Widget getServices(context, setState, setStateWidget, bool isAction) {
    return FutureBuilder(
      future: ApiService().getConnectedServices(widget.token),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: displayServices(
                  snapshot.data, context, setState, setStateWidget, isAction));
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

  void openService(context, StateSetter setStateWidget, bool isAction) {
    if (isAction &&
        _actionTrigger.name.isNotEmpty &&
        _actionService.not_connected_image.isEmpty) {
      _actionService.name = "";
    } else if (!isAction &&
        _reactionTrigger.name.isNotEmpty &&
        _reactionService.not_connected_image.isEmpty) {
      _reactionService.name = "";
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
                title: Text(
                  (isAction ? "Action's Service" : "Reaction's Service"),
                  style: const TextStyle(
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
                          getServices(
                              context, setState, setStateWidget, isAction)
                        ]))));
          });
        });
  }

  Widget getTriggerText(String name, String description, Color color) {
    return (Container(
        decoration: BoxDecoration(
            border: Border.all(color: color),
            color: const Color.fromRGBO(80, 80, 80, 100),
            borderRadius: BorderRadius.circular(24)),
        child: Column(children: <Widget>[
          Text(name,
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: Colors.white,
                  fontFamily: "Roboto",
                  fontWeight: FontWeight.bold,
                  fontSize: 20)),
          SizedBox(height: 10),
          Text(description,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontFamily: "Roboto"))
        ])));
  }

  Widget displayActionTriggers(
      List<ActionsAnswer>? actionsAnswer, context, setState, setStateWidget) {
    List<Widget> list = [];

    if (actionsAnswer == null) {
      return Container();
    }

    for (var index = 0; index < actionsAnswer.length; index++) {
      list.add(SizedBox(
          width: 223,
          child: GestureDetector(
              onTap: () {
                _actionTrigger.name = actionsAnswer[index].name;
                setState(() {});
              },
              child: actionsAnswer[index].name == _actionTrigger.name
                  ? getTriggerText(
                      actionsAnswer[index].name,
                      actionsAnswer[index].description,
                      const Color.fromRGBO(191, 27, 44, 1))
                  : getTriggerText(
                      actionsAnswer[index].name,
                      actionsAnswer[index].description,
                      const Color.fromRGBO(62, 149, 49, 1)))));
      list.add(const SizedBox(height: 20));
    }
    list.add(Container(
      height: 60,
      padding: const EdgeInsets.all(8.0),
      child: ElevatedButton(
        onPressed: () {
          if (_actionTrigger.name.isNotEmpty) {
            _actionTrigger = actionsAnswer
                .firstWhere((element) => _actionTrigger.name == element.name);
            setStateWidget(() {});
          } else {
            return;
          }
          Navigator.of(context).pop();
        },
        style: ElevatedButton.styleFrom(
            backgroundColor: switchColor(_actionTrigger.name)),
        child: const Text(
          "CONFIRM",
        ),
      ),
    ));
    return (Column(children: list));
  }

  Widget displayReactionTriggers(List<ReactionsAnswer>? reactionsAnswer,
      context, setState, setStateWidget) {
    List<Widget> list = [];

    if (reactionsAnswer == null) {
      return Container();
    }

    for (var index = 0; index < reactionsAnswer.length; index++) {
      list.add(SizedBox(
          width: 223,
          child: GestureDetector(
              onTap: () {
                _reactionTrigger.name = reactionsAnswer[index].name;
                setState(() {});
              },
              child: reactionsAnswer[index].name == _reactionTrigger.name
                  ? getTriggerText(
                      reactionsAnswer[index].name,
                      reactionsAnswer[index].description,
                      const Color.fromRGBO(191, 27, 44, 1))
                  : getTriggerText(
                      reactionsAnswer[index].name,
                      reactionsAnswer[index].description,
                      const Color.fromRGBO(62, 149, 49, 1)))));
      list.add(const SizedBox(height: 20));
    }
    list.add(Container(
      height: 60,
      padding: const EdgeInsets.all(8.0),
      child: ElevatedButton(
        onPressed: () {
          if (_reactionTrigger.name.isNotEmpty) {
            _reactionTrigger = reactionsAnswer
                .firstWhere((element) => _reactionTrigger.name == element.name);
            setStateWidget(() {});
          } else {
            return;
          }
          Navigator.of(context).pop();
        },
        style: ElevatedButton.styleFrom(
            backgroundColor: switchColor(_reactionTrigger.name)),
        child: const Text(
          "CONFIRM",
        ),
      ),
    ));
    return (Column(children: list));
  }

  Widget getActionTriggers(context, setState, setStateWidget) {
    return FutureBuilder(
      future:
          ApiService().getActionsFromService(widget.token, _actionService.name),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: displayActionTriggers(
                  snapshot.data, context, setState, setStateWidget));
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

  Widget getReactionTriggers(context, setState, setStateWidget) {
    return FutureBuilder(
      future: ApiService()
          .getReactionsFromService(widget.token, _reactionService.name),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: displayReactionTriggers(
                  snapshot.data, context, setState, setStateWidget));
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

  void openTrigger(context, StateSetter setStateWidget, isAction) {
    if (isAction &&
        _actionTrigger.name.isNotEmpty &&
        _actionTrigger.description.isEmpty) {
      _actionTrigger.name = "";
    } else if (!isAction &&
        _reactionTrigger.name.isNotEmpty &&
        _reactionTrigger.description.isEmpty) {
      _reactionTrigger.name = "";
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
                title: Text(
                  isAction ? "Action's Trigger" : "Reaction's Trigger",
                  style: const TextStyle(
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
                          isAction
                              ? getActionTriggers(
                                  context, setState, setStateWidget)
                              : getReactionTriggers(
                                  context, setState, setStateWidget)
                        ]))));
          });
        });
  }

  StatelessWidget displayTriggerName(String title) {
    if (title.contains("Action") && _actionTrigger.description.isNotEmpty) {
      return (Text(_actionTrigger.name,
          style: const TextStyle(
              color: Colors.white,
              fontFamily: "Roboto",
              fontWeight: FontWeight.bold,
              fontSize: 18)));
    } else if (title.contains("Reaction") &&
        _reactionTrigger.description.isNotEmpty) {
      return (Text(_reactionTrigger.name,
          style: const TextStyle(
              color: Colors.white,
              fontFamily: "Roboto",
              fontWeight: FontWeight.bold,
              fontSize: 18)));
    }
    return (Container());
  }

  Widget getButtonImage(bool isTrigger, bool isAction, String image) {
    if (image.isEmpty) {
      return const Icon(Icons.add, size: 30);
    } else if (isTrigger == false) {
      return Image.asset(image);
    }
    if ((isAction && _actionTrigger.description.isEmpty) ||
        (!isAction && _reactionTrigger.description.isEmpty)) {
      return const Icon(Icons.add, size: 30);
    }
    return Image.asset(image);
  }

  Container displayButton(String title, String image, bool isTrigger,
      bool isAction, Function function) {
    return Container(
      padding: const EdgeInsets.only(left: 20, right: 20, bottom: 40),
      height: 270.0,
      width: 100.0,
      color: Colors.transparent,
      child: Container(
          decoration: const BoxDecoration(
              color: Color.fromRGBO(100, 100, 100, 100),
              borderRadius: BorderRadius.all(Radius.circular(24))),
          child: Column(
            children: <Widget>[
              Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Text(title,
                      style: const TextStyle(
                          fontSize: 23,
                          color: Colors.white,
                          fontFamily: "RobotoMono",
                          fontWeight: FontWeight.bold))),
              const SizedBox(height: 20),
              RawMaterialButton(
                onPressed: () {
                  function();
                },
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: const BorderSide(color: Colors.black)),
                fillColor: const Color.fromRGBO(80, 80, 80, 100),
                constraints:
                    const BoxConstraints(minWidth: 230, minHeight: 120),
                child: getButtonImage(isTrigger, isAction, image),
              ),
              const SizedBox(height: 10),
              isTrigger ? displayTriggerName(title) : Container()
            ],
          )),
    );
  }

  Map<String, dynamic> getMapFromDetail(Map<String, dynamic> map,
      {String primaryKey = ""}) {
    Map<String, dynamic> newMap = {};

    map.forEach((key, value) {
      if (value.runtimeType.toString() ==
          "_InternalLinkedHashMap<String, dynamic>") {
        newMap.addAll(getMapFromDetail(value, primaryKey: key));
      } else {
        if (primaryKey.isNotEmpty)
          newMap[primaryKey.toUpperCase() + ": " + key] = value;
        else
          newMap[key] = value;
      }
    });
    return (newMap);
  }

  void completeActionForm(
      Map<String, dynamic> triggerValues, Map<String, dynamic> data) {
    triggerValues.addAll(getMapFromDetail(_actionTrigger.parameters));
    triggerValues.forEach((key, value) {
      data["data"][0]["questions"].add({
        "question_id": String,
        "fields": [],
        "_id": "sergify",
        "title": key,
        "description": "",
        "remark": false,
        "type": "text",
        "is_mandatory": value.contains('?') ? false : true
      });
    });
    data["data"][0]["questions"].add({
      "question_id": String,
      "fields": [],
      "_id": "dssfghjkl",
      "title": "CONDITION",
      "description":
          "Use: '>, <, <=, >=, ==' to compare numbers and '== (case insensitive comparison), === (case sensitive comparison), in' to compare strings",
      "remark": false,
      "type": "text",
      "is_mandatory": false
    });
  }

  Widget createActionForm() {
    Map<String, dynamic> triggerValues = {};
    Map<String, dynamic> data = {
      "status": 1,
      "data": [
        {"questions": []}
      ]
    };

    try {
      completeActionForm(triggerValues, data);
    } catch (e) {
      print(e.toString());
      return (Container());
    }
    return (FormBuilder(
        initialData: data,
        index: 0,
        submitButtonWidth: 0.5,
        submitButtonDecoration: BoxDecoration(
          color: Color.fromRGBO(191, 27, 44, 1),
          borderRadius: BorderRadius.circular(10),
        ),
        showIndex: false,
        onSubmit: (ChecklistModel? val) {
          if (_actionTrigger.parameters.isEmpty || val != null) {
            setState(() => _actionTrigger.detail = true);
          }
          if (val == null) {
            return;
          }
          _actionDetail = val!.toJson();
          _condition = _actionDetail["data"][0]["questions"]
              .firstWhere((map) => map["title"] == "CONDITION")["answer"];
          _actionDetail["data"][0]["questions"]
              .removeWhere((map) => map["title"] == "CONDITION");
          _actionDetail["data"][0]["questions"].forEach((map) {
            if (_actionTrigger.parameters.containsKey(map["title"])) {
              _actionTrigger.parameters[map["title"]] = map["answer"];
            } else if (_actionTrigger.properties.containsKey(map["title"])) {
              _actionTrigger.properties[map["title"]] = map["answer"];
            }
          });
        }));
  }

  List<Widget> getReactionDetailWidgets(Map<String, dynamic> reactionInfo) {
    List<Widget> reactionDetailWidgets = [];

    reactionInfo.forEach((key, value) {
      TextEditingController reactionDetailController = TextEditingController();
      reactionDetailWidgets.add(Align(
          alignment: Alignment.center,
          child: Text(key.toUpperCase() + (value.contains('?') ? '' : '*'),
              style: const TextStyle(color: Colors.white))));
      reactionDetailWidgets.add(Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: TextField(
            controller: reactionDetailController,
            style: const TextStyle(color: Colors.white),
            textAlign: TextAlign.center,
            decoration: InputDecoration(
              border:
                  OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
              filled: true,
              hintStyle: const TextStyle(
                  color: Color.fromRGBO(148, 163, 184, 1),
                  fontStyle: FontStyle.italic),
              hintText: "Enter text here",
              fillColor: const Color.fromRGBO(68, 68, 68, 1),
            ),
          )));
      reactionDetailWidgets.add(const SizedBox(height: 10));
    });
    reactionDetailWidgets.add(const Padding(
        padding: EdgeInsets.only(left: 20),
        child: Text("*: information must be complete",
            style: TextStyle(color: Color.fromRGBO(148, 163, 184, 1)))));
    reactionDetailWidgets.add(const SizedBox(height: 20));
    reactionDetailWidgets.add(Align(
        alignment: Alignment.center,
        child: ElevatedButton(
          onPressed: () {
            _reactionTrigger.detail = true;
            setState(() {});
          },
          style: ElevatedButton.styleFrom(
            fixedSize: Size(150, 40),
              backgroundColor: const Color.fromRGBO(191, 27, 44, 1)),
          child: const Text(
            "SUBMIT",
          ),
        )));
    return (reactionDetailWidgets);
  }

  Widget createReactionForm() {
    Map<String, dynamic> reactionInfo =
        getMapFromDetail(_reactionTrigger.parameters);

    return Form(
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: getReactionDetailWidgets(reactionInfo)));
  }

  void handleCreate() async {
    String result = await ApiService().createArea(_titleController.text,
        widget.token, _actionTrigger, _condition, _reactionTrigger);
    Fluttertoast.showToast(
        msg: result,
        timeInSecForIosWeb: 3,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Color.fromRGBO(191, 27, 44, 1),
        textColor: Colors.white,
        fontSize: 14);
  }

  Container displayDetail(String title, bool isAction) {
    return Container(
        constraints: BoxConstraints(minHeight: 270.0),
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 40),
        width: 100.0,
        color: Colors.transparent,
        child: Container(
            decoration: const BoxDecoration(
                color: Color.fromRGBO(100, 100, 100, 100),
                borderRadius: BorderRadius.all(Radius.circular(24))),
            child: Column(children: <Widget>[
              Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Text(title,
                      style: const TextStyle(
                          fontSize: 23,
                          color: Colors.white,
                          fontFamily: "RobotoMono",
                          fontWeight: FontWeight.bold))),
              const SizedBox(height: 20),
              isAction ? createActionForm() : createReactionForm(),
              const SizedBox(height: 20)
            ])));
  }

  Widget displayText() {
    return Container(
        constraints: BoxConstraints(minHeight: 270.0),
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 40),
        width: 100.0,
        color: Colors.transparent,
        child: Container(
            decoration: const BoxDecoration(
                color: Color.fromRGBO(100, 100, 100, 100),
                borderRadius: BorderRadius.all(Radius.circular(24))),
            child: Column(children: <Widget>[
              const Padding(
                  padding: EdgeInsets.only(top: 10),
                  child: Text("Workflow's Title",
                      style: TextStyle(
                          fontSize: 23,
                          color: Colors.white,
                          fontFamily: "RobotoMono",
                          fontWeight: FontWeight.bold))),
              const SizedBox(height: 40),
              Padding(
                  padding: EdgeInsets.symmetric(horizontal: 30),
                  child: TextField(
                    controller: _titleController,
                    style: const TextStyle(color: Colors.white),
                    textAlign: TextAlign.center,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14.0)),
                      filled: true,
                      hintStyle: const TextStyle(
                          color: Color.fromRGBO(148, 163, 184, 1),
                          fontStyle: FontStyle.italic),
                      hintText: "enter workflow title here",
                      fillColor: const Color.fromRGBO(68, 68, 68, 1),
                    ),
                  )),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  _titleSubmitment = true;
                  setState(() {});
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromRGBO(191, 27, 44, 1)),
                child: const Text(
                  "SUBMIT",
                ),
              ),
              const SizedBox(height: 20)
            ])));
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
      displayText(),
      _titleSubmitment
          ? displayButton("Action's Service",
              _actionService.not_connected_image, false, true, () {
              openService(context, setState, true);
            })
          : Container(),
      _actionService.not_connected_image.isNotEmpty
          ? displayButton("Action's Trigger",
              _actionService.not_connected_image, true, true, () {
              openTrigger(context, setState, true);
            })
          : Container(),
      _actionTrigger.description.isNotEmpty
          ? displayDetail("Action's Details", true)
          : Container(),
      _actionTrigger.detail
          ? displayButton("Reaction's Service",
              _reactionService.not_connected_image, false, false, () {
              openService(context, setState, false);
            })
          : Container(),
      _reactionService.not_connected_image.isNotEmpty
          ? displayButton("Reaction's Trigger",
              _reactionService.not_connected_image, true, false, () {
              openTrigger(context, setState, false);
            })
          : Container(),
      _reactionTrigger.description.isNotEmpty
          ? displayDetail("Reaction's Details", false)
          : Container(),
      _reactionTrigger.detail
          ? Container(
              height: 85,
              padding: const EdgeInsets.only(left: 60, right: 60, bottom: 40),
              child: ElevatedButton(
                  child: const Text('CONFIRM'),
                  onPressed: () {
                    handleCreate();
                  },
                  style: ButtonStyle(
                      backgroundColor: const MaterialStatePropertyAll<Color>(
                          Color.fromRGBO(191, 27, 44, 1)),
                      shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                          RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(9.0))))),
            )
          : Container(),
    ])));
  }
}
