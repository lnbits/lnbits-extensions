var resp = JSON.parse(prev.getResponseDataAsString());

var withdrawAmount = 10;
var lnurlwCount = +vars.get("lnurlwCount");
var withdrawCountPerLnurlw = +vars.get("withdrawCountPerLnurlw");

var userBalance = withdrawAmount * lnurlwCount * withdrawCountPerLnurlw;

// millisats
if (resp.balance !== userBalance * 1000) {
  AssertionResult.setFailureMessage(
    "Expected balance to be " +
      userBalance * 1000 +
      ", but got: " +
      resp.balance
  );
  AssertionResult.setFailure(true);
}