var fs         = require('fs');
var CdifUtil   = require('cdif-util');
var events     = require('events');
var CdifDevice = require('cdif-device');
var paypal     = require('paypal-rest-sdk');

function PayPalDevice() {
  var spec = require('./paypal-api.json');
  CdifDevice.call(this, spec);

  this.setAction('urn:paypal-com:serviceID:payment', 'list',              this.listPayments);
  this.setAction('urn:paypal-com:serviceID:payment', 'get',               this.getPayment);
  this.setAction('urn:paypal-com:serviceID:payment', 'execute',           this.executePayment);
  this.setAction('urn:paypal-com:serviceID:payment', 'createWithCard',    this.createPaymentWithCard);
  this.setAction('urn:paypal-com:serviceID:payment', 'createWithPayPal',  this.createPaymentWithPayPal);

  this.setAction('urn:paypal-com:serviceID:payouts', 'create',        this.createPayouts);
  this.setAction('urn:paypal-com:serviceID:payouts', 'getStatus',     this.getPayoutStatus);
  this.setAction('urn:paypal-com:serviceID:payouts', 'getItemStatus', this.getPayoutItemStatus);
  this.setAction('urn:paypal-com:serviceID:payouts', 'cancelItem',    this.cancelPayoutItem);
}

CdifUtil.inherits(PayPalDevice, CdifDevice);

PayPalDevice.prototype._connect = function(user, pass, callback) {
  callback(null, null);
};

PayPalDevice.prototype._disconnect = function(callback) {
  callback(null);
};

PayPalDevice.prototype._getHWAddress = function(callback) {
  callback(null, 'paypal');
};

PayPalDevice.prototype._getDeviceRootSchema = function() {
  return JSON.parse(fs.readFileSync(__dirname + '/schema/schema.json').toString());
};

PayPalDevice.prototype.listPayments = function(args, callback) {
  //force sandbox mode!
  args.config.mode = 'sandbox';
  paypal.payment.list(args.options, args.config, function (error, payments) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payments});
  });
};

PayPalDevice.prototype.getPayment = function(args, callback) {
  //force sandbox mode!
  args.config.mode = 'sandbox';
  paypal.payment.get(args.paymentID, args.config, function(error, payment) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payment});
  });
};

PayPalDevice.prototype.executePayment = function(args, callback) {
  //force sandbox mode!
  args.config.mode = 'sandbox';
  paypal.payment.execute(args.paymentID, args.executeArgs, args.config, function(error, payment) {
    console.log(JSON.stringify(error)); console.log(payment);
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payment});
  });
};

PayPalDevice.prototype.createPaymentWithCard = function(args, callback) {
  var options = {};

  options.intent       = args.intent;
  options.payer        = args.payer;
  options.transactions = args.transactions;
  //force sandbox mode!
  args.config.mode = 'sandbox';

  paypal.payment.create(options, args.config, function(error, payment) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payment});
  });
};

PayPalDevice.prototype.createPaymentWithPayPal = function(args, callback) {
  var options = {};

  options.intent        = args.intent;
  options.payer         = args.payer;
  options.redirect_urls = args.redirect_urls;
  options.transactions  = args.transactions;
  //force sandbox mode!
  args.config.mode = 'sandbox';

  paypal.payment.create(options, args.config, function(error, payment) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payment});
  });
};

PayPalDevice.prototype.createPayouts = function(args, callback) {
  var options = {};

  options.sender_batch_header = args.sender_batch_header;
  options.items               = args.items;

  //force sandbox mode!
  args.config.mode = 'sandbox';

  paypal.payout.create(options, args.sync_mode, args.config, function(error, payout) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payout});
  });
};

PayPalDevice.prototype.getPayoutStatus = function(args, callback) {
  //force sandbox mode!
  args.config.mode = 'sandbox';

  paypal.payout.get(args.payoutID, args.config, function(error, payout) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payout});
  });
};

PayPalDevice.prototype.getPayoutItemStatus = function(args, callback) {
  //force sandbox mode!
  args.config.mode = 'sandbox';

  paypal.payoutItem.get(args.payoutItemID, args.config, function (error, payoutItem) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payoutItem});
  });
};

PayPalDevice.prototype.cancelPayoutItem = function(args, callback) {
  //force sandbox mode!
  args.config.mode = 'sandbox';

  paypal.payoutItem.cancel(args.payoutItemID, args.config, function (error, payoutItemDetails) {
    if (error && error.response) {
      return callback(new Error(error.response.message), null);
    }
    callback(error, {result: payoutItemDetails});
  });
};

module.exports = PayPalDevice;
