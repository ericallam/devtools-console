// WebInspector.loaded = function() {
//   // var socket = io.connect('http://' + window.location.host + '/');

//   // socket.on('error', console.error);
//   // socket.on('message', function(msg) {
//   //   InspectorBackend.dispatch(msg);
//   // });
//   // socket.on('connect', function() {
//   //   InspectorFrontendHost.sendMessageToBackend = WebInspector.socket.send.bind(WebInspector.socket);

//   //   WebInspector.doLoadedDone();
//   // });

//   // WebInspector.socket = socket;

//   // InspectorBackend.loadFromJSONIfNeeded();

  
// }

var runtimeAgentStub = new RuntimeAgentStub();

WebInspector.loaded = function()
{
    InspectorBackend.loadFromJSONIfNeeded("../Inspector.json");
    WebInspector.dockController = new WebInspector.DockController();

    WebInspector.doLoadedDone();

    InspectorFrontendHost.sendMessageToBackend = function(message){
      var message = JSON.parse(message);
      console.log(message);

      if(message.method === "Runtime.evaluate" && message.params.objectGroup === "console"){
        var params = message.params
        params.expression = localStorage['currentEditorValue'] + "\n\n" + params.expression;
        runtimeAgentStub.evaluate(message.params, function(result){
          var response = {}
          response.id = message.id;
          response.result = result;
          InspectorBackend.dispatch(response);
        });
      }else if(message.method === "Runtime.getProperties"){
        runtimeAgentStub.getProperties(message.params, function(result){
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

InspectorFrontendHost.hiddenPanels = function() {
  return 'elements,resources,timeline,network,audits,scripts,profiles';
};

WebInspector.notifications.addEventListener(WebInspector.Events.InspectorLoaded, function(){ 
  WebInspector.consoleView._registerShortcuts();
  WebInspector.inspectorView.setCurrentPanel(WebInspector.inspectorView.panel("console"))

  localStorage['currentEditorValue'] = localStorage['currentEditorValue'] || "";

  window.editor = new CodeMirror(document.getElementById("editor"), {
    mode: "javascript",
    value: localStorage['currentEditorValue'],
    lineNumbers: true
  })

  window.editor.on('change', function(cm){
    localStorage['currentEditorValue'] = cm.getValue();
  });

  if(typeof(widget) !== "undefined"){
    widget.notifyContentIsReady();  
  }
})