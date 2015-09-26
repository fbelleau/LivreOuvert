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
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/navigation/NavigationManager", "../../core/component/ListComponent", "./event/ProjectEvent", "./ProjectModel"], function (require, exports, AbstractController, AbstractView, MVCEvent, MouseTouchEvent, NavigationManager, ListComponent, ProjectEvent, ProjectModel) {
    var ProjectListController = (function (_super) {
        __extends(ProjectListController, _super);
        function ProjectListController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        ProjectListController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mProjectView = new AbstractView();
            this.mProjectView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mProjectView.LoadTemplate("templates/project/projectListView.html");
        };
        ProjectListController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("projectListView"));
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mProjectView.Destroy();
            this.mProjectView = null;
        };
        ProjectListController.prototype.GetRouteList = function () { return ProjectListController.mRouteList; };
        ProjectListController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mProjectView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            document.getElementById("core").innerHTML += this.mProjectView.RenderTemplate({});
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("projectList");
            this.mProjectView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mProjectView.AddClickControl(document.getElementById("addProject"));
            this.GenerateProjectList();
        };
        ProjectListController.prototype.GenerateProjectList = function () {
            var projectList = ProjectModel.GetInstance().GetProjectList();
            var projectListLength = projectList.length;
            for (var i = 0; i < projectListLength; i++) {
                var project = new AbstractView();
                project.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnProjectTemplateLoaded, this);
                this.mListComponent.AddComponent(project, "templates/project/project.html", projectList[i]);
            }
        };
        ProjectListController.prototype.OnProjectTemplateLoaded = function (aEvent) {
            var project = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mProjectView.AddClickControl(document.getElementById("edit" + project.ID));
        };
        ProjectListController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addProject") {
                this.AddProject();
            }
            else if (element.id.indexOf("edit") >= 0) {
                var projectID = element.id.split("edit")[1];
                ProjectModel.GetInstance().SelectedProject = this.mListComponent.GetDataByID(projectID);
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
            }
        };
        ProjectListController.prototype.AddProject = function () {
            this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_CREATION));
        };
        ProjectListController.mRouteList = ["project"];
        return ProjectListController;
    })(AbstractController);
    return ProjectListController;
});
