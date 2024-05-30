var resp = JSON.parse(prev.getResponseDataAsString())


var count = +vars.get("defaultPaymentCount")
var paymentDelta = 20
var mobilePaymentDelta = 20

if (resp.BTC.AvailableBalance !== paymentDelta * count + mobilePaymentDelta) {
	AssertionResult.setFailureMessage("Expected balance "+paymentDelta * count+" but got: " + resp.BTC.AvailableBalance);
	AssertionResult.setFailure(true)
} 