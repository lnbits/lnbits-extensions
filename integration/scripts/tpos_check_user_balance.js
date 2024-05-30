var resp = JSON.parse(prev.getResponseDataAsString())

var userBalance = +vars.get("userBalance")
var amount = +vars.get("amount")
userBalance -= amount * 1000

// millisats
if (resp.balance !== userBalance) {
	AssertionResult.setFailureMessage("Expected balance to be "+userBalance+", but got: "+ resp.balance);
	AssertionResult.setFailure(true)
}