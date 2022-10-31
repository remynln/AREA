import 'package:area/api/service/services.dart';
import 'package:flutter/material.dart';

import 'package:flutter_svg/flutter_svg.dart';

import 'package:area/api/service/service_display.dart';

class ServiceDisplay extends StatefulWidget {
  final bool isBasicService;

  const ServiceDisplay({Key? key, required this.isBasicService})
      : super(key: key);

  @override
  State<ServiceDisplay> createState() => _ServiceDisplayState();
}

class _ServiceDisplayState extends State<ServiceDisplay> {
  Widget handleDisplayColumn(List<Service> service_list, var index) {
    if (index + 1 < service_list.length) {
      return (Column(children: <Widget>[
        GestureDetector(
            onTap: () {
              print(service_list[index].name);
            },
            child: Image.asset(service_list[index].image, filterQuality: FilterQuality.high)),
        SizedBox(height: 10),
        GestureDetector(
            onTap: () {
              print(service_list[index + 1].name);
            },
            child: Image.asset(service_list[index + 1].image, filterQuality: FilterQuality.high)),
      ]));
    } else {
      return (Column(children: <Widget>[
        GestureDetector(
            onTap: () {
              print(service_list[index].name);
            },
            child: Image.asset(service_list[index].image, filterQuality: FilterQuality.high)),
        SizedBox(height: 10),
        Visibility(
          child: Image.asset(service_list[index].image),
          maintainSize: true,
          maintainAnimation: true,
          maintainState: true,
          visible: false,
        )
      ]));
    }
  }

  @override
  Widget build(BuildContext context) {
    late List<Service> service_list;
    List<Widget> list = [];

    if (widget.isBasicService) {
      service_list = Services.BasicServices;
    } else {
      service_list = Services.GamesServices;
    }
    for (var index = 0; index < service_list.length; index++) {
      list.add(handleDisplayColumn(service_list, index));
      if (index + 1 < service_list.length) {
        list.add(const SizedBox(width: 10));
        index++;
      }
    }
    return Padding(
        padding: const EdgeInsetsDirectional.only(start: 20),
        child: Row(children: list));
  }
}
