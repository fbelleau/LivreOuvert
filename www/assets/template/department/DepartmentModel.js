var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractModel", "./data/Department", "../team/TeamModel"], function (require, exports, AbstractModel, Department, TeamModel) {
    var DepartmentModel = (function (_super) {
        __extends(DepartmentModel, _super);
        function DepartmentModel() {
            _super.call(this);
        }
        DepartmentModel.prototype.CreateDepartment = function (aDepartmentName) {
            var department = new Department();
            department.Name = aDepartmentName;
            this.AddDepartment(department);
        };
        DepartmentModel.prototype.AddDepartment = function (aDepartment) {
            TeamModel.GetInstance().GetTeam().DepartmentList.push(aDepartment);
        };
        DepartmentModel.prototype.GetDepartmentList = function () {
            return TeamModel.GetInstance().GetTeam().DepartmentList;
        };
        DepartmentModel.prototype.GetDepartmentByName = function (aDepartmentName) {
            var departmentList = this.GetDepartmentList();
            for (var i = 0; i < departmentList.length; i++) {
                if (departmentList[i].Name == aDepartmentName) {
                    return (departmentList[i]);
                }
            }
            return (null);
        };
        DepartmentModel.GetInstance = function () {
            if (DepartmentModel.mInstance == null) {
                DepartmentModel.mInstance = new DepartmentModel();
            }
            return DepartmentModel.mInstance;
        };
        return DepartmentModel;
    })(AbstractModel);
    return DepartmentModel;
});
