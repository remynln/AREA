import 'package:flutter/material.dart';

class Services {
  static Google google = Google();

  static List<Service> BasicServices = [google];
  static List<Service> GamesServices = [];
}

class Google extends Service {
  Google()
      : super("google", "assets/dashboard/service/google_connected.png",
            "assets/dashboard/service/google_not_connected.png", []);
}

class Service {
  Service(
      this.name, this.connected_image, this.not_connected_image, this.actions);

  String name;
  String connected_image;
  String not_connected_image;
  List<String> actions;
}
