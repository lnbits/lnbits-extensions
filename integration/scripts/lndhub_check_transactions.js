var resp = JSON.parse(prev.getResponseDataAsString())


var count = +vars.get("defaultPaymentCount")

if (resp.length !== count) {
	AssertionResult.setFailureMessage("Expected "+ count+" transactions but got: " + resp.length);
	AssertionResult.setFailure(true)
} else {
	for (var i=0;i<count;i++){
		if (resp[i].value !== -1) {
			AssertionResult.setFailureMessage(i + ". Expected value -1 but got: " + resp[i].value);
			AssertionResult.setFailure(true)

			break
		}

		if (!resp[i].memo.startsWith("admin invoice ")) {
			AssertionResult.setFailureMessage(i + ". Expected memo 'admin invoice X' but got: " + resp[i].memo);
			AssertionResult.setFailure(true)

			break
		}
	}
	
}