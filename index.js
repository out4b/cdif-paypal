var util              = require('util');
var events            = require('events');
var CdifDevice        = require('cdif-device');

function PayPalDevice() {
  var spec = {};
  CdifDevice.call(this, spec);

  this.discoverState = 'stopped';
}

util.inherits(PayPalDevice, CdifDevice);

PayPalDevice.prototype._connect = function(callback) {
  callback(null, null);
};

PayPalDevice.prototype._disconnect = function(callback) {
  callback(null);
};

PayPalDevice.prototype._getHWAddress = function(callback) {
  callback(null, 'paypal');
};

PayPalDevice.prototype.discoverDevices = function() {
  if (this.discoverState === 'discovering') {
    return;
  }

  this.emit('deviceonline', this, this);
  this.discoverState = 'discovering';
};

PayPalDevice.prototype.stopDiscoverDevices = function() {
  this.discoverState = 'stopped';
};


module.exports = PayPalDevice;
