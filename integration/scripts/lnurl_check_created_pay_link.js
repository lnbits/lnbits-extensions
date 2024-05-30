var resp = JSON.parse(prev.getResponseDataAsString())

var walletId = vars.get("walletId")
var lnurlpCounter = +vars.get("lnurlpCounter")

if (!resp.id) {
	AssertionResult.setFailureMessage("Pay Link not created");
	AssertionResult.setFailure(true)
} else if (resp.wallet !== walletId){
	AssertionResult.setFailureMessage("Pay Link description expected to be '"+walletId+"', but was: " + resp.wallet);
	AssertionResult.setFailure(true)
} else if (resp.description !== "receive payments "+lnurlpCounter){
	AssertionResult.setFailureMessage("Pay Link description expected to be 'receive payments "+lnurlpCounter+"', but was: " + resp.description);
	AssertionResult.setFailure(true)
}