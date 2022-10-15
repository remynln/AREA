import 'dart:convert';

RegisterAnswer registerAnswerFromJson(String str) => RegisterAnswer.fromJson(json.decode(str));

String registerAnswerToJson(RegisterAnswer data) => json.encode(data.toJson());

class RegisterAnswer {
  RegisterAnswer({
    this.token = "",
  });

  String token;

  factory RegisterAnswer.fromJson(Map<String, dynamic> json) => RegisterAnswer(
    token: json["token"],
  );

  Map<String, dynamic> toJson() => {
    "token": token,
  };
}
