/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "./event/LoginEvent", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/navigation/NavigationManager"], function (require, exports, AbstractController, AbstractView, LoginEvent, MVCEvent, MouseTouchEvent, NavigationManager) {
    var LoginController = (function (_super) {
        __extends(LoginController, _super);
        function LoginController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        LoginController.prototype.Init = function (aAction) {
            this.mLoginView = new AbstractView();
            this.mLoginView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mLoginView.LoadTemplate("templates/login/login.html");
        };
        LoginController.prototype.Destroy = function () {
            var loginHTMLElement = document.getElementById("loginView");
            document.getElementById("core").removeChild(loginHTMLElement);
            this.mLoginView.Destroy();
            this.mLoginView = null;
        };
        LoginController.prototype.GetRouteList = function () { return LoginController.mRouteList; };
        LoginController.prototype.OnTemplateLoaded = function (aEvent) {
            document.getElementById("core").innerHTML += this.mLoginView.RenderTemplate({});
            this.mLoginView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            if (document.readyState == "complete" || document.readyState == "interactive") {
                this.OnDeviceReady();
            }
            else {
                document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
            }
        };
        LoginController.prototype.OnDeviceReady = function () {
            this.mLoginView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mLoginView.AddClickControl(document.getElementById("connect"));
            this.mLoginView.AddClickControl(document.getElementById("register"));
        };
        LoginController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "connect") {
            }
            else if (element.id == "register") {
                this.DispatchEvent(new LoginEvent(LoginEvent.SHOW_TEAM));
            }
            console.log(element.id);
        };
        LoginController.mRouteList = ["", "login"];
        return LoginController;
    })(AbstractController);
    return LoginController;
});
