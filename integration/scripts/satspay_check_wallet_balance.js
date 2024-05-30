var resp = JSON.parse(prev.getResponseDataAsString())

var paidChargeCount = +vars.get('paidChargeCount')
var balance = 0
var startAmount = 10
for (var i=0; i< paidChargeCount; i++) {
	balance += startAmount + i
}

// millisats
if (resp.balance !== balance * 1000) {
	AssertionResult.setFailureMessage("Expected balance to be "+balance+", but got: "+ resp.balance);
	AssertionResult.setFailure(true)
}

vars.put("userBalance", resp.balance)