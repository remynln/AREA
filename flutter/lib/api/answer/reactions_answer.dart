import 'dart:convert';

List<ReactionsAnswer> reactionsAnswerFromJson(String str) => List<ReactionsAnswer>.from(json.decode(str).map((x) => ReactionsAnswer.fromJson(x)));

String reactionAnswerToJson(List<ReactionsAnswer> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class ReactionsAnswer {
  ReactionsAnswer({
    this.name = "",
    this.description = "",
    this.parameters = const {},
    this.detail = false
  });

  String name;
  String description;
  Map<String, dynamic> parameters;
  bool detail;

  factory ReactionsAnswer.fromJson(Map<String, dynamic> json) => ReactionsAnswer(
    name: json["name"],
    description: json["description"],
  );

  Map<String, dynamic> toJson() => {
    "name": name,
    "description": description,
  };
}

ReactionsAnswerDetails reactionAnswerDetailsFromJson(String str) => ReactionsAnswerDetails.fromJson(json.decode(str));

String reactionAnswerDetailsToJson(ReactionsAnswerDetails data) => json.encode(data.toJson());

class ReactionsAnswerDetails {
  ReactionsAnswerDetails({
    this.parameters = const {},
  });

  Map<String, dynamic> parameters;

  factory ReactionsAnswerDetails.fromJson(Map<String, dynamic> json) => ReactionsAnswerDetails(
    parameters: json["parameters"],
  );

  Map<String, dynamic> toJson() => {
    "parameters": parameters,
  };
}