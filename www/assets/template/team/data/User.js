define(["require", "exports"], function (require, exports) {
    var User = (function () {
        function User() {
            this.mUserList = new Array();
        }
        Object.defineProperty(User.prototype, "ID", {
            get: function () {
                return this.mID;
            },
            set: function (aValue) {
                this.mID = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Name", {
            get: function () {
                return this.mName;
            },
            set: function (aValue) {
                this.mName = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Email", {
            get: function () {
                return this.mEmail;
            },
            set: function (aValue) {
                this.mEmail = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "UserList", {
            get: function () {
                return this.mUserList;
            },
            enumerable: true,
            configurable: true
        });
        User.prototype.FromJSON = function (aData) {
            this.ID = aData.route_id;
        };
        return User;
    })();
    return User;
});
