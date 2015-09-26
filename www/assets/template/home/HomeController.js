var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "./HomeModel", "./BusView", "../../core/mvc/event/MVCEvent", "../../core/ui/UpdateManager", "./event/HomeEvent", "../../core/ui/DomManipulator", "../../core/debug/Logger"], function (require, exports, AbstractController, AbstractView, HomeModel, BusView, MVCEvent, UpdateManager, HomeEvent, DomManipulator, Logger) {
    var HomeController = (function (_super) {
        __extends(HomeController, _super);
        function HomeController() {
            _super.call(this);
            this.mPathIndex = 0;
            this.mElapsedTime = 0;
            this.mHomeModel = new HomeModel();
            this.mHomeView = new AbstractView();
            this.mHomeView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mHomeView.LoadTemplate("templates/home/home.html");
        }
        HomeController.prototype.OnTemplateLoaded = function (aEvent) {
            Logger.Log("TEMPLATE IS READY!");
            this.mHomeView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").appendChild(this.mHomeView.RenderTemplate({}));
            if (document.readyState == "complete" || document.readyState == "interactive") {
                this.OnDeviceReady();
            }
            else {
                document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
            }
        };
        HomeController.prototype.OnDeviceReady = function () {
            Logger.Log("DEVICE IS READY!");
            navigator.geolocation.getCurrentPosition(this.OnPositionFound.bind(this), this.OnPositionNotFound.bind(this), { enableHighAccuracy: true, timeout: 2000 });
        };
        HomeController.prototype.OnPositionNotFound = function (aLocation) {
            Logger.Log("LOCATION IS NOT FOUND! : BOUUH!");
            this.mLocation = {};
            this.mLocation.coords = {};
            this.mLocation.coords.latitude = 46.814222699999995;
            this.mLocation.coords.longitude = -71.22336020000002;
            this.LoadGoogleMap();
        };
        HomeController.prototype.OnPositionFound = function (aLocation) {
            this.mLocation = aLocation;
            var msg = [
                "latitude:" + aLocation.coords.latitude,
                "longitude:" + aLocation.coords.longitude
            ].join("\n");
            Logger.Log("LOCATION IS FOUND! : \n " + msg);
            this.LoadGoogleMap();
        };
        HomeController.prototype.LoadGoogleMap = function () {
            window["OnGoogleMapsAPILoaded"] = this.OnGoogleMapsAPILoaded.bind(this);
            $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDHFP1TnhbODPrbWLjdMruGX5hOJqdWltI&sensor=true&libraries=geometry&callback=OnGoogleMapsAPILoaded');
        };
        HomeController.prototype.OnGoogleMapsAPILoaded = function () {
            Logger.Log("GOOGLE MAPS IS READY! ");
            this.SetupGoogleMap();
            this.FetchBusList();
        };
        HomeController.prototype.FetchBusList = function () {
            this.mHomeModel.AddEventListener(HomeEvent.ROUTES_LOADED, this.OnRoutesLoaded, this);
            this.mHomeModel.FetchRoutes();
        };
        HomeController.prototype.OnRoutesLoaded = function (aEvent) {
            this.mHomeModel.RemoveEventListener(HomeEvent.ROUTES_LOADED, this.OnRoutesLoaded, this);
            this.FetchTripList();
        };
        HomeController.prototype.FetchTripList = function () {
            this.mHomeModel.AddEventListener(HomeEvent.TRIPS_LOADED, this.OnTripsLoaded, this);
            this.mHomeModel.FetchTrips();
        };
        HomeController.prototype.OnTripsLoaded = function (aEvent) {
            this.mHomeModel.RemoveEventListener(HomeEvent.TRIPS_LOADED, this.OnTripsLoaded, this);
            var busDataList = this.mHomeModel.GetBusData();
            this.mBusNeedingLoading = 25;
            this.mBusList = new Array();
            var maxBus = 0;
            for (var data in busDataList) {
                var busComponent = new BusView();
                busComponent.SetData(busDataList[Math.floor(Math.random() * busDataList.length)]);
                busComponent.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBusTemplateLoaded, this);
                busComponent.LoadTemplate("templates/home/bus.html");
                this.mBusList.push(busComponent);
                if (maxBus++ >= 25) {
                    break;
                }
            }
            this.mBusMarker = new google.maps.Marker({
                position: new google.maps.LatLng(this.mLocation.coords.latitude, this.mLocation.coords.longitude),
                map: this.mGoogleMap,
                title: '800',
                icon: "img/bus.png"
            });
            UpdateManager.Register(this);
        };
        HomeController.prototype.CreateTripPath = function (aPositionA, aPositionB) {
            this.mDirectionsService.route({
                origin: aPositionA,
                destination: aPositionB,
                travelMode: google.maps.TravelMode.TRANSIT
            }, this.OnDirectionCalculated.bind(this));
        };
        HomeController.prototype.OnDirectionCalculated = function (aResult, aStatus) {
            if (aStatus == google.maps.DirectionsStatus.OK) {
                this.mPathToFollow = aResult.routes[0].overview_path;
                this.mDirectionsDisplay.setDirections(aResult);
                this.mDirectionsDisplay.setMap(this.mGoogleMap);
                UpdateManager.Register(this);
            }
            else {
                alert("Directions Request failed:" + status);
            }
        };
        HomeController.prototype.OnBusTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBusTemplateLoaded, this);
            if (--this.mBusNeedingLoading === 0) {
                this.RenderBusList();
            }
        };
        HomeController.prototype.RenderBusList = function () {
            var busListDiv = document.getElementById("bus_list");
            for (var i = 0; i < this.mBusList.length; i++) {
                var busComponent = this.mBusList[i];
                var busDiv = busComponent.RenderTemplate(busComponent.GetData());
                busComponent.AddClickControl([busComponent.TemplateDiv]);
                busComponent.AddEventListener(MVCEvent.TEMPLATE_CLICKED, this.OnBusTemplateClicked, this);
                busComponent.AddEventListener(HomeEvent.TRANSITION_ENDED, this.OnBusTransitionEnded, this);
                this.CreateBusTripList(busComponent.GetData(), busDiv);
                busListDiv.appendChild(busDiv);
            }
        };
        HomeController.prototype.CreateBusTripList = function (aBusData, aBusDiv) {
            var tripListDiv = aBusDiv.getElementsByClassName("tripList").item(0);
            var maxTrip = 0;
            for (var index in aBusData.TripList) {
                var trip = aBusData.TripList[index];
                var tripDiv = DomManipulator.CreateElement("div", trip.Name);
                tripDiv.style.width = "100%";
                tripDiv.style.height = "60px";
                tripListDiv.appendChild(tripDiv);
                if (maxTrip++ >= 8) {
                    break;
                }
            }
        };
        HomeController.prototype.OnBusTransitionEnded = function (aEvent) {
        };
        HomeController.prototype.OnBusTemplateClicked = function (aEvent) {
            var busComponent = aEvent.target;
            var baseIndex = this.mBusList.indexOf(busComponent) + 1;
            var translation = "";
            if (busComponent.IsDrawerOpened) {
                busComponent.CloseBusDrawer();
                if (baseIndex == this.mBusList.length)
                    baseIndex = 0;
                translation = "0px";
            }
            else {
                busComponent.OpenBusDrawer();
                translation = "500px";
                if (baseIndex === this.mBusList.length) {
                    translation = "-500px";
                    baseIndex = 0;
                }
            }
            var busListLength = this.mBusList.length;
            for (var i = baseIndex; i < busListLength; i++) {
                var busDiv = this.mBusList[i].TemplateDiv;
                busDiv.style.transform = "translate3d(0, " + translation + ", 0)";
            }
        };
        HomeController.prototype.SetupGoogleMap = function () {
            var mapDiv = document.getElementById("map_canvas");
            var mapOptions = {};
            mapOptions.backgroundColor = "white";
            mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
            mapOptions.zoom = 17;
            mapOptions.maxZoom = 18;
            mapOptions.minZoom = 15;
            mapOptions.streetViewControl = false;
            mapOptions.navigationControl = false;
            mapOptions.overviewMapControl = false;
            mapOptions.zoomControl = false;
            mapOptions.mapTypeControl = false;
            mapOptions.center = new google.maps.LatLng(this.mLocation.coords.latitude, this.mLocation.coords.longitude);
            this.mGoogleMap = new google.maps.Map(mapDiv, mapOptions);
            var centerControl = this.CreateCenterControl(this.mGoogleMap);
            this.mGoogleMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControl);
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                map: this.mGoogleMap,
                title: 'Your position'
            });
            this.mDirectionsDisplay = new google.maps.DirectionsRenderer();
            this.mDirectionsService = new google.maps.DirectionsService();
            var busStartPoint = new google.maps.LatLng(46.8614789, -71.3152027);
            this.CreateTripPath(mapOptions.center, busStartPoint);
        };
        HomeController.prototype.CreateCenterControl = function (aMap) {
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '10px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.style.marginRight = "20px";
            controlUI.title = 'Click to recenter the map';
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '20px';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = '+';
            controlUI.appendChild(controlText);
            google.maps.event.addDomListener(controlUI, 'click', function () {
                aMap.setCenter(new google.maps.LatLng(this.mLocation.coords.latitude, this.mLocation.coords.longitude));
                aMap.setZoom(17);
            }.bind(this));
            return controlUI;
        };
        HomeController.prototype.Update = function (aDelta) {
            this.mElapsedTime += aDelta;
            if (this.mElapsedTime > 1000) {
                this.mElapsedTime = 0;
                this.mPathIndex++;
            }
            if (this.mPathIndex === 0 || this.mBusMarker == null) {
                return;
            }
            var interpolatedPosition = google.maps.geometry.spherical.interpolate(this.mPathToFollow[this.mPathIndex - 1], this.mPathToFollow[this.mPathIndex], this.mElapsedTime / 1000);
            this.mBusMarker.setPosition(interpolatedPosition);
        };
        return HomeController;
    })(AbstractController);
    return HomeController;
});
