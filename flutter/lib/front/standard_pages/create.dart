import 'dart:convert';
import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:area/api/service/services.dart';
import 'package:area/api/request.dart';
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
  TextEditingController _descriptionController = TextEditingController();

  String _currentField = "";

  Service _actionService = Service("", "", "", []);
  ActionsAnswer _actionTrigger = ActionsAnswer();
  Map<String, TextEditingController> _actionDetail = {};

  List<String> _firstDropDown = [""];
  List<String> _secondDropDown = [""];
  List<String> _comparatorDropDown = [""];
  TextEditingController _condition = TextEditingController();

  Service _reactionService = Service("", "", "", []);
  ReactionsAnswer _reactionTrigger = ReactionsAnswer();
  Map<String, TextEditingController> _reactionDetail = {};

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
          newMap[primaryKey + "." + key] = value;
        else
          newMap[key] = value;
      }
    });
    return (newMap);
  }

  List<Widget> getFormDetail(Map<String, dynamic> info, bool isAction) {
    List<Widget> list = [];

    info.forEach((key, value) {
      TextEditingController detailController = TextEditingController();
      list.add(Align(
          alignment: Alignment.center,
          child: Text(key.toUpperCase() + (value.contains('?') ? '' : '*'),
              style: const TextStyle(color: Colors.white))));
      list.add(Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: TextField(
            onChanged: (String change) {
              _currentField = key;
            },
            controller: isAction
                ? (_actionDetail.containsKey(key)
                    ? _actionDetail[key]
                    : detailController)
                : (_reactionDetail.containsKey(key)
                    ? _reactionDetail[key]
                    : detailController),
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
      if (isAction && !_actionDetail.containsKey(key)) {
        _actionDetail[key] = detailController;
      } else if (!isAction && !_reactionDetail.containsKey(key)) {
        _reactionDetail[key] = detailController;
      }
    });
    list.add(const SizedBox(height: 10));
    if (list.length > 1) {
      list.add(const Padding(
          padding: EdgeInsets.only(left: 20),
          child: Text("*: information must be complete",
              style: TextStyle(color: Color.fromRGBO(148, 163, 184, 1)))));
    }
    return list;
  }

  List<DropdownMenuItem<String>>? getDropDownInfo(
      Map<String, dynamic> properties, String type) {
    List<DropdownMenuItem<String>>? list = [];

    properties.forEach((key, value) {
      if ((type.isEmpty || value == properties[type]) && key != type) {
        list.add(DropdownMenuItem<String>(
          value: key,
          child: Text(key),
        ));
      }
    });
    return list;
  }

  List<Widget> getTypeComparators(String type, index) {
    List<Widget> list = [];
    List<String> comparators = [];

    if (type == "string") {
      comparators = ["==", "===", "in"];
    } else {
      comparators = [">", "<", "<=", ">=", "=="];
    }
    if (_comparatorDropDown[index].isEmpty) {
      _comparatorDropDown[index] = comparators[0];
    }
    list.add(Row(children: [
      Padding(
          padding: EdgeInsets.only(left: 20),
          child: DropdownButton<String>(
              value: _comparatorDropDown[index],
              items: comparators.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                    value: value, child: Text(value));
              }).toList(),
              dropdownColor: Color.fromRGBO(60, 60, 60, 1),
              style: TextStyle(color: Colors.white, fontFamily: "RobotoMono"),
              underline: Container(height: 1.5, color: Colors.black),
              onChanged: (String? element) {
                _comparatorDropDown[index] = element!;
                setState(() {});
              })),
      Spacer(),
      Padding(
          padding: EdgeInsets.only(right: 20),
          child: TextButton(
              onPressed: (() {
                _condition.text =
                    "[Action.${_firstDropDown[index]}] ${_comparatorDropDown[index]} [Action.${_secondDropDown[index]}]";
                setState(() {});
              }),
              style: ButtonStyle(
                  backgroundColor:
                      MaterialStatePropertyAll(Color.fromRGBO(60, 60, 60, 1)),
                  side: MaterialStatePropertyAll<BorderSide>(
                      BorderSide(color: Colors.black, width: 1.5))),
              child:
                  Text("ADD CONDITION", style: TextStyle(color: Colors.white))))
    ]));
    return list;
  }

  List<Widget> getConditionZone(properties, int index) {
    List<Widget> list = [];
    List<Widget> temporary_list = [];

    if (_firstDropDown[index].isEmpty) {
      _firstDropDown[index] = properties.keys.first;
    }
    temporary_list.add(Padding(
        padding: EdgeInsets.only(left: 20),
        child: DropdownButton<String>(
            value: _firstDropDown[index],
            items: getDropDownInfo(properties, ""),
            dropdownColor: Color.fromRGBO(60, 60, 60, 1),
            style: TextStyle(color: Colors.white, fontFamily: "RobotoMono"),
            underline: Container(height: 1.5, color: Colors.black),
            onChanged: (String? element) {
              _firstDropDown[index] = element!;
              _secondDropDown[index] = "";
              setState(() {});
            })));
    if (_secondDropDown[index].isEmpty) {
      _secondDropDown[index] = properties.keys.firstWhere((element) =>
          (properties[element] == properties[_firstDropDown[index]] &&
              element != _firstDropDown[index]));
    }
    temporary_list.add(Spacer());
    temporary_list.add(Padding(
        padding: EdgeInsets.only(right: 20),
        child: DropdownButton<String>(
            value: _secondDropDown[index],
            items: getDropDownInfo(properties, _firstDropDown[index]),
            dropdownColor: Color.fromRGBO(60, 60, 60, 1),
            style: TextStyle(color: Colors.white, fontFamily: "RobotoMono"),
            underline: Container(height: 1.5, color: Colors.black),
            onChanged: (String? element) {
              _secondDropDown[index] = element!;
              setState(() {});
            })));
    list.add(Row(children: temporary_list));
    list += getTypeComparators(properties[_firstDropDown[index]], index);
    return list;
  }

  List<Widget> getCondition() {
    Map<String, dynamic> properties =
        getMapFromDetail(_actionTrigger.properties);
    List<Widget> list = [];

    list.add(Row(children: [
      Padding(
          padding: EdgeInsets.only(left: 20),
          child: Text("Condition",
              style: TextStyle(
                  fontSize: 16, color: Colors.white, fontFamily: "RobotoMono"))),
      Spacer(),
      Padding(
          padding: EdgeInsets.only(right: 20),
          child: TextButton(
              onPressed: (() {
                _condition.text = "";
                setState(() {});
              }),
              style: ButtonStyle(
                  side: MaterialStatePropertyAll<BorderSide>(BorderSide(
                      color: Color.fromRGBO(191, 27, 44, 1), width: 1))),
              child: Text("clear", style: TextStyle(color: Colors.white, fontFamily: "RobotoMono"))))
    ]));
    list.add(SizedBox(height: 10));
    list.add(Padding(
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: TextField(
          controller: _condition,
          style: const TextStyle(color: Color.fromRGBO(148, 163, 184, 1)),
          textAlign: TextAlign.center,
          enabled: false,
          decoration: InputDecoration(
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: const TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "empty",
            fillColor: const Color.fromRGBO(68, 68, 68, 1),
          ),
        )));
    list += getConditionZone(properties, 0);
    return list;
  }

  List<Widget> getActionDetailWidgets(Map<String, dynamic> actionInfo) {
    List<Widget> actionDetailWidgets = [];

    actionDetailWidgets += getFormDetail(actionInfo, true);
    actionDetailWidgets += getCondition();
    actionDetailWidgets.add(const SizedBox(height: 20));
    actionDetailWidgets.add(Align(
        alignment: Alignment.center,
        child: ElevatedButton(
          onPressed: () {
            bool isValid = true;
            _actionTrigger.parameters.forEach((key, value) {
              if (!value.contains("?") && _actionDetail[key]?.text == "") {
                Fluttertoast.showToast(
                    msg: "$key must be complete !",
                    timeInSecForIosWeb: 3,
                    toastLength: Toast.LENGTH_SHORT,
                    gravity: ToastGravity.BOTTOM,
                    backgroundColor: Color.fromRGBO(191, 27, 44, 1),
                    textColor: Colors.white,
                    fontSize: 14);
                isValid = false;
              }
            });
            if (!isValid) {
              return;
            }
            _actionTrigger.detail = true;
            _actionDetail.forEach((key, value) {
              if (_actionTrigger.parameters.containsKey(key)) {
                _actionTrigger.parameters[key] = value.text;
              }
            });
            setState(() {});
          },
          style: ElevatedButton.styleFrom(
              fixedSize: Size(150, 40),
              backgroundColor: const Color.fromRGBO(191, 27, 44, 1)),
          child: const Text(
            "SUBMIT",
          ),
        )));
    return (actionDetailWidgets);
  }

  void addReactionDetailProperties(List<Widget> reactionDetailWidgets) {
    Map<String, dynamic> new_properties =
        getMapFromDetail(_actionTrigger.properties);
    List<Widget> buttonList = [];

    reactionDetailWidgets.add(const Center(
        child: Padding(
            padding: EdgeInsets.only(top: 10),
            child: Text("Available Properties",
                style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                    fontFamily: "RobotoMono")))));
    new_properties.forEach((key, value) {
      buttonList.add(ElevatedButton(
        onPressed: () {
          _reactionDetail[_currentField]?.text += "[Action.$key]";
        },
        style: ElevatedButton.styleFrom(
            minimumSize: Size(100, 40),
            side: BorderSide(
                width: 1.5, color: const Color.fromRGBO(4, 14, 145, 30)),
            backgroundColor: Color.fromRGBO(100, 100, 100, 100)),
        child: Text(
          key,
        ),
      ));
    });
    reactionDetailWidgets.add(Center(
        child: Wrap(
            children: buttonList,
            spacing: 10,
            alignment: WrapAlignment.center)));
    reactionDetailWidgets.add(SizedBox(height: 20));
  }

  List<Widget> getReactionDetailWidgets(Map<String, dynamic> reactionInfo) {
    List<Widget> reactionDetailWidgets = [];

    addReactionDetailProperties(reactionDetailWidgets);
    reactionDetailWidgets += getFormDetail(reactionInfo, false);
    reactionDetailWidgets.add(const SizedBox(height: 20));
    reactionDetailWidgets.add(Align(
        alignment: Alignment.center,
        child: ElevatedButton(
          onPressed: () {
            bool isValid = true;
            _reactionTrigger.parameters.forEach((key, value) {
              if (!value.contains("?") && _reactionDetail[key]?.text == "") {
                Fluttertoast.showToast(
                    msg: "$key must be complete !",
                    timeInSecForIosWeb: 3,
                    toastLength: Toast.LENGTH_SHORT,
                    gravity: ToastGravity.BOTTOM,
                    backgroundColor: Color.fromRGBO(191, 27, 44, 1),
                    textColor: Colors.white,
                    fontSize: 14);
                isValid = false;
              }
            });
            if (!isValid) {
              return;
            }
            _reactionTrigger.detail = true;
            _reactionDetail.forEach((key, value) {
              if (_reactionTrigger.parameters.containsKey(key)) {
                _reactionTrigger.parameters[key] = value.text;
              }
            });
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

  Widget createForm(bool isAction) {
    Map<String, dynamic> info = isAction
        ? getMapFromDetail(_actionTrigger.parameters)
        : getMapFromDetail(_reactionTrigger.parameters);

    return Form(
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: isAction
                ? getActionDetailWidgets(info)
                : getReactionDetailWidgets(info)));
  }

  void handleCreate() async {
    String result = await ApiService().createArea(
        _titleController.text,
        _descriptionController.text,
        widget.token,
        _actionTrigger,
        _condition.text,
        _reactionTrigger);
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
              createForm(isAction),
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
                  child: Text("Workflow",
                      style: TextStyle(
                          fontSize: 23,
                          color: Colors.white,
                          fontFamily: "RobotoMono",
                          fontWeight: FontWeight.bold))),
              const SizedBox(height: 30),
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
              SizedBox(height: 15),
              Padding(
                  padding: EdgeInsets.symmetric(horizontal: 30),
                  child: TextField(
                    controller: _descriptionController,
                    style: const TextStyle(color: Colors.white),
                    textAlign: TextAlign.center,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14.0)),
                      filled: true,
                      hintStyle: const TextStyle(
                          color: Color.fromRGBO(148, 163, 184, 1),
                          fontStyle: FontStyle.italic),
                      hintText: "enter workflow description here",
                      fillColor: const Color.fromRGBO(68, 68, 68, 1),
                    ),
                  )),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (_titleController.text.isEmpty) {
                    Fluttertoast.showToast(
                        msg: "Title must be complete !",
                        timeInSecForIosWeb: 3,
                        toastLength: Toast.LENGTH_SHORT,
                        gravity: ToastGravity.BOTTOM,
                        backgroundColor: Color.fromRGBO(191, 27, 44, 1),
                        textColor: Colors.white,
                        fontSize: 14);
                    return;
                  }
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
