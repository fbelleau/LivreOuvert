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
define(["require", "exports", "../../core/mvc/AbstractView", "../../core/mvc/event/MVCEvent", "../../core/ui/DomManipulator", "../../core/event/EventDispatcher", "../../core/component/ListComponent", "../../core/mouse/event/MouseTouchEvent", "./data/Task", "./data/Hour"], function (require, exports, AbstractView, MVCEvent, DomManipulator, EventDispatcher, ListComponent, MouseTouchEvent, Task, Hour) {
    var FeatureController = (function (_super) {
        __extends(FeatureController, _super);
        function FeatureController() {
            _super.call(this);
        }
        FeatureController.prototype.Init = function (aFeature, aFeatureView) {
            this.mFeature = aFeature;
            this.mFeatureView = aFeatureView;
            this.mListComponent = new ListComponent();
            this.mListComponent.Init("taskList" + this.mFeature.ID);
            this.mFeatureView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mFeatureView.AddClickControl(document.getElementById("addTask" + this.mFeature.ID));
        };
        FeatureController.prototype.Destroy = function () {
            this.mListComponent.Destroy();
            this.mListComponent = null;
            this.mFeatureView.Destroy();
            this.mFeatureView = null;
            this.mFeature = null;
        };
        FeatureController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "addTask" + this.mFeature.ID) {
                this.AddTask();
            }
            else if (element.id.indexOf("deleteTask" + this.mFeature.ID) >= 0) {
                this.DeleteTask(element.id);
            }
        };
        FeatureController.prototype.AddDepartment = function (aDepartment) {
            this.mFeature.HourList.push(new Hour(aDepartment.ID, 0));
            var featureDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID);
            featureDepartmentListDiv.appendChild(this.CreateHourElement("departmentHour" + this.mFeature.ID + "_" + aDepartment.ID));
            var taskListLength = this.mFeature.TaskList.length;
            for (var i = 0; i < taskListLength; ++i) {
                var task = this.mFeature.TaskList[i];
                task.HourList.push(new Hour(aDepartment.ID, 0));
                var taskDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID + "_" + task.ID);
                taskDepartmentListDiv.appendChild(this.CreateHourElement("departmentHour" + this.mFeature.ID + "_" + task.ID + "_" + aDepartment.ID));
            }
        };
        FeatureController.prototype.RemoveDepartment = function (aDepartment) {
            var featureHourListLength = this.mFeature.HourList.length;
            for (var j = 0; j < featureHourListLength; ++j) {
                if (this.mFeature.HourList[j].DepartmentID == aDepartment.ID) {
                    this.mFeature.HourList.splice(j, 1);
                    break;
                }
            }
            var featureDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID);
            var featureDepartmentHourDiv = document.getElementById("departmentHourContainer" + this.mFeature.ID + "_" + aDepartment.ID);
            featureDepartmentListDiv.removeChild(featureDepartmentHourDiv);
            var taskListLength = this.mFeature.TaskList.length;
            for (var i = 0; i < taskListLength; i++) {
                var task = this.mFeature.TaskList[i];
                task.HourList.splice(j, 1);
                var taskDepartmentListDiv = document.getElementById("departmentList" + this.mFeature.ID + "_" + task.ID);
                var taskDepartmentHourDiv = document.getElementById("departmentHourContainer" + this.mFeature.ID + "_" + task.ID + "_" + aDepartment.ID);
                taskDepartmentListDiv.removeChild(taskDepartmentHourDiv);
                document.getElementById("departmentHour" + task.FeatureID + "_" + task.ID + "_" + aDepartment.ID).removeEventListener("focusout", this.OnTaskFocusOut.bind(this));
            }
        };
        FeatureController.prototype.CreateHourElement = function (aElementID) {
            var tdElement = document.createElement("td");
            var inputElement = DomManipulator.CreateElement("input", "0");
            inputElement.type = "text";
            inputElement.id = aElementID;
            inputElement.style.width = "100%";
            inputElement.value = "0";
            inputElement.addEventListener("focusout", this.OnTaskFocusOut.bind(this));
            tdElement.appendChild(inputElement);
            return (tdElement);
        };
        FeatureController.prototype.AddTask = function () {
            var taskView = new AbstractView();
            taskView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTaskTemplateLoaded, this);
            var task = new Task();
            task.FeatureID = this.mFeature.ID;
            for (var i = 0; i < this.mFeature.HourList.length; ++i) {
                task.HourList.push(new Hour(this.mFeature.HourList[i].DepartmentID, 0));
            }
            this.mFeature.TaskList.push(task);
            this.mListComponent.AddComponent(taskView, "templates/evaluation/task.html", task);
        };
        FeatureController.prototype.DeleteTask = function (aElementID) {
            var taskIndex = aElementID.split("deleteTask" + this.mFeature.ID + "_")[1];
            var taskComponent = this.mListComponent.GetComponentByID(taskIndex);
            var task = this.mListComponent.GetDataByComponent(taskComponent);
            this.mFeature.TaskList.splice(this.mFeature.TaskList.indexOf(task));
            this.mListComponent.RemoveComponent(["task" + this.mFeature.ID + "_" + taskIndex], this.mListComponent.GetComponentByID(taskIndex));
        };
        FeatureController.prototype.OnTaskTemplateLoaded = function (aEvent) {
            aEvent.target.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTaskTemplateLoaded, this);
            var task = this.mListComponent.GetDataByComponent(aEvent.target);
            this.mFeatureView.AddClickControl(document.getElementById("deleteTask" + this.mFeature.ID + "_" + task.ID));
            for (var i = 0; i < task.HourList.length; ++i) {
                document.getElementById("departmentHour" + task.FeatureID + "_" + task.ID + "_" + task.HourList[i].DepartmentID).addEventListener("focusout", this.OnTaskFocusOut.bind(this));
            }
        };
        FeatureController.prototype.OnTaskFocusOut = function (aEvent) {
            var input = aEvent.target;
            var inputIDSplitted = input.id.split("_");
            var departmentID = inputIDSplitted[2];
            var task = this.mListComponent.GetDataByID(inputIDSplitted[1]);
            for (var j = 0; j < task.HourList.length; ++j) {
                if (task.HourList[j].DepartmentID == departmentID) {
                    task.HourList[j].ExecutionTime = input.value == "" ? 0 : Number(input.value);
                    break;
                }
            }
            var calculatedExecutionTime = 0;
            var taskList = this.mFeature.TaskList;
            var taskListLength = taskList.length;
            for (var i = 0; i < taskListLength; ++i) {
                calculatedExecutionTime += taskList[i].HourList[j].ExecutionTime;
            }
            this.mFeature.HourList[j].ExecutionTime = calculatedExecutionTime;
            document.getElementById("departmentHour" + task.FeatureID + "_" + departmentID).value = String(calculatedExecutionTime);
        };
        return FeatureController;
    })(EventDispatcher);
    return FeatureController;
});
