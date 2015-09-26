define(["require", "exports"], function (require, exports) {
    var Trip = (function () {
        function Trip() {
            this.mStopList = new Array();
        }
        Object.defineProperty(Trip.prototype, "ID", {
            get: function () {
                return this.mID;
            },
            set: function (aValue) {
                this.mID = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "BusID", {
            get: function () {
                return this.mBusID;
            },
            set: function (aValue) {
                this.mBusID = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "Name", {
            get: function () {
                return this.mName;
            },
            set: function (aValue) {
                this.mName = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "Direction", {
            get: function () {
                return this.mDirection;
            },
            set: function (aValue) {
                this.mDirection = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "WheelchairAccessible", {
            get: function () {
                return this.mWheelchairAccessible;
            },
            set: function (aValue) {
                this.mWheelchairAccessible = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Trip.prototype.FromJSON = function (aData) {
            this.ID = aData.service_id;
            this.BusID = aData.route_id;
            this.Name = aData.trip_headsign;
            this.Direction = aData.direction_id;
            this.WheelchairAccessible = aData.wheelchair_accessible;
        };
        return Trip;
    })();
    return Trip;
});
