class ActionService {
  ActionService(this.name, this.description, this.parameters, this.properties);

  String name;
  String description;
  Map<String, dynamic> parameters;
  Map<String, dynamic> properties;
}

class ReactionService {
  ReactionService(this.name, this.description, this.properties);

  String name;
  String description;
  Map<String, dynamic> properties;
}