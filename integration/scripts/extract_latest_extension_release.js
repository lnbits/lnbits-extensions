var resp = JSON.parse(prev.getResponseDataAsString())
var latestRelease = resp[resp.length - 1]

var ext_id = vars.get("extension")

vars.put("ext_id", ext_id)
vars.put("archive", latestRelease.archive)
vars.put("source_repo", latestRelease.source_repo)
vars.put("version", latestRelease.version)
