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
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager", "./UserModel", "./data/User", "../project/event/ProjectEvent", "../../core/component/ListComponent", "../../core/component/data/ComponentData", "../department/DepartmentModel"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager, UserModel, User, ProjectEvent, ListComponent, ComponentData, DepartmentModel) {
    var UserController = (function (_super) {
        __extends(UserController, _super);
        function UserController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        UserController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mUserView = new AbstractView();
            this.mUserView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mUserView.LoadTemplate("templates/user/userView.html");
        };
        UserController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("userView"));
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mUserView.Destroy();
            this.mUserView = null;
        };
        UserController.prototype.GetRouteList = function () { return UserController.mRouteList; };
        UserController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mUserView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mUserView.RenderTemplate({});
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("userList");
            this.mUserView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mUserView.AddClickControl(document.getElementById("addUser"));
            this.mUserView.AddClickControl(document.getElementById("createUsers"));
        };
        UserController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addUser") {
                this.AddUser();
            }
            else if (element.id.indexOf("delete") >= 0) {
                this.DeleteUser(element.id);
            }
            else if (element.id == "createUsers") {
                this.CreateUserList();
            }
        };
        UserController.prototype.CreateUserList = function () {
            var userList = this.mListComponent.GetDataList();
            var userListListLength = userList.length;
            var i;
            var user;
            for (i = 0; i < userListListLength; i++) {
                user = userList[i]["user"];
                if (user.Name == "" || user.Email == "") {
                    return;
                }
            }
            for (i = 0; i < userListListLength; i++) {
                user = userList[i]["user"];
                UserModel.GetInstance().AddUser(user);
            }
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST));
        };
        UserController.prototype.AddUser = function () {
            var user = new AbstractView();
            user.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnUserTemplateLoaded, this);
            var data = new ComponentData();
            data["user"] = new User();
            data["departments"] = DepartmentModel.GetInstance().GetDepartmentList();
            this.mListComponent.AddComponent(user, "templates/user/user.html", data);
        };
        UserController.prototype.OnUserTemplateLoaded = function (aEvent) {
            var user = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mUserView.AddClickControl(document.getElementById("delete" + user.ID));
            document.getElementById("name" + user.ID).addEventListener("focusout", this.OnUserNameInputFocusOut.bind(this));
            document.getElementById("email" + user.ID).addEventListener("focusout", this.OnUserEmailInputFocusOut.bind(this));
        };
        UserController.prototype.DeleteUser = function (aElementID) {
            var userIndex = aElementID.split("delete")[1];
            this.mListComponent.RemoveComponent(["user" + userIndex], this.mListComponent.GetComponentByID(userIndex));
        };
        UserController.prototype.ValidateInput = function (aInput) {
            GraphicValidator.HideInputErrorMessage(aInput.id);
            if (aInput.value == "") {
                GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");
                return (false);
            }
            return (true);
        };
        UserController.prototype.OnUserNameInputFocusOut = function (aEvent) {
            var input = aEvent.target;
            if (this.ValidateInput(input)) {
                var userID = input.id.split("name")[1];
                var user = this.mListComponent.GetDataByID(userID);
                user.Name = input.value;
            }
        };
        UserController.prototype.OnUserEmailInputFocusOut = function (aEvent) {
            var input = aEvent.target;
            if (this.ValidateInput(input)) {
                var userID = input.id.split("email")[1];
                var user = this.mListComponent.GetDataByID(userID);
                user.Email = input.value;
            }
        };
        UserController.mRouteList = ["user"];
        return UserController;
    })(AbstractController);
    return UserController;
});
