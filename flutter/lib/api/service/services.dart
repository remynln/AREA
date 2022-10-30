import 'package:flutter/material.dart';

class Services {
  static Twitter twitter = Twitter();
  static Google google = Google();
  static Outlook outlook = Outlook();
  static Instagram instagram = Instagram();
  static Facebook facebook = Facebook();
  static Github github = Github();

  static List<Service> BasicServices = [
    twitter,
    google,
    outlook,
    instagram,
    facebook,
    github
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
