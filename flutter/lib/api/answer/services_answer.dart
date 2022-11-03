import 'dart:convert';

ServicesAnswer servicesAnswerFromJson(String str) => ServicesAnswer.fromJson(json.decode(str));

String servicesAnswerToJson(ServicesAnswer data) => json.encode(data.toJson());

class ServicesAnswer {
  ServicesAnswer({
    required this.connected,
    required this.not_connected,
  });

  List<dynamic> connected;
  List<dynamic> not_connected;

  factory ServicesAnswer.fromJson(Map<String, dynamic> json) => ServicesAnswer(
    connected: List<dynamic>.from(json["connected"]?.map((x) => x) ?? []),
    not_connected: List<dynamic>.from(json["not_connected"]?.map((x) => x) ?? []),
  );

  Map<String, dynamic> toJson() => {
    "connected": List<dynamic>.from(connected.map((x) => x)),
    "not_connected": List<dynamic>.from(not_connected.map((x) => x)),
  };
}
