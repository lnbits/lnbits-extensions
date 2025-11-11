var resp = JSON.parse(prev.getResponseDataAsString())
var sortFn = function(a, b) {
    return a.version.localeCompare(b.version, undefined, {numeric: true, sensitivity: 'base'})
}
var latestRelease = resp.sort(sortFn)[resp.length - 1]

var ext_id = vars.get("extension")

vars.put("ext_id", ext_id)
vars.put("archive", latestRelease.archive)
vars.put("source_repo", latestRelease.source_repo)
vars.put("version", latestRelease.version)
