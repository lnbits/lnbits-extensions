var resp = JSON.parse(prev.getResponseDataAsString())

vars.put("tipWalletId", resp.id || "no-tip-wallet-id");
vars.put("tipinkey", resp.inkey || 'no-tip-inkey');
vars.put("tipadminkey", resp.adminkey || 'no-tip-adminkey');
