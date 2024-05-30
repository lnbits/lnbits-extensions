var resp = JSON.parse(prev.getResponseDataAsString())

var walletId = vars.get("walletId")
var lnurlwCounter = +vars.get("lnurlwCounter")

if (!resp.id) {
	AssertionResult.setFailureMessage("Withdraw Link not created");
	AssertionResult.setFailure(true)
} else if (resp.wallet !== walletId) {
	AssertionResult.setFailureMessage("Withdraw Link wallet expected to be '" + walletId + "', but was: " + resp.wallet);
	AssertionResult.setFailure(true)
} else if (resp.title !== "withdraw " + lnurlwCounter) {
	AssertionResult.setFailureMessage("Withdraw Link description expected to be 'withdraw " + lnurlwCounter + "', but was: " + resp.description);
	AssertionResult.setFailure(true)
}