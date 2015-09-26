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
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager", "./ProjectModel", "./data/Project", "./event/ProjectEvent"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager, ProjectModel, Project, ProjectEvent) {
    var ProjectCreationController = (function (_super) {
        __extends(ProjectCreationController, _super);
        function ProjectCreationController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        ProjectCreationController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mProjectCreationView = new AbstractView();
            this.mProjectCreationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mProjectCreationView.LoadTemplate("templates/project/projectCreationView.html");
        };
        ProjectCreationController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("projectCreationView"));
            this.mProjectCreationView.Destroy();
            this.mProjectCreationView = null;
        };
        ProjectCreationController.prototype.GetRouteList = function () { return ProjectCreationController.mRouteList; };
        ProjectCreationController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mProjectCreationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mProjectCreationView.RenderTemplate({});
            this.mProjectCreationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mProjectCreationView.AddClickControl(document.getElementById("create"));
            this.mProjectCreationView.AddClickControl(document.getElementById("delete"));
            document.getElementById("clientName").addEventListener("focusout", this.OnClientNameFocusOut.bind(this));
            document.getElementById("projectName").addEventListener("focusout", this.OnProjectNameFocusOut.bind(this));
        };
        ProjectCreationController.prototype.ValidateInput = function (aInput) {
            GraphicValidator.HideInputErrorMessage(aInput.id);
            if (aInput.value == "") {
                GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");
                return (false);
            }
            return (true);
        };
        ProjectCreationController.prototype.OnClientNameFocusOut = function (aEvent) {
            var input = aEvent.target;
            this.mClientNameValid = this.ValidateInput(input);
        };
        ProjectCreationController.prototype.OnProjectNameFocusOut = function (aEvent) {
            var input = aEvent.target;
            this.mProjectNameValid = this.ValidateInput(input);
        };
        ProjectCreationController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "create") {
                this.CreateProject();
            }
            else if (element.id == "delete") {
                this.DeleteProject();
            }
        };
        ProjectCreationController.prototype.CreateProject = function () {
            if (!this.mClientNameValid || !this.mProjectNameValid) {
                return;
            }
            var project = new Project();
            project.Client = document.getElementById("clientName").value;
            project.Name = document.getElementById("projectName").value;
            project.Description = document.getElementById("projectDescription").value;
            ProjectModel.GetInstance().AddProject(project);
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
        };
        ProjectCreationController.prototype.DeleteProject = function () {
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST));
        };
        ProjectCreationController.mRouteList = ["projectCreation"];
        return ProjectCreationController;
    })(AbstractController);
    return ProjectCreationController;
});
