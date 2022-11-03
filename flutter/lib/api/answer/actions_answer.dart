import 'dart:convert';

List<ActionsAnswer> actionsAnswerFromJson(String str) => List<ActionsAnswer>.from(json.decode(str).map((x) => ActionsAnswer.fromJson(x)));

String actionAnswerToJson(List<ActionsAnswer> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class ActionsAnswer {
  ActionsAnswer({
    this.name = "",
    this.description = "",
    this.parameters = const {},
    this.properties = const {},
    this.detail = false
  });

  String name;
  String description;
  Map<String, dynamic> parameters;
  Map<String, dynamic> properties;
  bool detail;

  factory ActionsAnswer.fromJson(Map<String, dynamic> json) => ActionsAnswer(
    name: json["name"],
    description: json["description"],
  );

  Map<String, dynamic> toJson() => {
    "name": name,
    "description": description,
  };
}

ActionAnswerDetails actionAnswerDetailsFromJson(String str) => ActionAnswerDetails.fromJson(json.decode(str));

String actionAnswerDetailsToJson(ActionAnswerDetails data) => json.encode(data.toJson());

class ActionAnswerDetails {
  ActionAnswerDetails({
    this.parameters = const {},
    this.properties = const {},
  });

  Map<String, dynamic> parameters;
  Map<String, dynamic> properties;

  factory ActionAnswerDetails.fromJson(Map<String, dynamic> json) => ActionAnswerDetails(
    parameters: json["parameters"],
    properties: json["properties"],
  );

  Map<String, dynamic> toJson() => {
    "parameters": parameters,
    "properties": properties,
  };
}