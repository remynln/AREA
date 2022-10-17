// To parse this JSON data, do
//
//     final googleAnswer = googleAnswerFromJson(jsonString);

import 'dart:convert';

GoogleLoginAnswer googleLoginAnswerFromJson(String str) => GoogleLoginAnswer.fromJson(json.decode(str));

String googleLoginAnswerToJson(GoogleLoginAnswer data) => json.encode(data.toJson());

class GoogleLoginAnswer {
  GoogleLoginAnswer({
    this.token = "",
  });

  String token;

  factory GoogleLoginAnswer.fromJson(Map<String, dynamic> json) => GoogleLoginAnswer(
    token: json["token"],
  );

  Map<String, dynamic> toJson() => {
    "token": token,
  };
}
