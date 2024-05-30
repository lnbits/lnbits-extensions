var resp = JSON.parse(prev.getResponseDataAsString())

var paidChargeCount = +vars.get('paidChargeCount')

var totalChargeCount = paidChargeCount + 2; // one onchain and one to expire
if (resp.length !== totalChargeCount) {
	AssertionResult.setFailureMessage("Expected charges count to be "+totalChargeCount+", got " + resp.length);
	AssertionResult.setFailure(true)
}
