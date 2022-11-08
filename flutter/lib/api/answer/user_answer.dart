import 'dart:convert';

UserAnswer userAnswerFromJson(String str) => UserAnswer.fromJson(json.decode(str));

String userAnswerToJson(UserAnswer data) => json.encode(data.toJson());

class UserAnswer {
  UserAnswer({
    this.id = "me",
    required this.username,
    required this.email,
    this.createdAt,
    this.updatedAt,
  });

  String id;
  String username;
  String email;
  dynamic createdAt;
  dynamic updatedAt;

  factory UserAnswer.fromJson(Map<String, dynamic> json) => UserAnswer(
    username: json["username"],
    email: json["email"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
  );

  Map<String, dynamic> toJson() => {
    "username": username,
    "email": email,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
  };
}
