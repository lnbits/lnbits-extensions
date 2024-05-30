var resp = JSON.parse(prev.getResponseDataAsString())

var tipCounter = +vars.get('tipCounter')
var userBalance = +vars.get("userBalance")

userBalance += 21 * 1000

// millisats
if (resp.balance !== userBalance) {
	AssertionResult.setFailureMessage("Expected balance to be "+userBalance+", but got: "+ resp.balance);
	AssertionResult.setFailure(true)
}

vars.put("userBalance", userBalance)