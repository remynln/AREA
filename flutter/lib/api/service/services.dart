import 'package:flutter/material.dart';

class Services {
  static Google google = Google();

  static List<Service> BasicServices = [
    google
  ];
  static List<Service> GamesServices = [

  ];
}

class Twitter extends Service {
  Twitter()
      : super("Twitter", "assets/dashboard/service/twitter.png",
            ["Send a tweet"]);
}

class Google extends Service {
  Google() : super("Google", "assets/dashboard/service/google.png", []);
}

class Outlook extends Service {
  Outlook() : super("Outlook", "assets/dashboard/service/outlook.png", []);
}

class Instagram extends Service {
  Instagram()
      : super("Instagram", "assets/dashboard/service/instagram.png", []);
}

class Facebook extends Service {
  Facebook() : super("Facebook", "assets/dashboard/service/facebook.png", []);
}

class Github extends Service {
  Github() : super("Github", "assets/dashboard/service/github.png", []);
}

class Service {
  Service(this.name, this.image, this.actions);

  String name;
  String image;
  List<String> actions;
}
