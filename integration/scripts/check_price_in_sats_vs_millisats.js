var priceInSats = +vars.get("priceInSats");
var priceInMillisats = +vars.get("priceInMillisats");

if (priceInSats * 1000 !== priceInMillisats) {
    var message =
        "Expected price: " + priceInSats + ", but got: " + priceInMillisats;
    AssertionResult.setFailureMessage(message);
    AssertionResult.setFailure(true);
}
