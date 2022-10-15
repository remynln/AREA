import 'dart:convert';
import 'dart:developer';

import 'package:http/http.dart' as http;

import 'package:area/api/endpoints.dart';
import 'package:area/api/answer/login_answer.dart';
import 'package:area/api/answer/register_answer.dart';

class ApiService {
  Future<RegisterAnswer?> handleRegister(String email, String username, String password) async {
    try {
      var url = Uri.parse(ApiConstants.baseUrl + ApiConstants.loginEndpoint);
      Map body_data = {
        'email': email,
        'username': username,
        'password': password
      };
      var response = await http.post(url, body: jsonEncode(body_data));
      if (response.statusCode == 200) {
        RegisterAnswer _model = registerAnswerFromJson(response.body);
        return _model;
      } else if (response.statusCode == 409) {
        log('email or username already exist !');
      }
      return null;
    } catch (e) {
      log(e.toString());
    }
  }
  Future<LoginAnswer?> handleLogin(String email, String password) async {
    try {
      var url = Uri.parse(ApiConstants.baseUrl + ApiConstants.loginEndpoint);
      Map body_data = {
        'email': email,
        'password': password
      };
      var response = await http.post(url, body: jsonEncode(body_data));
      if (response.statusCode == 200) {
        LoginAnswer _model = loginAnswerFromJson(response.body);
        return _model;
      } else if (response.statusCode == 403) {
        log('Username or password is incorrect');
      }
      return null;
    } catch (e) {
      log(e.toString());
    }
  }
}
