var resp = JSON.parse(prev.getResponseDataAsString())

vars.put("payLinkId", resp.id || 'no-pay-link-id');
