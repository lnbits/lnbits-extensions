var resp = JSON.parse(prev.getResponseDataAsString())

var userBalance = +vars.get("userBalance")
userBalance -= 10

// millisats
if (resp.balance !== userBalance * 1000) {
	AssertionResult.setFailureMessage("Expected balance to be "+userBalance * 1000+", but got: "+ resp.balance);
	AssertionResult.setFailure(true)
}

vars.put("userBalance", userBalance)