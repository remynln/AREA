import 'package:flutter/material.dart';

class AnimateSlide extends StatefulWidget {
  const AnimateSlide({Key? key}) : super(key: key);

  @override
  State<AnimateSlide> createState() => _AnimateSlideState();
}

class _AnimateSlideState extends State<AnimateSlide>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _position;
  late Animation<double> _opacity;

  @override
  void initState() {
    _controller = AnimationController(
        vsync: this, duration: Duration(milliseconds: 1000));
    _position = Tween<double>(begin: 100, end: 0)
        .animate(CurvedAnimation(parent: _controller, curve: Interval(0, 1)))
      ..addListener(() {
        setState(() {});
      });
    _opacity = Tween<double>(begin: 0, end: 1)
        .animate(CurvedAnimation(parent: _controller, curve: Interval(0.5, 1)))
      ..addListener(() {
        setState(() {});
      });
    _controller.forward();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        Padding(
          padding: EdgeInsets.only(top: _position.value),
          child: Opacity(
            opacity: _opacity.value,
            child: Image.asset(
              'assets/sergify.png',
              height: 200,
              width: 500,
              fit: BoxFit.fitWidth,
              scale: 1,
            ),
          ),
        ),
      ],
    );
  }
}
