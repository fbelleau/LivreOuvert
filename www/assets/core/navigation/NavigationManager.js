define(["require", "exports"], function (require, exports) {
    var NavigationManager = (function () {
        function NavigationManager() {
        }
        NavigationManager.Register = function (aNavigable) {
            if (!this.mInitialize) {
                this.mInitialize = true;
            }
            if (this.mNavigableList.indexOf(aNavigable) >= 0) {
                return;
            }
            this.mNavigableList.push(aNavigable);
            this.mListLength++;
        };
        NavigationManager.Unregister = function (aNavigable) {
            var keyBindableIndex = this.mNavigableList.indexOf(aNavigable);
            if (keyBindableIndex <= -1) {
                return;
            }
            this.mNavigableList.splice(keyBindableIndex, 1);
            this.mListLength--;
            if (this.mListLength == 0) {
            }
        };
        NavigationManager.NavigateTo = function (aPath) {
            for (var i = 0; i < this.mListLength; i++) {
                var routeList = this.mNavigableList[i].GetRouteList();
                for (var j = 0; j < routeList.length; j++) {
                    if (routeList[j] == aPath) {
                        return (this.mNavigableList[i]);
                    }
                }
            }
            return (null);
        };
        NavigationManager.mListLength = 0;
        NavigationManager.mNavigableList = [];
        return NavigationManager;
    })();
    return NavigationManager;
});
