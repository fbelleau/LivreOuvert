var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractModel", "../../core/mvc/event/MVCEvent", "./event/HomeEvent", "./data/Bus", "./data/Trip"], function (require, exports, AbstractModel, MVCEvent, HomeEvent, Bus, Trip) {
    var HomeModel = (function (_super) {
        __extends(HomeModel, _super);
        function HomeModel() {
            _super.call(this);
            this.mRouteURL = "json/rtc/routes.json";
            this.mTripURL = "json/rtc/trips.json";
            this.mStopURL = "json/rtc/stops.json";
        }
        HomeModel.prototype.FetchRoutes = function () {
            this.AddEventListener(MVCEvent.JSON_LOADED, this.OnRoutesLoaded, this);
            this.Fetch(this.mRouteURL);
        };
        HomeModel.prototype.OnRoutesLoaded = function (aEvent) {
            this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnRoutesLoaded, this);
            this.mBusList = new Array();
            var rawData = this.mDataCache[this.mRouteURL];
            for (var index in rawData) {
                var data = rawData[index];
                var bus = new Bus();
                bus.FromJSON(data);
                this.mBusList.push(bus);
            }
            this.DispatchEvent(new HomeEvent(HomeEvent.ROUTES_LOADED));
        };
        HomeModel.prototype.GetBusData = function () {
            return this.mBusList;
        };
        HomeModel.prototype.FetchTrips = function () {
            this.AddEventListener(MVCEvent.JSON_LOADED, this.OnTripsLoaded, this);
            this.Fetch(this.mTripURL);
        };
        HomeModel.prototype.OnTripsLoaded = function (aEvent) {
            this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnTripsLoaded, this);
            var rawData = this.mDataCache[this.mTripURL];
            for (var index in rawData) {
                var data = rawData[index];
                var trip = new Trip();
                trip.FromJSON(data);
                for (var busIndex in this.mBusList) {
                    if (this.mBusList[busIndex].ID === trip.BusID) {
                        this.mBusList[busIndex].TripList.push(trip);
                        break;
                    }
                }
            }
            this.DispatchEvent(new HomeEvent(HomeEvent.TRIPS_LOADED));
        };
        HomeModel.prototype.FetchStops = function () {
            this.AddEventListener(MVCEvent.JSON_LOADED, this.OnStopsLoaded, this);
            this.Fetch(this.mStopURL);
        };
        HomeModel.prototype.OnStopsLoaded = function (aEvent) {
            this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnStopsLoaded, this);
            var rawData = this.mDataCache[this.mStopURL];
            this.DispatchEvent(new HomeEvent(HomeEvent.STOP_LOADED));
        };
        return HomeModel;
    })(AbstractModel);
    return HomeModel;
});
