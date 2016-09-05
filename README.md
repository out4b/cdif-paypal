Introduction
------------
CDIF's PayPal support

### Notes to PayPal support in CDIF
Based on official [PayPal REST SDK](https://github.com/paypal/PayPal-node-SDK.git), this module provides concept proof and basic PayPal payment API support to CDIF. For now all PayPal API calls done through CDIF framework are forced in sandbox mode so no real transactions will happen.

To use this feature, user may need to register PayPal sandbox account and use the related account or credit card information to complete a test payment.

CDIF's PayPal device model is created based on [PayPal REST API interface](https://developer.paypal.com/webapps/developer/docs/api)


Example to create and execute a PayPal payment:

To list payment resources:
```
curl -H "Content-Type: application/json" -X POST -d '{"serviceID": "urn:paypal-com:serviceID:payment","actionName":"list", "argumentList":{"config":{"mode":"sandbox","client_id":"client_id","client_secret":"client_secret"}, "listArgs":{"count":2}, "result":{}}}' http://localhost:3049/device-control/9d0b29bd-b25f-4632-9a1a-d62e85d3ad4f/invoke-action
```

To create a payment with paypal:
```
curl -H "Content-Type: application/json" -X POST -d '{"serviceID": "urn:paypal-com:serviceID:payment","actionName":"createWithPayPal", "argumentList":{"config":{"mode":"sandbox","client_id":"client_id","client_secret":"client_secret"},"intent":"authorize","payer":{"payment_method":"paypal"},"redirect_urls":{"return_url":"http://return.url","cancel_url":"http://cancel.url"},"transactions":[{"item_list":{"items":[{"name":"item","sku":"item","price":"19.00","currency":"USD","quantity":1}]},"amount":{"currency":"USD","total":"19.00"},"description":"This is the payment description."}], "result":{}}}' http://localhost:3049/device-control/9d0b29bd-b25f-4632-9a1a-d62e85d3ad4f/invoke-action
```

Client web app would need to provide its own return or cancel URL endpoint so after user login to PayPal authorization page and approved this payment, paymentID and payer_id will be carried back in query string parameters on the return URL

To execute the above approved payment:
```
curl -H "Content-Type: application/json" -X POST -d '{"serviceID": "urn:paypal-com:serviceID:payment","actionName":"execute", "argumentList":{"config":{"mode":"sandbox","client_id":"client_id","client_secret":"client_secret"},"paymentID":"paymentID", "executeArgs":{"payer_id":"payer_id", "transactions":[{"amount":{"currency":"USD","total":"19.00"}}]}, "result":{}}}' http://localhost:3049/device-control/9d0b29bd-b25f-4632-9a1a-d62e85d3ad4f/invoke-action
```

CDIF's client web app making above payment calls through CDIF's REST interface may acting itself as PayPal merchants.

See following links for more details:

[Common device interconnect framework](https://github.com/out4b/cdif)

[PayPal Node SDK](https://github.com/paypal/PayPal-node-SDK.git)
