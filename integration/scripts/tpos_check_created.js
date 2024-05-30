var resp = JSON.parse(prev.getResponseDataAsString())

var walletId = vars.get("walletId")

if (!resp.id) {
	AssertionResult.setFailureMessage("TPoS not created");
	AssertionResult.setFailure(true)
} else if (resp.wallet !== walletId){
	AssertionResult.setFailureMessage("TPoS description expected to be '"+walletId+"', but was: " + resp.wallet);
	AssertionResult.setFailure(true)
}