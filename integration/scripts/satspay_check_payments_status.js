var resp = JSON.parse(prev.getResponseDataAsString())

var paidChargeCount = +vars.get('paidChargeCount')
// one payment is the expired one
var totalPaymentsCount = paidChargeCount + 1

if (resp.length != totalPaymentsCount) {
	AssertionResult.setFailureMessage("Expected total "+totalPaymentsCount+"  paymet, but got: "+ resp.length);
	AssertionResult.setFailure(true)
}

var pendingCount = 0

for (var i=0; i<resp.length; i++) {
  var payment = resp[i]
  if (payment.pending) pendingCount++
}

if (pendingCount !== 1) {
	AssertionResult.setFailureMessage("Expected one pending paymet, but got: "+ pendingCount);
	AssertionResult.setFailure(true)
}
