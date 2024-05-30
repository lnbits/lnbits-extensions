var resp = JSON.parse(prev.getResponseDataAsString())

var tipCounter = +vars.get("tipCounter")
var name = "Hal"
var description = "Let's go ..." + tipCounter + "!"

if (resp.description !== description) {
	AssertionResult.setFailureMessage("Expected name to be  'Hal', but was: " + resp.name);
	AssertionResult.setFailure(true)
}

if (resp.description !== description) {
	AssertionResult.setFailureMessage("Expected description to be  'Let's go!', but was: " + resp.description);
	AssertionResult.setFailure(true)
}
