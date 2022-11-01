class ApiConstants {
  static String ip = "10.0.2.2.nip.io";
  static String port = "8080";
  static String registerEndpoint = '/auth/register';
  static String loginEndpoint = '/auth/login';
  static String googleLoginEndpoint = '/auth/service/google';
  static String unregisterEndpoint = '/auth/unregister';
  static String createEndpoint = '/area/create';
  static String servicesEndpoint = '/services';
  static String actionsEndpoint(String service_name) {
    return "/service/$service_name/actions";
  }
  static String reactionsEndpoint(String service_name) {
    return "/service/$service_name/reactions";
  }
  static String actionEndpoint(String service_name, String action_name) {
    return "/service/$service_name/action/$action_name";
  }
  static String reactionEndpoint(String service_name, String reaction_name) {
    return "/service/$service_name/reaction/$reaction_name";
  }
}