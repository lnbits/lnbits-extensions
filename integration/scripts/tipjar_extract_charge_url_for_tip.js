var resp = JSON.parse(prev.getResponseDataAsString())

vars.put("tipChargeUrl", resp.redirect_url || 'no-tip-charge-url');

if (resp.redirect_url) {
	var tipChargeId = resp.redirect_url.split("/")[2]
	vars.put("tipChargeId", tipChargeId || 'no-tip-charge-id');
}