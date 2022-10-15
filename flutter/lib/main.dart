import 'package:flutter/material.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  static const String _title = 'Sergify';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: _title,
        theme: new ThemeData(scaffoldBackgroundColor: Colors.black),
        home: AnimatedSplashScreen(
          splash: 'assets/sergify.png',
          splashIconSize: double.infinity,
          backgroundColor: Colors.black,
          nextScreen: MyStatefulWidget(),
          splashTransition: SplashTransition.fadeTransition,
          duration: 3000,
        ));
  }
}

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({Key? key}) : super(key: key);

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  TextEditingController nameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {

    return Scaffold(
        body: Center(
            child: ListView(
      children: <Widget>[
        Image.asset(
          'assets/sergify.png',
          height: 200,
          width: 500,
          fit: BoxFit.fitWidth,
          scale: 1,
        ),
        SizedBox(height: 30),
        Container(
            alignment: Alignment.topCenter,
            padding: const EdgeInsets.all(10),
            child: const Text('Login',
                style: TextStyle(
                    fontSize: 35,
                    color: Colors.white,
                    fontWeight: FontWeight.bold))),
        SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(10),
          child: TextField(
            controller: nameController,
            style: TextStyle(color: Colors.white),
            decoration: const InputDecoration(
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white),
                ),
                labelText: 'User Name',
                labelStyle: TextStyle(color: Colors.white)),
          ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
          child: TextField(
            style: TextStyle(color: Colors.white),
            controller: passwordController,
            decoration: const InputDecoration(
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white),
                ),
                border: OutlineInputBorder(),
                labelText: 'Password',
                labelStyle: TextStyle(color: Colors.white)),
          ),
        ),
        TextButton(
          onPressed: () {
            //forgot password screen
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.red,
          ),
          child: const Text(
            'Forgot Password',
          ),
        ),
        Container(
            height: 50,
            padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
            child: ElevatedButton(
              child: const Text('Login'),
              onPressed: () {
                print(nameController.text);
                print(passwordController.text);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color.fromRGBO(191, 27, 44, 1),
              ),
            )),
        SizedBox(height: 30),
        Container(
            alignment: Alignment.topCenter,
            child: const Text('Or continue with',
                style: TextStyle(fontSize: 15, color: Colors.grey))),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 10.0),
          child: ElevatedButton.icon(
            onPressed: () {
              print("google");
            },
            icon: Image.asset("assets/google.png", width: 18),
            style: OutlinedButton.styleFrom(
                side: BorderSide(
                    width: 1.0, color: Color.fromRGBO(191, 27, 44, 1)),
                backgroundColor: Colors.transparent),
            label: Text('Google'), // <-- Text
          ),
        ),
        ListTile(
            title: Row(children: <Widget>[
          Text("Don't have an account?",
              style: TextStyle(fontSize: 15, color: Colors.grey)),
          TextButton(
            onPressed: () {
              //forgot password screen
            },
            style: TextButton.styleFrom(
              foregroundColor: Colors.white,
            ),
            child: const Text(
              'Create now',
            ),
          ),
        ], mainAxisAlignment: MainAxisAlignment.center))
      ],
    )));
  }
}
