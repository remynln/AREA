import 'package:flutter/material.dart';

import 'package:area/front/standard_pages/dashboard.dart';
import 'package:area/front/standard_pages/workflows.dart';
import 'package:area/front/standard_pages/create.dart';

class PagesWidget extends StatefulWidget {
  final String token;
  final int index;

  const PagesWidget({Key? key, required this.token, required this.index})
      : super(key: key);

  @override
  State<PagesWidget> createState() => _PagesWidgetState();
}

class _PagesWidgetState extends State<PagesWidget> {
  late String token;
  late int _index;

  late DashboardWidget dashboard;
  late CreateWidget create;
  late WorkflowsWidget workflows;
  static List<Widget> _pagesWidget = <Widget>[];

  @override
  void initState() {
    super.initState();
    token = widget.token;
    _index = widget.index;
    dashboard = DashboardWidget(token: token);
    create = CreateWidget(token: token);
    workflows = WorkflowsWidget(token: token);
    _pagesWidget = [dashboard, create, workflows];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(child: _pagesWidget[_index]),
        bottomNavigationBar: Container(
          decoration: const BoxDecoration(boxShadow: <BoxShadow>[
            BoxShadow(
                color: Colors.white,
                blurRadius: 0.5,
                blurStyle: BlurStyle.solid)
          ]),
          child: BottomNavigationBar(
            items: const <BottomNavigationBarItem>[
              BottomNavigationBarItem(
                  icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
              BottomNavigationBarItem(
                  icon: Icon(Icons.add_box_rounded,
                      color: Colors.white, size: 40),
                  activeIcon: Icon(Icons.add_box_rounded, size: 40),
                  label: 'Create'),
              BottomNavigationBarItem(
                  icon: Icon(Icons.bookmark_border_rounded),
                  label: 'Workflows'),
            ],
            selectedItemColor: const Color.fromRGBO(238, 13, 36, 100),
            unselectedItemColor: Colors.white,
            backgroundColor: Colors.black,
            iconSize: 20,
            showSelectedLabels: false,
            showUnselectedLabels: false,
            currentIndex: _index,
            onTap: (int index) {
              setState(() {
                _index = index;
              });
            },
          ),
        ));
  }
}
