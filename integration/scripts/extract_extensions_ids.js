var resp = JSON.parse(prev.getResponseDataAsString());
var excludedExtensions = (vars.get("excludedExtensions") || "").split(",");

var extensions = {};

for (var i = 0; i < resp.extensions.length; i++) {
  var ext = resp.extensions[i];
  if (excludedExtensions.indexOf(ext.id) === -1) {
    extensions[ext.id] = true;
  }
}



extensionList = Object.keys(extensions);
//extensionList[1] = 'nostrmarket'
//extensionList.length = 3
vars.put("extensions", extensionList);



vars.put("extensionsLength", extensionList.length);
