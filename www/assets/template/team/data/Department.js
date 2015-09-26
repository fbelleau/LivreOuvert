define(["require", "exports"], function (require, exports) {
    var Department = (function () {
        function Department() {
            this.mUserList = new Array();
        }
        Object.defineProperty(Department.prototype, "ID", {
            get: function () {
                return this.mID;
            },
            set: function (aValue) {
                this.mID = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Department.prototype, "Name", {
            get: function () {
                return this.mName;
            },
            set: function (aValue) {
                this.mName = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Department.prototype, "UserList", {
            get: function () {
                return this.mUserList;
            },
            enumerable: true,
            configurable: true
        });
        Department.prototype.FromJSON = function (aData) {
            this.ID = aData.route_id;
        };
        return Department;
    })();
    return Department;
});
