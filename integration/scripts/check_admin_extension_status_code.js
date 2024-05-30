var responseCode = +prev.getResponseCode()
var isAdminExtension = vars.get("isAdminExtension")


if (isAdminExtension === 'true') {
  if (responseCode !== 200 && responseCode !== 401) {
    AssertionResult.setFailureMessage(
      "Expected response code 200 for 401 for admin extension but got: " +
        responseCode
    );
    AssertionResult.setFailure(true);
  }
} else if (responseCode !== 200) {
  AssertionResult.setFailureMessage(
    "Expected response code 200 but got: " + responseCode
  );
  AssertionResult.setFailure(true);
}
