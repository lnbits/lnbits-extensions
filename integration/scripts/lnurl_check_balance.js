var resp = JSON.parse(prev.getResponseDataAsString())

var lnurlpCounter = +vars.get('lnurlpCounter')


var userBalance = +vars.get("userBalance")
userBalance += 10 + lnurlpCounter

// millisats
if (resp.balance !== userBalance * 1000) {
	AssertionResult.setFailureMessage("Expected balance to be "+userBalance * 1000+", but got: "+ resp.balance);
	AssertionResult.setFailure(true)
}

vars.put("userBalance", userBalance)