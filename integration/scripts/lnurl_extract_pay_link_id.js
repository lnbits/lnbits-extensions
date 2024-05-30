var resp = JSON.parse(prev.getResponseDataAsString())

vars.put("payLinkId", resp.id || 'no-pay-link-id');
vars.put("payLinkLnurl", resp.lnurl || 'no-pay-link-lnurl');