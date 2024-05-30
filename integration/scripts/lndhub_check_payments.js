var resp = JSON.parse(prev.getResponseDataAsString())


var count = +vars.get("defaultPaymentCount")

if (resp.length !== count) {
	AssertionResult.setFailureMessage("Expected "+ count+" transactions but got: " + resp.length);
	AssertionResult.setFailure(true)
} else {
	for (var i=0;i<count;i++){
		if (resp[i].amt !== 21) {
			AssertionResult.setFailureMessage(i + ". Expected value 21 but got: " + resp[i].amt);
			AssertionResult.setFailure(true)

			break
		}
		var description = "user invoice "
		if (!resp[i].description.startsWith(description)) {
			AssertionResult.setFailureMessage(i + ". Expected memo '"+description+"' but got: " + resp[i].description);
			AssertionResult.setFailure(true)

			break
		}
	}
	
}