var resp = JSON.parse(prev.getResponseDataAsString())
var paymenHash = vars.get("paymenHash")


var whResp = resp.details.extra.wh_response
var separatorIndex = whResp.indexOf("\r\n\r\n")
if (separatorIndex == -1) {
	AssertionResult.setFailureMessage("Webhook response has wrong format: " + whResp);
	AssertionResult.setFailure(true)
} else {
	var headers = whResp.substring(0, separatorIndex)
	var bodyStr = whResp.substring(separatorIndex)
	var body = JSON.parse(bodyStr)
	if (body.payment_hash !== paymenHash) {
		AssertionResult.setFailureMessage("Incorrect webhook payment hash: " + JSON.stringify(body));
		AssertionResult.setFailure(true)
	} else if (headers.indexOf("h1: 1") === -1) {
		AssertionResult.setFailureMessage("Expected header missing: 'h1': '1'");
		AssertionResult.setFailure(true)
	} else if (!body.body || !body.body.b2 || body.body.b2 !== 2) {
		AssertionResult.setFailureMessage("Expected body field missing: \"body\": {\"b2\": 2}, found: " + JSON.stringify(body.body));
		AssertionResult.setFailure(true)
	}
}

