define(["require", "exports", "../team/TeamController", "../register/RegisterController"], function (require, exports, TeamController, RegisterController) {
    var EController = (function () {
        function EController(aPathBinding, aController) {
            this.mPathBinding = aPathBinding;
            this.mController = aController;
            EController.mControllerList.push(this);
        }
        Object.defineProperty(EController.prototype, "PathBinding", {
            get: function () {
                return (this.mPathBinding);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EController.prototype, "Controller", {
            get: function () {
                return (this.mController);
            },
            enumerable: true,
            configurable: true
        });
        EController.GetControllerByPathing = function (aPathBinding) {
            var controller = null;
            var controllerListLength = EController.mControllerList.length;
            for (var i = 0; i < controllerListLength; i++) {
                var pathBindingList = EController.mControllerList[i].PathBinding;
                var pathBindingListLength = pathBindingList.length;
                for (var j = 0; j < pathBindingListLength; j++) {
                    if (pathBindingList[j] === aPathBinding) {
                        controller = EController.mControllerList[i];
                        return (controller);
                    }
                }
            }
            return (null);
        };
        EController.mControllerList = new Array();
        EController.TEAM_CONTROLLER = new EController(["", "team"], new TeamController());
        EController.REGISTER_CONTROLLER = new EController(["register"], new RegisterController());
        return EController;
    })();
    return EController;
});
