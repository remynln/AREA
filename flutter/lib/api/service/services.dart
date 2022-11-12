import 'package:flutter/material.dart';

List<String> SERVICE_NAMES = [
  "google",
  "spotify",
  "deezer",
  "trello",
  "twitch",
  "twitter",
  "github",
  "notion",
  "discord",
  "mixcloud",
  "skyrock",
  "genius",
  "gitlab"
];

class Services {
  List<Service> allServices() {
    List<Service> list = [];

    SERVICE_NAMES.forEach((name) {
      list.add(Service(name, "assets/dashboard/service/${name}_connected.png",
          "assets/dashboard/service/${name}_not_connected.png"));
    });
    return list;
  }
}

class Service {
  Service(this.name, this.connected_image, this.not_connected_image);

  String name;
  String connected_image;
  String not_connected_image;
}
