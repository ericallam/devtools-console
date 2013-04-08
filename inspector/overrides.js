// Takes the place of the normal RuntimeAgent (the thing that runs the commands)
// Defined in runtime_stub.js
var runtimeAgentStub = new RuntimeAgentStub();

WebInspector.loaded = function()
{
    InspectorBackend.loadFromJSONIfNeeded("../Inspector.json");
    WebInspector.dockController = new WebInspector.DockController();

    WebInspector.doLoadedDone();

    // This gets called whenever the front-end needs information from the backend
    // Like when a user submits a line on the console or the console wants to do
    // some autocomplete
    InspectorFrontendHost.sendMessageToBackend = function(message){
      var message = JSON.parse(message);
      console.log(message);

      // Running a command in the console
      if(message.method === "Runtime.evaluate" && message.params.objectGroup === "console"){
        var params = message.params
        runtimeAgentStub.evaluate(message.params, function(result){
          var response = {}
          response.id = message.id;
          response.result = result;
          InspectorBackend.dispatch(response);
        });
      }else if(message.method === "Runtime.evaluate" && message.params.objectGroup === "completion"){
        // Autocompletion
        var params = message.params
        runtimeAgentStub.evaluate(message.params, function(result){
          var response = {}
          response.id = message.id;
          response.result = result;
          InspectorBackend.dispatch(response);
        });
      }else if(message.method === "Runtime.getProperties"){
        // Getting the list of properties on a js object
        runtimeAgentStub.getProperties(message.params, function(result){
          var response = {}
          response.id = message.id;
          response.result = result;
          InspectorBackend.dispatch(response);
        });
      }else if(message.method === "Runtime.callFunctionOn"){
        var params = message.params
        runtimeAgentStub.callFunctionOn(message.params, function(result){
          var response = {}
          response.id = message.id;
          response.result = result;
          InspectorBackend.dispatch(response);
        });
      }else if(message.method === "Runtime.releaseObjectGroup"){
        runtimeAgentStub.releaseObjectGroup(message.params, function(result){
        });
      }
    }

    WebInspector._doLoadedDoneWithCapabilities();
}

// Turn off all panels except for the console panel
InspectorFrontendHost.hiddenPanels = function() {
  return 'elements,resources,timeline,network,audits,scripts,profiles';
};

WebInspector.notifications.addEventListener(WebInspector.Events.InspectorLoaded, function(){ 
  WebInspector.consoleView._registerShortcuts();
  WebInspector.inspectorView.setCurrentPanel(WebInspector.inspectorView.panel("console"))
})