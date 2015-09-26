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
define(["require", "exports", "../../core/key/KeyManager", "../../core/navigation/NavigationManager", "../team/TeamController", "../team/event/TeamEvent", "../project/ProjectListController", "../project/ProjectCreationController", "../project/ProjectEditController", "../project/event/ProjectEvent", "../department/DepartmentController", "../department/event/DepartmentEvent", "../evaluation/EvaluationController", "../login/LoginController", "../login/event/LoginEvent", "../user/UserController"], function (require, exports, KeyManager, NavigationManager, TeamController, TeamEvent, ProjectListController, ProjectCreationController, ProjectEditController, ProjectEvent, DepartmentController, DepartmentEvent, EvaluationController, LoginController, LoginEvent, UserController) {
    var Main = (function () {
        function Main() {
            this.Init();
        }
        Main.prototype.Init = function () {
            this.SetupRouting();
            KeyManager.Register(this);
        };
        Main.prototype.KeyPressed = function (aKeyList) {
            if (aKeyList.indexOf(192) >= 0) {
                var outputStyle = document.getElementById("output").style;
                outputStyle.visibility = outputStyle.visibility == "hidden" ? "visible" : "hidden";
            }
            console.log(aKeyList);
        };
        Main.prototype.SetupRouting = function () {
            routie("", this.ShowLoginScreen.bind(this));
        };
        Main.prototype.ShowLoginScreen = function () {
            this.SetupNavigable("login", LoginController);
            this.mLastController.AddEventListener(LoginEvent.SHOW_TEAM, this.OnShowTeamScreen, this);
        };
        Main.prototype.OnShowTeamScreen = function (aEvent) {
            (aEvent.target).RemoveEventListener(LoginEvent.SHOW_TEAM, this.OnShowTeamScreen, this);
            this.ShowTeamScreen();
        };
        Main.prototype.ShowTeamScreen = function () {
            this.SetupNavigable("team", TeamController);
            this.mLastController.AddEventListener(TeamEvent.SHOW_DEPARTMENT, this.OnShowDepartmentScreen, this);
        };
        Main.prototype.OnShowDepartmentScreen = function (aEvent) {
            (aEvent.target).RemoveEventListener(TeamEvent.SHOW_DEPARTMENT, this.OnShowDepartmentScreen, this);
            this.ShowDepartmentScreen();
        };
        Main.prototype.ShowDepartmentScreen = function () {
            this.SetupNavigable("department", DepartmentController);
            this.mLastController.AddEventListener(DepartmentEvent.SHOW_USER, this.OnShowUserScreen, this);
        };
        Main.prototype.OnShowUserScreen = function (aEvent) {
            (aEvent.target).RemoveEventListener(DepartmentEvent.SHOW_USER, this.OnShowUserScreen, this);
            this.ShowUserScreen();
        };
        Main.prototype.ShowUserScreen = function () {
            this.SetupNavigable("user", UserController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
        };
        Main.prototype.OnShowProjectListScreen = function (aEvent) {
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.ShowProjectListScreen();
        };
        Main.prototype.ShowProjectListScreen = function () {
            this.SetupNavigable("projectList", ProjectListController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_CREATION, this.OnShowProjectCreationScreen, this);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
        };
        Main.prototype.OnShowProjectCreationScreen = function (aEvent) {
            this.SetupNavigable("projectCreation", ProjectCreationController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
        };
        Main.prototype.OnShowProjectEditScreen = function (aEvent) {
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
            this.SetupNavigable("projectEdit", ProjectEditController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_EVALUATION, this.OnShowEvaluationScreen, this);
        };
        Main.prototype.OnShowEvaluationScreen = function (aEvent) {
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
            this.mLastController.RemoveEventListener(ProjectEvent.SHOW_EVALUATION, this.OnShowEvaluationScreen, this);
            this.SetupNavigable("evaluation", EvaluationController);
            this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
        };
        Main.prototype.SetupNavigable = function (aName, aControllerClass) {
            if (NavigationManager.NavigateTo(aName) == null) {
                this.mLastController = this.LoadNavigation(aName, new aControllerClass());
            }
            else {
                this.mLastController = this.LoadNavigation(aName);
            }
        };
        Main.prototype.LoadNavigation = function (aActions, aForceController) {
            if (aForceController === void 0) { aForceController = null; }
            aActions = (aActions == null) ? "" : aActions;
            this.mLastActions = aActions;
            if (this.mLastController != null) {
                this.mLastController.Destroy();
            }
            this.mLastController = (aForceController != null) ? aForceController : NavigationManager.NavigateTo(aActions.split("/")[0]);
            this.mLastController.Init(aActions);
            return this.mLastController;
        };
        return Main;
    })();
    return Main;
});
