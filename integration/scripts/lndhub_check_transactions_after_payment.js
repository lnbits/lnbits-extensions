var resp = JSON.parse(prev.getResponseDataAsString())


var mobilePaymentCount = 1
var count = +vars.get("defaultPaymentCount") + mobilePaymentCount


if (resp.length !== count) {
	AssertionResult.setFailureMessage("Expected "+ count + " transactions but got: " + resp.length);
	AssertionResult.setFailure(true)
}