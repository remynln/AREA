import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:ffi';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

import 'package:area/api/endpoints.dart';
import 'package:area/api/answer/login_answer.dart';
import 'package:area/api/answer/register_answer.dart';
import 'package:area/api/answer/services_answer.dart';
import 'package:area/api/answer/actions_answer.dart';
import 'package:area/api/answer/reactions_answer.dart';
import 'package:area/api/answer/area_answer.dart';
import 'package:area/api/answer/user_answer.dart';

import 'package:url_launcher/url_launcher.dart';

class Area {
  String title;
  String description;
  Map<String, dynamic> action;
  String condition;
  Map<String, dynamic> reaction;

  Area(
      {required this.title,
      required this.description,
      required this.action,
      this.condition = "",
      required this.reaction});

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area(
        title: json["title"] as String,
        description: json["description"] as String,
        action: json["action"] as Map<String, dynamic>,
        condition: json["condition"] as String,
        reaction: json["reaction"] as Map<String, dynamic>);
  }

  bool valueIsNumber(String value) {
    try {
      double.parse(value);
    } catch (_) {
      return (false);
    }
    return (true);
  }

  Map<String, dynamic> getParams(Map<String, dynamic> params) {
    Map<String, dynamic> result = {};

    params.forEach((key, value) {
      if (valueIsNumber(value)) {
        result.addAll({key: int.parse(value)});
      }
      else {
        result.addAll({key: value});
      }
    });
    return result;
  }

  Map<String, dynamic> toJson() => {
        "title": title,
        "description": description,
        "action": {
          "name": action["name"],
          "params": getParams(action["params"])
        },
        "condition": condition,
        "reaction": {
          "name": reaction["name"],
          "params": getParams(reaction["params"])
        }
      };
}

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
        model[index].serviceName = service;
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

  Future<List<ReactionsAnswer>?> getReactionsFromService(
      String token, String service) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.reactionsEndpoint(service));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.get(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        throw response.body;
      }
      List<ReactionsAnswer> model = reactionsAnswerFromJson(response.body);
      for (var index = 0; index < model.length; index++) {
        model[index].serviceName = service;
        uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
            ApiConstants.reactionEndpoint(service, model[index].name));
        response = await http.get(uri, headers: headers);
        if (response.statusCode != 200) {
          log(response.statusCode.toString());
          throw response.body;
        }
        ReactionsAnswerDetails detail =
            reactionAnswerDetailsFromJson(response.body);
        model[index].parameters = detail.parameters;
      }
      return model;
    } catch (e) {
      log(e.toString());
    }
    return null;
  }

  Future<String> createArea(String title, String description, String token,
      ActionsAnswer action, String condition, ReactionsAnswer reaction) async {
    try {
      Area theArea = Area(
          title: title,
          description: description,
          action: {
            "name": "${action.serviceName}/${action.name}",
            "params": action.parameters
          },
          condition: condition,
          reaction: {
            "name": "${reaction.serviceName}/${reaction.name}",
            "params": reaction.parameters
          });

      final uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.createEndpoint);
      final headers = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
        HttpHeaders.contentTypeHeader: 'application/json'
      };

      var response =
          await http.post(uri, headers: headers, body: jsonEncode(theArea.toJson()));
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        if (json.decode(response.body).containsKey("message")) {
          return json.decode(response.body)["message"];
        }
      } else
        return json.decode(response.body)["message"];
    } catch (e) {
      log(e.toString());
    }
    return "";
  }

  Future<void> connectToService(
      String token, String service_name, String callback) async {
    try {
      final uri = Uri.http(
          "${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.serviceEndpoint(service_name),
          {'callback': callback, 'jwt': token});
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw "Uri($uri) could not be launched";
      }
    } catch (e) {
      log(e.toString());
    }
  }

  Future<void> disconnectToService(String token, String service_name) async {
    try {
      final uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.serviceEndpoint(service_name));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.delete(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
      }
    } catch (e) {
      log(e.toString());
    }
  }

  Future<List<AreaAnswer>?> getUserAreas(String token,
      {String user_id = "me"}) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.userAreasEndpoint(user_id: user_id));
      log(uri.toString());
      log(token);
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.get(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        return [];
      }
      List<AreaAnswer> model = areaAnswerFromJson(response.body);
      String token_info = token.split('.')[1];
      token_info += token_info.length % 4 == 0
          ? ''
          : (token_info.length % 4 == 3 ? '=' : '==');
      if (jsonDecode(utf8.fuse(base64).decode(token_info))["username"] ==
              "root" &&
          jsonDecode(utf8.fuse(base64).decode(token_info))["admin"] == true) {
        return model;
      }
      for (var index = 0; index < model.length; index++) {
        uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
            ApiConstants.areaEndpoint(model[index].id));
        response = await http.get(uri, headers: headers);
        if (response.statusCode != 200) {
          log(response.statusCode.toString());
          throw response.body;
        }
        Map<String, dynamic> decoded = jsonDecode(response.body);
        if (decoded.containsKey("condition")) {
          model[index].condition = decoded["condition"];
        }
        if (decoded["action"].containsKey("parameters")) {
          model[index].action_params = decoded["action"]["parameters"];
        }
        if (decoded["reaction"].containsKey("parameters")) {
          model[index].reaction_params = decoded["reaction"]["parameters"];
        }
      }
      return model;
    } catch (e) {
      log(e.toString());
    }
    return [];
  }

  Future<void> enableArea(String token, area_id) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.enableAreaEndpoint(area_id));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.put(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
      }
    } catch (e) {
      log(e.toString());
    }
  }

  Future<void> disableArea(String token, area_id) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.disableAreaEndpoint(area_id));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.put(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
      }
    } catch (e) {
      log(e.toString());
    }
  }

  Future<void> deleteArea(String token, area_id) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.areaEndpoint(area_id));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.delete(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        print(response.body);
      }
    } catch (e) {
      log(e.toString());
    }
  }

  Future<List<UserAnswer>> getUsers(String token,
      {int limit = 100, int page = 0}) async {
    try {
      var token_info = token.split('.')[1];
      token_info += token_info.length % 4 == 0
          ? ''
          : (token_info.length % 4 == 3 ? '=' : '==');
      String name =
          jsonDecode(utf8.fuse(base64).decode(token_info))["username"];

      final uri = Uri.http(
          "${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.usersEndpoint,
          {"limit": limit.toString(), "page": page.toString()});
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.get(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        print(response.body);
      }
      List<UserAnswer> answers = [];
      List<dynamic> users = jsonDecode(response.body);
      for (Map<String, dynamic> element in users) {
        if (element["admin"] == true && name != "root") {
          continue;
        }
        UserAnswer? current =
            await getUserInformation(token, user_id: element["id"]);
        if (current == null) {
          continue;
        }
        current?.id = element["id"];
        if (element["admin"] == true) {
          current?.isAdmin = true;
        }
        answers.add(current!);
      }
      return answers;
    } catch (e) {
      log(e.toString());
    }
    return [];
  }

  Future<UserAnswer?> getUserInformation(String token,
      {String user_id = "me"}) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.userEndpoint(user_id));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.get(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        print(response.body);
      }
      UserAnswer user = userAnswerFromJson(response.body);
      user.id = user_id;
      return user;
    } catch (e) {
      log(e.toString());
    }
  }

  Future<void> updateUserInformation(String token, String new_username,
      {String user_id = "me",
      bool isAdmin = false,
      bool updateAdmin = false}) async {
    try {
      var token_info = token.split('.')[1];
      token_info += token_info.length % 4 == 0
          ? ''
          : (token_info.length % 4 == 3 ? '=' : '==');
      String name =
          jsonDecode(utf8.fuse(base64).decode(token_info))["username"];

      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.userEndpoint(user_id));
      Map<String, dynamic> body = {"username": new_username};
      if (isAdmin && name == "root") {
        body["admin"] = updateAdmin.toString();
      }
      final headers = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
        HttpHeaders.contentTypeHeader: 'application/json'
      };
      var response =
          await http.put(uri, headers: headers, body: jsonEncode(body));
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
      }
      print(jsonEncode(body));
      print(uri);
      print(headers);
      print(response.body);
    } catch (e) {
      log(e.toString());
    }
  }

  Future<void> deleteUser(String token, {String user_id = "me"}) async {
    try {
      var uri = Uri.http("${ApiConstants.ip}:${ApiConstants.port}",
          ApiConstants.userEndpoint(user_id));
      final headers = {HttpHeaders.authorizationHeader: 'Bearer $token'};
      var response = await http.delete(uri, headers: headers);
      if (response.statusCode != 200) {
        log(response.statusCode.toString());
        print(response.body);
      }
    } catch (e) {
      log(e.toString());
    }
  }
}
