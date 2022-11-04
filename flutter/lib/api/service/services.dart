import 'package:flutter/material.dart';

class Services {
  static Google google = Google();
  static Microsoft microsoft = Microsoft();
  static Spotify spotify = Spotify();
  static Deezer deezer = Deezer();

  static List<Service> BasicServices = [google, microsoft, spotify, deezer];
  static List<Service> GamesServices = [];
}

class Google extends Service {
  Google()
      : super("google", "assets/dashboard/service/google_connected.png",
            "assets/dashboard/service/google_not_connected.png", []);
}

class Microsoft extends Service {
  Microsoft()
      : super("microsoft", "assets/dashboard/service/microsoft_connected.png",
      "assets/dashboard/service/microsoft_not_connected.png", []);
}

class Spotify extends Service {
  Spotify()
      : super("spotify", "assets/dashboard/service/spotify_connected.png",
      "assets/dashboard/service/spotify_not_connected.png", []);
}

class Deezer extends Service {
  Deezer()
      : super("deezer", "assets/dashboard/service/deezer_connected.png",
      "assets/dashboard/service/deezer_not_connected.png", []);
}

class Service {
  Service(
      this.name, this.connected_image, this.not_connected_image, this.actions);

  String name;
  String connected_image;
  String not_connected_image;
  List<String> actions;
}
