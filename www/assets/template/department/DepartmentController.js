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
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "../../core/component/ListComponent", "./DepartmentModel", "./data/Department", "./event/DepartmentEvent", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager"], function (require, exports, AbstractController, AbstractView, ListComponent, DepartmentModel, Department, DepartmentEvent, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager) {
    var DepartmentController = (function (_super) {
        __extends(DepartmentController, _super);
        function DepartmentController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        DepartmentController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mDepartmentView = new AbstractView();
            this.mDepartmentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mDepartmentView.LoadTemplate("templates/department/departmentView.html");
        };
        DepartmentController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("departmentView"));
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mDepartmentView.Destroy();
            this.mDepartmentView = null;
        };
        DepartmentController.prototype.GetRouteList = function () { return DepartmentController.mRouteList; };
        DepartmentController.prototype.OnTemplateLoaded = function (aEvent) {
            document.getElementById("core").innerHTML += this.mDepartmentView.RenderTemplate({});
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("departmentList");
            this.mDepartmentView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            ;
            this.mDepartmentView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mDepartmentView.AddClickControl(document.getElementById("addDepartment"));
            this.mDepartmentView.AddClickControl(document.getElementById("createDepartment"));
        };
        DepartmentController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addDepartment") {
                this.AddDepartment();
            }
            else if (element.id.indexOf("delete") >= 0) {
                this.DeleteDepartment(element.id);
            }
            else if (element.id == "createDepartment") {
                this.CreateDepartmentList();
            }
        };
        DepartmentController.prototype.CreateDepartmentList = function () {
            var departmentList = this.mListComponent.GetDataList();
            var departmentListLength = departmentList.length;
            for (var i = 0; i < departmentListLength; i++) {
                var department = departmentList[i];
                if (department.Name == "") {
                    return;
                }
            }
            for (var i = 0; i < departmentListLength; i++) {
                DepartmentModel.GetInstance().AddDepartment(departmentList[i]);
            }
            this.DispatchEvent(new DepartmentEvent(DepartmentEvent.SHOW_USER));
        };
        DepartmentController.prototype.AddDepartment = function () {
            var department = new AbstractView();
            department.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
            this.mListComponent.AddComponent(department, "templates/department/department.html", new Department());
        };
        DepartmentController.prototype.DeleteDepartment = function (aElementID) {
            var departmentIndex = aElementID.split("delete")[1];
            this.mListComponent.RemoveComponent(["department" + departmentIndex], this.mListComponent.GetComponentByID(departmentIndex));
        };
        DepartmentController.prototype.OnDepartmentTemplateLoaded = function (aEvent) {
            var department = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mDepartmentView.AddClickControl(document.getElementById("delete" + department.ID));
            document.getElementById("input" + department.ID).addEventListener("focusout", this.OnDepartmentInputFocusOut.bind(this));
        };
        DepartmentController.prototype.OnDepartmentInputFocusOut = function (aEvent) {
            var input = aEvent.target;
            GraphicValidator.HideInputErrorMessage(input.id);
            var departmentID = input.id.split("input")[1];
            var department = this.mListComponent.GetDataByID(departmentID);
            if (input.value == "") {
                GraphicValidator.ShowInputErrorMessage(input.id, "input cannot be empty");
            }
            else {
                department.Name = input.value;
            }
        };
        DepartmentController.mRouteList = ["department"];
        return DepartmentController;
    })(AbstractController);
    return DepartmentController;
});
