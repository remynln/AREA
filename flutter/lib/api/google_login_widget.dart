// import 'dart:convert';
//
// import 'package:flutter/material.dart';
// import 'package:webview_flutter/webview_flutter.dart';
//
// class GoogleLogin extends StatefulWidget {
//   String html_page;
//
//   @override
//   State<GoogleLogin> createState() =>
//       _GoogleLoginState(html_page: this.html_page);
//
//   GoogleLogin({required this.html_page});
// }
//
// class _GoogleLoginState extends State<GoogleLogin> {
//   String html_page;
//   late WebViewController _controller;
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('Google')),
//       body: WebView(
//         initialUrl: 'about:blank',
//         onWebViewCreated: (WebViewController webViewController) {
//           _controller = webViewController;
//           openGoogleLoginPage(this.html_page);
//         },
//       ),
//     );
//   }
//
//   openGoogleLoginPage(String html_page) async {
//     _controller.loadUrl(Uri.dataFromString(html_page,
//         mimeType: 'text/html', encoding: Encoding.getByName('utf-8'))
//         .toString());
//   }
//
//   _GoogleLoginState({required this.html_page});
// }
