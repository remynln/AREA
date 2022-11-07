import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'package:area/api/answer/register_answer.dart';
import 'package:area/api/request.dart';

import 'package:area/front/ip.dart';
import 'package:area/front/connection_pages/login.dart';
import 'package:fluttertoast/fluttertoast.dart';

class RegisterWidget extends StatefulWidget {
  const RegisterWidget({Key? key}) : super(key: key);

  @override
  State<RegisterWidget> createState() => _RegisterWidgetState();
}

class _RegisterWidgetState extends State<RegisterWidget> {
  TextEditingController nameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  late RegisterAnswer? registerAnswer;

  MaterialStatesController? registerController = MaterialStatesController();

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void handleRegister() async {
    if (getCredentialStatus() == false) return;
    registerAnswer = await ApiService().handleRegister(
        emailController.text, nameController.text, passwordController.text);
    if (registerAnswer == null) {
      Fluttertoast.showToast(
          msg: "Error : Invalid IP Address!",
          timeInSecForIosWeb: 3,
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color.fromRGBO(191, 27, 44, 1),
          textColor: Colors.white,
          fontSize: 14);
    } else if (registerAnswer?.message != null) {
      Fluttertoast.showToast(
          msg: "Error : ${registerAnswer?.message}!",
          timeInSecForIosWeb: 3,
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          backgroundColor: Color.fromRGBO(191, 27, 44, 1),
          textColor: Colors.white,
          fontSize: 14);
    } else
      print(registerAnswer?.token);
  }

  bool getCredentialStatus() {
    if (emailController.text.isEmpty ||
        nameController.text.isEmpty ||
        passwordController.text.length < 8) return false;
    return true;
  }

  Color getColor(Set<MaterialState> states) {
    if (getCredentialStatus() == false)
      return (Colors.grey);
    else
      return (Color.fromRGBO(191, 27, 44, 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
      Container(
        height: 30,
        alignment: Alignment.topLeft,
        child: ElevatedButton(
            child: const Text('IP'),
            onPressed: () {
              openIP(context);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all<Color>(
                    const Color.fromRGBO(191, 27, 44, 1)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(9.0))))),
      ),
      Image.asset(
        'assets/sergify.png',
        height: 200,
        width: 500,
        fit: BoxFit.fitWidth,
        scale: 1,
      ),
      SizedBox(height: 30),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: TextField(
          controller: nameController,
          onChanged: (_) {
            registerController!.notifyListeners();
          },
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "Username",
            fillColor: Color.fromRGBO(68, 68, 68, 1),
          ),
        ),
      ),
      SizedBox(height: 20),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: TextField(
          controller: emailController,
          onChanged: (_) {
            registerController!.notifyListeners();
          },
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "Email",
            fillColor: Color.fromRGBO(68, 68, 68, 1),
          ),
        ),
      ),
      SizedBox(height: 20),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: TextField(
          controller: passwordController,
          onChanged: (_) {
            registerController!.notifyListeners();
          },
          obscureText: true,
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center,
          decoration: InputDecoration(
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(14.0)),
            filled: true,
            hintStyle: TextStyle(
                color: Color.fromRGBO(148, 163, 184, 1),
                fontStyle: FontStyle.italic),
            hintText: "Password",
            fillColor: Color.fromRGBO(68, 68, 68, 1),
          ),
        ),
      ),
      SizedBox(height: 30),
      Container(
        height: 45,
        padding: const EdgeInsets.symmetric(horizontal: 60),
        child: ElevatedButton(
            statesController: registerController,
            child: const Text('REGISTER'),
            onPressed: () {
              handleRegister();
              print(nameController.text);
              print(emailController.text);
              print(passwordController.text);
            },
            style: ButtonStyle(
                backgroundColor: MaterialStateProperty.resolveWith(getColor),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(9.0))))),
      ),
      SizedBox(height: 20),
      Text("Already have an account?",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, color: Colors.white)),
      TextButton(
        onPressed: () {
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => const LoginWidget()));
        },
        style: TextButton.styleFrom(
          foregroundColor: Color.fromRGBO(191, 27, 44, 1),
        ),
        child: const Text('Login here', style: TextStyle(fontSize: 16)),
      ),
    ])));
  }
}
