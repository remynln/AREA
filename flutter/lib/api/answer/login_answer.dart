import 'dart:convert';

LoginAnswer loginAnswerFromJson(String str) => LoginAnswer.fromJson(json.decode(str));

String loginAnswerToJson(LoginAnswer data) => json.encode(data.toJson());

class LoginAnswer {
  LoginAnswer({
    this.token = "",
  });

  String token;

  factory LoginAnswer.fromJson(Map<String, dynamic> json) => LoginAnswer(
    token: json["token"],
  );

  Map<String, dynamic> toJson() => {
    "token": token,
  };
}
