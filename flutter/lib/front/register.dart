import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'package:area/api/answer/register_answer.dart';
import 'package:area/api/service.dart';

import 'package:area/front/login.dart';

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
    registerAnswer = await ApiService()
        .handleRegister(emailController.text, nameController.text, passwordController.text);
    print(registerAnswer?.token);
  }

  Color getColor(Set<MaterialState> states) {
    print("GET COLOR");
    if (emailController.text.isEmpty || nameController.text.isEmpty || passwordController.text.length < 8)
      return (Colors.grey);
    else
      return (Color.fromRGBO(191, 27, 44, 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: ListView(children: <Widget>[
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
                  Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const LoginWidget())
                  );
                },
                style: TextButton.styleFrom(
                  foregroundColor: Color.fromRGBO(191, 27, 44, 1),
                ),
                child: const Text('Login here', style: TextStyle(fontSize: 16)),
              ),
            ])));
  }
}