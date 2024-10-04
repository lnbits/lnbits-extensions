var resp = JSON.parse(prev.getResponseDataAsString())

var walletId = vars.get("walletId")
var tipWalletId = vars.get("tipWalletId")
var tipOptions = vars.get("tipOptions")

if (!resp.id) {
	AssertionResult.setFailureMessage("TPoS not updated");
	AssertionResult.setFailure(true)
} else if (resp.wallet !== walletId){
	AssertionResult.setFailureMessage("TPoS wallet expected to be '"+walletId+"', but was: " + resp.wallet);
	AssertionResult.setFailure(true)
} else if (resp.tip_wallet != tipWalletId) {
	AssertionResult.setFailureMessage("Tip wallet expected to be '"+tipWalletId+"', but was: " + resp.tip_wallet);
	AssertionResult.setFailure(true)
} else if (resp.tip_options != tipOptions) {
	AssertionResult.setFailureMessage("Tip options expected to be '"+tipOptions+"', but was: " + resp.tip_options);
	AssertionResult.setFailure(true)
}