var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractModel"], function (require, exports, AbstractModel) {
    var ProjectModel = (function (_super) {
        __extends(ProjectModel, _super);
        function ProjectModel() {
            _super.call(this);
            this.mProjectList = new Array();
        }
        ProjectModel.prototype.AddProject = function (aProject) {
            this.mSelectedProject = aProject;
            this.mProjectList.push(aProject);
        };
        ProjectModel.prototype.GetProjectList = function () {
            return this.mProjectList;
        };
        Object.defineProperty(ProjectModel.prototype, "SelectedProject", {
            get: function () { return this.mSelectedProject; },
            set: function (aValue) { this.mSelectedProject = aValue; },
            enumerable: true,
            configurable: true
        });
        ProjectModel.GetInstance = function () {
            if (ProjectModel.mInstance == null) {
                ProjectModel.mInstance = new ProjectModel();
            }
            return ProjectModel.mInstance;
        };
        return ProjectModel;
    })(AbstractModel);
    return ProjectModel;
});
