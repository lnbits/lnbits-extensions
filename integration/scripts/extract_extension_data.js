var extensions = vars.get("extensions")
var adminExtensions = vars.get("adminExtensions")
var extensionIndex = vars.get("extensionIndex")
var extesion = extensions.split(",")[extensionIndex - 1]
var isAdminExtension = adminExtensions.split(",").indexOf(extesion) !== -1

vars.put("extension", extesion)
vars.put("isAdminExtension", isAdminExtension)

var responseCode = prev.getResponseCode()
vars.put("responseCode", responseCode)