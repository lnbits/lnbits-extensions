var payment = JSON.parse(prev.getResponseDataAsString());
var paymentHash = vars.get("paymenHash");
var captured = props.get("lnurlWebhookRequests").remove(paymentHash);
var extra = payment.details.extra;

if (extra.wh_status !== 200 || extra.wh_response !== "") {
    AssertionResult.setFailureMessage(
        "Expected HTTP 200 delivery with a redacted webhook response",
    );
    AssertionResult.setFailure(true);
} else if (captured === null) {
    AssertionResult.setFailureMessage(
        "No webhook received for this payment hash",
    );
    AssertionResult.setFailure(true);
} else {
    var request = JSON.parse(String(captured));
    if (
        request.method !== "POST" ||
        request.body.payment_hash !== paymentHash
    ) {
        AssertionResult.setFailureMessage(
            "Incorrect webhook method or payment hash",
        );
        AssertionResult.setFailure(true);
    } else if (request.header !== "1") {
        AssertionResult.setFailureMessage("Expected webhook header h1: 1");
        AssertionResult.setFailure(true);
    } else if (!request.body.body || request.body.body.b2 !== 2) {
        AssertionResult.setFailureMessage("Expected webhook body field b2: 2");
        AssertionResult.setFailure(true);
    }
}
