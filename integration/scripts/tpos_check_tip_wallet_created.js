var resp = JSON.parse(prev.getResponseDataAsString());

var walletId = vars.get("walletId");
var userId = vars.get("userId");
if (!resp.id) {
  AssertionResult.setFailureMessage("TPoS not created");
  AssertionResult.setFailure(true);
} else if (resp.user !== userId) {
  AssertionResult.setFailureMessage(
    "TPoS user id expected to be '" + userId + "', but was: " + resp.user
  );
  AssertionResult.setFailure(true);
} else if (resp.name !== "tips wallet") {
  AssertionResult.setFailureMessage(
    "TPoS name expected to be 'tips wallet', but was: " + resp.name
  );
  AssertionResult.setFailure(true);
}
