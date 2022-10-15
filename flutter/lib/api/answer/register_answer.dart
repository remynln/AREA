import 'dart:convert';

Register registerFromJson(String str) => Register.fromJson(json.decode(str));

String registerToJson(Register data) => json.encode(data.toJson());

class Register {
  Register({
    this.token = "",
  });

  String token;

  factory Register.fromJson(Map<String, dynamic> json) => Register(
    token: json["token"],
  );

  Map<String, dynamic> toJson() => {
    "token": token,
  };
}
