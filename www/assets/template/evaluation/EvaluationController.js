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
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/component/ListComponent", "../../core/mouse/event/MouseTouchEvent", "../../core/navigation/NavigationManager", "./data/Evaluation", "../project/ProjectModel", "../project/event/ProjectEvent", "./FeatureController", "./data/Feature", "../department/DepartmentModel"], function (require, exports, AbstractController, AbstractView, MVCEvent, ListComponent, MouseTouchEvent, NavigationManager, Evaluation, ProjectModel, ProjectEvent, FeatureController, Feature, DepartmentModel) {
    var EvaluationController = (function (_super) {
        __extends(EvaluationController, _super);
        function EvaluationController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        EvaluationController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mEvaluationView = new AbstractView();
            this.mEvaluationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mEvaluationView.LoadTemplate("templates/evaluation/evaluationView.html");
        };
        EvaluationController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("evaluationView"));
            this.mFeatureListComponent.Destroy();
            this.mFeatureListComponent = null;
            this.mEvaluationView.Destroy();
            this.mEvaluationView = null;
        };
        EvaluationController.prototype.GetRouteList = function () { return EvaluationController.mRouteList; };
        EvaluationController.prototype.OnTemplateLoaded = function (aEvent) {
            this.mEvaluationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mEvaluation = new Evaluation();
            var baseData = {
                Client: ProjectModel.GetInstance().SelectedProject.Client,
                Name: ProjectModel.GetInstance().SelectedProject.Name,
                Description: ProjectModel.GetInstance().SelectedProject.Description,
                DepartmentList: DepartmentModel.GetInstance().GetDepartmentList().slice(0, DepartmentModel.GetInstance().GetDepartmentList().length)
            };
            document.getElementById("core").innerHTML += this.mEvaluationView.RenderTemplate(baseData);
            this.mFeatureListComponent = new ListComponent();
            this.mFeatureListComponent.Init("featureList");
            this.mDepartmentListComponent = new ListComponent();
            this.mDepartmentListComponent.Init("departmentList");
            this.mFeatureControllerList = new Array();
            this.mEvaluationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mEvaluationView.AddClickControl(document.getElementById("addFeature"));
            this.mEvaluationView.AddClickControl(document.getElementById("addDepartment"));
            this.mEvaluationView.AddClickControl(document.getElementById("backToProject"));
        };
        EvaluationController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addFeature") {
                this.AddFeature();
            }
            else if (element.id.indexOf("deleteFeature") >= 0) {
                this.DeleteFeature(element.id);
            }
            else if (element.id == "addDepartment") {
                this.AddDepartment();
            }
            else if (element.id.indexOf("deleteDepartment") >= 0) {
                this.DeleteDepartment(element.id);
            }
            else if (element.id == "backToProject") {
                this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
            }
        };
        EvaluationController.prototype.AddDepartment = function () {
            var departmentSelect = document.getElementById("department");
            var departmentName = departmentSelect.options[departmentSelect.selectedIndex].text;
            var department = DepartmentModel.GetInstance().GetDepartmentByName(departmentName);
            var optionListLength = departmentSelect.options.length;
            for (var i = 0; i < optionListLength; i++) {
                if (departmentSelect.options[i].text == departmentName) {
                    departmentSelect.options.remove(i);
                    break;
                }
            }
            this.mEvaluation.DepartmentList.push(department);
            var departmentView = new AbstractView();
            departmentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
            this.mDepartmentListComponent.AddComponent(departmentView, "templates/evaluation/department.html", department, true);
        };
        EvaluationController.prototype.DeleteDepartment = function (aElementID) {
            var departmentIndex = aElementID.split("deleteDepartment")[1];
            var departmentComponent = this.mDepartmentListComponent.GetComponentByID(departmentIndex);
            var department = departmentComponent.Data;
            this.ReturnDepartmentOption(department);
            var departmentListIndex = this.mEvaluation.DepartmentList.indexOf(department);
            this.mEvaluation.DepartmentList.splice(departmentListIndex, 1);
            var featureControllerListLength = this.mFeatureControllerList.length;
            for (var i = 0; i < featureControllerListLength; i++) {
                this.mFeatureControllerList[i].RemoveDepartment(department);
            }
            this.mDepartmentListComponent.RemoveComponent(["department" + departmentIndex], departmentComponent);
        };
        EvaluationController.prototype.ReturnDepartmentOption = function (aDepartment) {
            var departmentSelect = document.getElementById("department");
            var departmentOption = document.createElement("option");
            departmentOption.value = aDepartment.Name;
            departmentOption.text = aDepartment.Name;
            departmentSelect.add(departmentOption, Number(aDepartment.ID) + 1);
        };
        EvaluationController.prototype.AddFeature = function () {
            var featureView = new AbstractView();
            featureView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnFeatureTemplateLoaded, this);
            var feature = new Feature();
            this.mEvaluation.FeatureList.push(feature);
            this.mFeatureListComponent.AddComponent(featureView, "templates/evaluation/feature.html", feature);
        };
        EvaluationController.prototype.DeleteFeature = function (aElementID) {
            var featureIndex = aElementID.split("deleteFeature")[1];
            var featureComponent = this.mFeatureListComponent.GetComponentByID(featureIndex);
            var featureListIndex = this.mEvaluation.FeatureList.indexOf(featureComponent.Data);
            this.mEvaluation.FeatureList.splice(featureListIndex, 1);
            this.mFeatureListComponent.RemoveComponent(["feature" + featureIndex,
                "featureTaskList" + featureIndex,
                "featureAddTask" + featureIndex], featureComponent);
        };
        EvaluationController.prototype.OnDepartmentTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
            var department = this.mDepartmentListComponent.GetDataByComponent(aEvent.target);
            var featureControllerListLength = this.mFeatureControllerList.length;
            for (var i = 0; i < featureControllerListLength; i++) {
                this.mFeatureControllerList[i].AddDepartment(department);
            }
            this.mEvaluationView.AddClickControl(document.getElementById("deleteDepartment" + department.ID));
        };
        EvaluationController.prototype.OnFeatureTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnFeatureTemplateLoaded, this);
            var feature = this.mFeatureListComponent.GetDataByComponent(aEvent.target);
            var featureController = new FeatureController();
            featureController.Init(feature, this.mEvaluationView);
            var departmentList = this.mDepartmentListComponent.GetDataList();
            var departmentListLength = departmentList.length;
            for (var i = 0; i < departmentListLength; i++) {
                featureController.AddDepartment(departmentList[i]);
            }
            this.mFeatureControllerList.push(featureController);
            this.mEvaluationView.AddClickControl(document.getElementById("deleteFeature" + feature.ID));
        };
        EvaluationController.mRouteList = ["evaluation"];
        return EvaluationController;
    })(AbstractController);
    return EvaluationController;
});
