import 'package:flutter/material.dart';

import 'package:area/front/standard_pages/dashboard.dart';

class PagesWidget extends StatefulWidget {
  final String token;

  const PagesWidget({Key? key, required this.token}) : super(key: key);

  @override
  State<PagesWidget> createState() => _PagesWidgetState();
}

class _PagesWidgetState extends State<PagesWidget> {
  late String token;
  int _index = 0;

  late DashboardWidget dashboard;
  static List<Widget> _pagesWidget = <Widget>[];

  @override
  void initState() {
    super.initState();
    token = widget.token;
    dashboard = DashboardWidget(token: token);
    _pagesWidget = [
      dashboard,
      const Text("NOTIF", style: TextStyle(color: Colors.white)),
      const Text("WORKFLOW", style: TextStyle(color: Colors.white)),
      ElevatedButton(onPressed: (){setState(() {
        _index = 2;
        print("A");
      });}, child: Text("HEY", style: TextStyle(color: Colors.white)))
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: _pagesWidget[_index]),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: Colors.white,
              blurRadius: 0.5,
              blurStyle: BlurStyle.solid
            )
          ]
        ),
        child: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
            BottomNavigationBarItem(
                icon: Icon(Icons.notifications_none), label: 'Notification'),
            BottomNavigationBarItem(
                icon: Icon(Icons.bookmark_border_rounded), label: 'Workflows'),
            BottomNavigationBarItem(
                icon: Icon(Icons.settings_outlined), label: 'Settings'),
          ],
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color.fromRGBO(238, 13, 36, 100),
          unselectedItemColor: Colors.white,
          backgroundColor: Colors.black,
          showSelectedLabels: false,
          showUnselectedLabels: false,
          currentIndex: _index,
          onTap: (int index) {
            setState(() {
              _index = index;
            });
          },
        ),
      )
    );
  }
}
