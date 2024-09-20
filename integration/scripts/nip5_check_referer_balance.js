var identifierThreeFullPrice = +vars.get("identifierThreeFullPrice");
var balanceAlan = Math.floor(+vars.get("balanceAlan") / 1000);

var refererBonus = Math.floor(identifierThreeFullPrice / 5);

if (Math.abs(balanceAlan - refererBonus) > 100) {
  var message =
    "Referer balance and referer bonus exceeds tolerated coversion error.";
  message += " Balance: " + balanceAlan + " bonus: " + refererBonus;
  AssertionResult.setFailureMessage(message);

  AssertionResult.setFailure(true);
}
