var payment = JSON.parse(prev.getResponseDataAsString())

if (!payment.paid || !payment.lnbitswallet || !payment.webhook){
	AssertionResult.setFailureMessage("Charge not correctly updated after paiment: "+ payment.id);
	AssertionResult.setFailure(true)
}

var extra = JSON.parse(payment.extra)
if (!extra.webhook_response) {
	AssertionResult.setFailureMessage("Webhook response missing for payment: "+ payment.id);
	AssertionResult.setFailure(true)
}

var separatorIndex = extra.webhook_response.indexOf("\r\n\r\n")
if (separatorIndex == -1) {
	AssertionResult.setFailureMessage("Webhook response has wrong format"+ extra.webhook_response);
	AssertionResult.setFailure(true)
}
var headers = extra.webhook_response.substring(0, separatorIndex)
var bodyStr = extra.webhook_response.substring(separatorIndex)

var body = JSON.parse(bodyStr)


if (vars.get("lightningChargeId") !== body.id) {
	AssertionResult.setFailureMessage("Wrong webhook charge id. Expected: "+ vars.get("lightningChargeId") + ", but got "+ body.id);
	AssertionResult.setFailure(true)
}

if (vars.get("paymentRequest") !== body.payment_request) {
	AssertionResult.setFailureMessage("Wrong webhook charge payment request. Expected: "+ vars.get("paymentRequest") + ", but got "+ body.payment_request);
	AssertionResult.setFailure(true)
}


