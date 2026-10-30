var releases = JSON.parse(prev.getResponseDataAsString());

var ext_id = vars.get("extension");
var ext_version = vars.get("ext_version");

vars.put("ext_id", ext_id);
vars.remove("archive");
vars.remove("source_repo");
vars.remove("version");

for (var i = 0; i < releases.length; i++) {
    var release = releases[i];
    if (release.version === ext_version) {
        vars.put("archive", release.archive);
        vars.put("source_repo", release.source_repo);
        vars.put("version", release.version);
    }
}

if (!vars.get("version")) {
    prev.setSuccessful(false);
    prev.setResponseMessage("Release " + ext_id + " " + ext_version + " was not found in the configured manifests.");
    prev.setStopTest(true);
}
