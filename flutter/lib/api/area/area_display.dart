import 'package:flutter/material.dart';

import 'package:area/api/request.dart';
import 'package:area/api/answer/area_answer.dart';

import 'package:area/api/area/area_popup.dart';

class AreaDisplay extends StatefulWidget {
  final String token;
  final bool isDashboardDisplay;

  const AreaDisplay(
      {Key? key, required this.token, required this.isDashboardDisplay})
      : super(key: key);

  @override
  State<AreaDisplay> createState() => _AreaDisplayState();
}

class _AreaDisplayState extends State<AreaDisplay> {
    Color getBorderColorByStatus(String status) {
    if (status == "starting" || status == "started") {
      return (Color.fromRGBO(191, 27, 44, 100));
    } else {
      return (Color.fromRGBO(62, 149, 49, 100));
    }
  }

  Text getTextByStatus(String status) {
    if (status == "starting" || status == "started") {
      return (const Text("disable",
          style: TextStyle(color: Color.fromRGBO(191, 27, 44, 100))));
    } else {
      return (const Text("enable",
          style: TextStyle(color: Color.fromRGBO(62, 149, 49, 100))));
    }
  }

  void changeAreaStatus(String status, String area_id) async {
    if (status == "starting" || status == "started") {
      await ApiService().disableArea(widget.token, area_id);
    } else {
      await ApiService().enableArea(widget.token, area_id);
    }
  }

  Container getContainerByArea(AreaAnswer answer) {
    return Container(
      height: 190.0,
      width: 160.0,
      color: Colors.transparent,
      child: Container(
          decoration: BoxDecoration(
              color: Color.fromRGBO(100, 100, 100, 100),
              borderRadius: BorderRadius.all(Radius.circular(24)),
              border: Border.all(
                  color: getColorByStatus(answer.status), width: 1.5)),
          child: Column(
            children: <Widget>[
              SizedBox(height: 10),
              Text(answer.title,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: Colors.white,
                      fontFamily: "Roboto",
                      fontWeight: FontWeight.bold,
                      fontSize: 20)),
              SizedBox(height: 10),
              Text(answer.description,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: Colors.white, fontFamily: "Roboto", fontSize: 15)),
              SizedBox(height: 10),
              OutlinedButton(
                onPressed: () {
                  openArea(widget.token, context, setState, answer);
                },
                style: ButtonStyle(
                  side: MaterialStateProperty.all(BorderSide(color: getColorByStatus(answer.status))),
                  shape: MaterialStateProperty.all(RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(45.0))),
                ),
                child: const Icon(Icons.remove_red_eye, color: Colors.white),
              ),
              Spacer(),
              answer.status != "locked" && answer.status != "errored"
                  ? TextButton(
                      onPressed: (() =>
                          changeAreaStatus(answer.status, answer.id)),
                      style: ButtonStyle(
                          side: MaterialStatePropertyAll<BorderSide>(BorderSide(
                              color: getBorderColorByStatus(answer.status),
                              width: 1.5))),
                      child: getTextByStatus(answer.status))
                  : Container(),
              Padding(
                  padding: EdgeInsets.only(bottom: 10),
                  child: Text("status: ${answer.status}",
                      style: TextStyle(
                          color: getColorByStatus(answer.status),
                          fontFamily: "Roboto",
                          fontSize: 15))),
            ],
          )),
    );
  }

  List<Widget> createWidgetList(List<AreaAnswer>? areasAnswer) {
    List<Widget> areasWidget = [];

    if (areasAnswer == []) {
      return ([]);
    }
    for (var index = 0; index < areasAnswer!.length; index++) {
      if (index + 1 < areasAnswer!.length) {
        areasWidget.add(Row(children: <Widget>[
          getContainerByArea(areasAnswer[index]),
          const SizedBox(width: 20),
          getContainerByArea(areasAnswer[++index])
        ]));
      } else {
        areasWidget.add(getContainerByArea(areasAnswer[index]));
      }
    }
    return (areasWidget);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: ApiService().getUserAreas(widget.token),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          if (widget.isDashboardDisplay) {
            List<Widget> list = createWidgetList(snapshot.data);
            return list.isEmpty ? Container() : list[0];
          } else {
            return SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Column(children: createWidgetList(snapshot.data)));
          }
        } else {
          return const Center(
              child: CircularProgressIndicator(color: Colors.white));
        }
      },
    );
  }
}
