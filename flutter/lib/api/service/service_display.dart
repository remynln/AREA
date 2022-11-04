import 'dart:async';
import 'dart:developer';
import 'dart:io';

import 'package:area/api/service/services.dart';
import 'package:area/api/answer/services_answer.dart';
import 'package:flutter/foundation.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import 'package:area/api/connection.dart';
import 'package:uni_links/uni_links.dart';

class ServiceDisplay extends StatefulWidget {
  final String token;
  final bool isBasicService;

  const ServiceDisplay(
      {Key? key, required this.isBasicService, required this.token})
      : super(key: key);

  @override
  State<ServiceDisplay> createState() => _ServiceDisplayState();
}

class _ServiceDisplayState extends State<ServiceDisplay> {
  void callApiFunction(String service_name) async {
    try {
      await ApiService()
          .connectToService(widget.token, service_name, "sergify://");
    } catch (e) {
      print(e.toString());
    }
  }

  Widget handleDisplayColumn(
      List<Service> service_list, var index, List<dynamic> connectedServices) {
    late String firstServiceImage;
    late String secondServiceImage;

    if (connectedServices.contains(service_list[index].name)) {
      firstServiceImage = service_list[index].connected_image;
    } else {
      firstServiceImage = service_list[index].not_connected_image;
    }
    if (index + 1 < service_list.length) {
      if (connectedServices.contains(service_list[index + 1].name)) {
        secondServiceImage = service_list[index + 1].connected_image;
      } else {
        secondServiceImage = service_list[index + 1].not_connected_image;
      }
      return (Column(children: <Widget>[
        GestureDetector(
            onTap: () {
              callApiFunction(service_list[index].name);
            },
            child: Image.asset(firstServiceImage,
                filterQuality: FilterQuality.high)),
        SizedBox(height: 10),
        GestureDetector(
            onTap: () {
              callApiFunction(service_list[index + 1].name);
            },
            child: Image.asset(secondServiceImage,
                filterQuality: FilterQuality.high)),
      ]));
    } else {
      return (Column(children: <Widget>[
        GestureDetector(
            onTap: () {
              callApiFunction(service_list[index].name);
            },
            child: Image.asset(firstServiceImage,
                filterQuality: FilterQuality.high)),
        SizedBox(height: 10),
        Visibility(
          child: Image.asset(firstServiceImage),
          maintainSize: true,
          maintainAnimation: true,
          maintainState: true,
          visible: false,
        )
      ]));
    }
  }

  Widget createWidgetList(
      List<Service> service_list, ServicesAnswer? servicesAnswer) {
    List<Widget> list = [];

    if (servicesAnswer == null) {
      return Container();
    }
    for (var index = 0; index < service_list.length; index++) {
      list.add(
          handleDisplayColumn(service_list, index, servicesAnswer.connected));
      if (index + 1 < service_list.length) {
        list.add(const SizedBox(width: 10));
        index++;
      }
    }
    return (Row(children: list));
  }

  @override
  Widget build(BuildContext context) {
    late List<Service> service_list;

    if (widget.isBasicService) {
      service_list = Services.BasicServices;
    } else {
      service_list = Services.GamesServices;
    }
    return Padding(
        padding: const EdgeInsetsDirectional.only(start: 20),
        child: FutureBuilder(
          future: ApiService().getConnectedServices(widget.token),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: createWidgetList(service_list, snapshot.data));
            } else {
              return const Center(
                  child: CircularProgressIndicator(color: Colors.white));
            }
          },
        ));
  }
}
