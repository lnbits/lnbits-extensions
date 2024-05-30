var resp = JSON.parse(prev.getResponseDataAsString());

var parallelWithdrawUsers = +vars.get("parallelWithdrawUsers");
var maxWithdrawsPerLink = +vars.get("maxWithdrawsPerLink");

if (resp.length !== parallelWithdrawUsers) {
  AssertionResult.setFailureMessage(
    "Expected " +
      parallelWithdrawUsers +
      " parallel withdraw attempts, but got " +
      resp.length
  );
  AssertionResult.setFailure(true);
} else {
  var withdrawOkCount = 0;

  for (var i = 0; i < resp.length; i++) {
    if (resp[i].status === "success") {
      withdrawOkCount++;
    }
  }

  if (withdrawOkCount !== maxWithdrawsPerLink) {
    AssertionResult.setFailureMessage(
      "Expected " +
        maxWithdrawsPerLink +
        " successfull wihdraws, but got " +
        withdrawOkCount
    );
    AssertionResult.setFailure(true);
  }
}
