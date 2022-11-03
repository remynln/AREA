import 'dart:convert';

LoginAnswer loginAnswerFromJson(String str) => LoginAnswer.fromJson(json.decode(str));

String loginAnswerToJson(LoginAnswer data) => json.encode(data.toJson());

class LoginAnswer {
  LoginAnswer({
    this.token = "",
    this.message = ""
  });

  String? token;
  String? message;

  factory LoginAnswer.fromJson(Map<String, dynamic> json) => LoginAnswer(
    token: json["token"],
    message: json["message"]
  );

  Map<String, dynamic> toJson() => {
    "token": token,
    "message": message
  };
}
