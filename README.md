Introduction
------------
CDIF's PayPal support

### Notes to PayPal support in CDIF
Based on official [PayPal REST SDK](https://github.com/paypal/PayPal-node-SDK.git), this module provides concept proof and basic PayPal payment and payouts API support to CDIF. For now all PayPal API calls done through CDIF framework are forced in sandbox mode so no real transactions will happen.

To use this feature, user may need to register PayPal sandbox account and use the related account or credit card information to complete a test payment.

CDIF's PayPal device model is created based on [PayPal REST API interface](https://developer.paypal.com/webapps/developer/docs/api)


Example to create and execute a PayPal payment:

To list payment resources:
```
curl -H "Content-Type: application/json" -X POST -d '{"serviceID": "urn:paypal-com:serviceID:payment","actionName":"list", "argumentList":{"config":{"mode":"sandbox","client_id":"client_id","client_secret":"client_secret"}, "listArgs":{"count":2}, "result":{}}}' http://localhost:3049/device-control/9d0b29bd-b25f-4632-9a1a-d62e85d3ad4f/invoke-action
```

To create a immediate payment with credit card:
```
curl -H "Content-Type: application/json" -X POST -d '{"serviceID": "urn:paypal-com:serviceID:payment","actionName":"createWithCard", "argumentList":{"config":{"mode":"sandbox","client_id":"client_id","client_secret":"client_secret"},"intent":"sale","payer":{"payment_method":"credit_card","funding_instruments":[{"credit_card":{"type":"visa","number":"credit card number","expire_month":"03","expire_year":"2021","cvv2":"123","first_name":"Margaret","last_name":"Eva","billing_address":{"line1":"52 N Main ST","city":"Johnstown","state":"OH","postal_code":"43210","country_code":"US"}}}]},"transactions":[{"amount":{"total":"19","currency":"USD","details":{"subtotal":"15","tax":"3","shipping":"1"}},"description":"This is the payment transaction description."}], "result":{}}}' http://localhost:3049/device-control/9d0b29bd-b25f-4632-9a1a-d62e85d3ad4f/invoke-action
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

To send a payout:
```
curl -H "Content-Type: application/json" -X POST -d '{"serviceID": "urn:paypal-com:serviceID:payouts","actionName":"create", "argumentList":{"config":{"mode":"sandbox","client_id":"client_id","client_secret":"client_secret"}, "sender_batch_header":{"sender_batch_id":"12332171","email_subject":"Youve got a payment"},"items":[{"recipient_type": "EMAIL","amount":{"value": 9.0,"currency": "USD"},"receiver":"sandbox-receiver@mail.com","note":"Thank you","sender_item_id": "item_3"}], "sync_mode":"true","result":{}}}' http://localhost:3049/device-control/9d0b29bd-b25f-4632-9a1a-d62e85d3ad4f/invoke-action
```

When received a specific event notification from CDIF or other sources, PayPal merchants may invoke these interfaces to create payment for buyers or issue payouts without need to integrate PayPal SDK in their apps.

Many of the schema files are copied and updated from [PHP PayPal Client](https://github.com/p16/paypal-rest-api-client). Thanks!

See following links for more details:

[Common device interconnect framework](https://github.com/out4b/cdif)

[PayPal Node SDK](https://github.com/paypal/PayPal-node-SDK.git)
