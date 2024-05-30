var resp = JSON.parse(prev.getResponseDataAsString())

var tipCounter = +vars.get("tipCounter")

if (resp.length !== tipCounter) {
	AssertionResult.setFailureMessage("Expected "+tipCounter+" tips, but got: " + resp.length);
	AssertionResult.setFailure(true)
} else {
	var tip = resp[tipCounter - 1]
	var message = "Let's go ..." + tipCounter + "!"
	if (!tip || tip.name !== "Hal" || tip.message !== message || tip.sats !== 21) {
		AssertionResult.setFailureMessage("Expected tip to '" + message + "', but was: " + JSON.stringify(resp));
		AssertionResult.setFailure(true)
	}
}