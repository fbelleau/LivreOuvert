define(["require", "exports"], function (require, exports) {
    var Bus = (function () {
        function Bus() {
            this.mTripList = new Array();
        }
        Object.defineProperty(Bus.prototype, "ID", {
            get: function () {
                return this.mID;
            },
            set: function (aValue) {
                this.mID = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bus.prototype, "BusNumber", {
            get: function () {
                return this.mBusNumber;
            },
            set: function (aValue) {
                this.mBusNumber = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bus.prototype, "BusColor", {
            get: function () {
                return this.mBusColor;
            },
            set: function (aValue) {
                this.mBusColor = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bus.prototype, "BusTextColor", {
            get: function () {
                return this.mBusTextColor;
            },
            set: function (aValue) {
                this.mBusTextColor = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bus.prototype, "BusDescription", {
            get: function () {
                return this.mBusDescription;
            },
            set: function (aValue) {
                this.mBusDescription = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bus.prototype, "TripList", {
            get: function () {
                return this.mTripList;
            },
            enumerable: true,
            configurable: true
        });
        Bus.prototype.FromJSON = function (aData) {
            this.ID = aData.route_id;
            this.BusNumber = aData.route_short_name;
            this.BusColor = aData.route_color;
            this.BusTextColor = aData.route_text_color;
            this.BusDescription = aData.route_desc;
            if (this.mBusDescription.indexOf("null") > -1) {
                if (this.mBusDescription.indexOf("- null") > -1) {
                    this.mBusDescription = this.mBusDescription.split(" - null")[0];
                }
                else {
                    this.mBusDescription = this.mBusDescription.split("null - ")[1];
                }
            }
        };
        return Bus;
    })();
    return Bus;
});
