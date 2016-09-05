var util              = require('util');
var events            = require('events');
var PayPalDevice      = require('./lib/paypal-device')

function PayPalManager() {
  this.discoverState = 'stopped';  
}

util.inherits(PayPalManager, events.EventEmitter);

PayPalManager.prototype.discoverDevices = function() {
  if (this.discoverState === 'discovering') {
    return;
  }

  this.emit('deviceonline', new PayPalDevice(), this);
  this.discoverState = 'discovering';
};

PayPalManager.prototype.stopDiscoverDevices = function() {
  this.discoverState = 'stopped';
};

module.exports = PayPalManager;
