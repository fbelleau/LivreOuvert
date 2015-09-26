var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var HomeEvent = (function (_super) {
        __extends(HomeEvent, _super);
        function HomeEvent(aEventName) {
            _super.call(this, aEventName);
        }
        HomeEvent.ROUTES_LOADED = "com.cortex.template.home.event.HomeEvent::ROUTES_LOADED";
        HomeEvent.TRIPS_LOADED = "com.cortex.template.home.event.HomeEvent::TRIPS_LOADED";
        HomeEvent.STOP_LOADED = "com.cortex.template.home.event.HomeEvent::STOP_LOADED";
        HomeEvent.TRANSITION_ENDED = "com.cortex.template.home.event.HomeEvent::TRANSITION_ENDED";
        return HomeEvent;
    })(Event);
    return HomeEvent;
});
