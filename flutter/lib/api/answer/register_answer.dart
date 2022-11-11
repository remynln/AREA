import 'dart:convert';

RegisterAnswer registerAnswerFromJson(String str) => RegisterAnswer.fromJson(json.decode(str));

String registerAnswerToJson(RegisterAnswer data) => json.encode(data.toJson());

class RegisterAnswer {
  RegisterAnswer({
    this.token,
    this.message
  });

  String? token;
  String? message;

  factory RegisterAnswer.fromJson(Map<String, dynamic> json) => RegisterAnswer(
    token: json["token"],
    message: json["message"]
  );

  Map<String, dynamic> toJson() => {
    "token": token,
    "message": message
  };
}
