import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:http/http.dart' as http;

import 'package:area/api/endpoints.dart';
import 'package:area/api/answer/login_answer.dart';
import 'package:area/api/answer/register_answer.dart';
import 'package:area/api/answer/services_answer.dart';
import 'package:area/api/answer/actions_answer.dart';
import 'package:area/api/area.dart';

import 'package:url_launcher/url_launcher.dart';

class ApiService {
  Future<RegisterAnswer?> handleRegister(
      String email, String username, String password) async {
    try {
      final uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.registerEndpoint);
      final headers = {HttpHeaders.contentTypeHeader: 'application/json'};
      final body_data = {
        'email': email,
        'username': username,
        'password': password
      };
      var response =
          await http.post(uri, headers: headers, body: json.encode(body_data));
      if (response.statusCode != 200) log(response.statusCode.toString());
      RegisterAnswer _model = registerAnswerFromJson(response.body);
      return _model;
    } catch (e) {
      log(e.toString());
    }
  }

  Future<LoginAnswer?> handleLogin(String email, String password) async {
    try {
      final uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.loginEndpoint);
      final headers = {HttpHeaders.contentTypeHeader: 'application/json'};
      final body_data = {'email': email, 'password': password};
      var response =
          await http.post(uri, headers: headers, body: json.encode(body_data));
      if (response.statusCode != 200) log(response.statusCode.toString());
      LoginAnswer _model = loginAnswerFromJson(response.body);
      return _model;
    } catch (e) {
      log(e.toString());
    }
  }

  Future<void> handleGoogleLogin(String callback) async {
    try {
      final uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.googleLoginEndpoint, {'callback': callback});
      if (await canLaunchUrl(uri))
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      else
        throw "Uri($uri) could not be launched";
    } catch (e) {
      log(e.toString());
    }
  }

  Future<ServicesAnswer?> getConnectedServices(String token) async {
    try {
      final uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.servicesEndpoint);
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.get(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
      }
      ServicesAnswer model = servicesAnswerFromJson(response.body);
      return model;
    } catch (e) {
      log(e.toString());
    }
    return null;
  }

  Future<List<ActionsAnswer>?> getActionsFromService(
      String token, String service) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.actionsEndpoint(service));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.get(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        throw response.body;
      }
      List<ActionsAnswer> model = actionsAnswerFromJson(response.body);
      for (var index = 0; index < model.length; index++) {
        uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
            ApiConstants.actionEndpoint(service, model[index].name));
        response = await http.get(uri, headers: headers);
        if (response.statusCode != 200) {
          log(response.statusCode.toString());
          throw response.body;
        }
        ActionAnswerDetails detail = actionAnswerDetailsFromJson(response.body);
        model[index].parameters = detail.parameters;
        model[index].properties = detail.properties;
      }
      return model;
    } catch (e) {
      log(e.toString());
    }
    return null;
  }
}
