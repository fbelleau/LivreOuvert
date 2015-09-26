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
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager", "./ProjectModel", "./event/ProjectEvent"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager, ProjectModel, ProjectEvent) {
    var ProjectEditController = (function (_super) {
        __extends(ProjectEditController, _super);
        function ProjectEditController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        ProjectEditController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mProjectCreationView = new AbstractView();
            this.mProjectCreationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mProjectCreationView.LoadTemplate("templates/project/projectEditView.html");
        };
        ProjectEditController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("projectEditView"));
            this.mProjectCreationView.Destroy();
            this.mProjectCreationView = null;
        };
        ProjectEditController.prototype.GetRouteList = function () { return ProjectEditController.mRouteList; };
        ProjectEditController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mProjectCreationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mProjectCreationView.RenderTemplate(ProjectModel.GetInstance().SelectedProject);
            this.mProjectCreationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mProjectCreationView.AddClickControl(document.getElementById("backToProjectList"));
            this.mProjectCreationView.AddClickControl(document.getElementById("addEvaluation"));
        };
        ProjectEditController.prototype.ValidateInput = function (aInput) {
            GraphicValidator.HideInputErrorMessage(aInput.id);
            if (aInput.value == "") {
                GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");
                return (false);
            }
            return (true);
        };
        ProjectEditController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "backToProjectList") {
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST));
            }
            else if (element.id == "addEvaluation") {
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_EVALUATION));
            }
        };
        ProjectEditController.mRouteList = ["projectEdit"];
        return ProjectEditController;
    })(AbstractController);
    return ProjectEditController;
});
