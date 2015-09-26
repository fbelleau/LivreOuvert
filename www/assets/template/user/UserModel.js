var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractModel", "../department/DepartmentModel"], function (require, exports, AbstractModel, DepartmentModel) {
    var UserModel = (function (_super) {
        __extends(UserModel, _super);
        function UserModel() {
            _super.call(this);
            this.mUserList = new Array();
        }
        UserModel.prototype.AddUser = function (aUser) {
            var departmentList = DepartmentModel.GetInstance().GetDepartmentList();
            var departmentListLength = departmentList.length;
            for (var i = 0; i < departmentListLength; i++) {
                if (departmentList[i].Name == aUser.Department) {
                    departmentList[i].UserList.push(aUser);
                    break;
                }
            }
            this.mUserList.push(aUser);
        };
        UserModel.GetInstance = function () {
            if (UserModel.mInstance == null) {
                UserModel.mInstance = new UserModel();
            }
            return UserModel.mInstance;
        };
        return UserModel;
    })(AbstractModel);
    return UserModel;
});
