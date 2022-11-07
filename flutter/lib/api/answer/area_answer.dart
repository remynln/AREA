// To parse this JSON data, do
//
//     final areaAnswer = areaAnswerFromJson(jsonString);

import 'dart:convert';

List<AreaAnswer> areaAnswerFromJson(String str) => List<AreaAnswer>.from(json.decode(str).map((x) => AreaAnswer.fromJson(x)));

String areaAnswerToJson(List<AreaAnswer> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class AreaAnswer {
  AreaAnswer({
    required this.id,
    required this.title,
    required this.description,
    required this.action,
    this.condition = "",
    required this.reaction,
    required this.status,
  });

  String id;
  String title;
  String description;
  String action;
  String condition;
  String reaction;
  String status;

  factory AreaAnswer.fromJson(Map<String, dynamic> json) => AreaAnswer(
    id: json["id"],
    title: json["title"],
    description: json["description"],
    action: json["action"],
    reaction: json["reaction"],
    status: json["status"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "title": title,
    "description": description,
    "action": action,
    "reaction": reaction,
    "status": status,
  };
}
