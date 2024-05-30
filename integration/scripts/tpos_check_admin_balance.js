var resp = JSON.parse(prev.getResponseDataAsString())

var adminBalance = +vars.get("adminBalance")
var amount = +vars.get("amount")
adminBalance += amount * 1000

// millisats
if (resp.balance !== adminBalance) {
	AssertionResult.setFailureMessage("Expected balance to be "+adminBalance+", but got: "+ resp.balance);
	AssertionResult.setFailure(true)
}