define(["require", "exports"], function (require, exports) {
    var UpdateManager = (function () {
        function UpdateManager() {
        }
        UpdateManager.SetFPS = function () {
            this.mDelta = 1000 / this.TARGET_FRAMERATE;
            this.mIntervalID = setInterval(this.Update.bind(this), this.mDelta);
        };
        UpdateManager.Register = function (aUpdatable) {
            if (!this.mInitialize) {
                this.SetFPS();
                this.mInitialize = true;
            }
            if (this.mUpdateList.indexOf(aUpdatable) >= 0) {
                return;
            }
            this.mUpdateList.push(aUpdatable);
            this.mUpdateCount++;
        };
        UpdateManager.Unregister = function (aUpdatable) {
            var updatableIndex = this.mUpdateList.indexOf(aUpdatable);
            if (updatableIndex <= -1) {
                return;
            }
            this.mUpdateList.splice(updatableIndex, 1);
            this.mUpdateCount--;
            if (this.mUpdateCount === 0) {
                this.mInitialize = false;
                clearInterval(this.mIntervalID);
            }
        };
        UpdateManager.Update = function () {
            for (var i = this.mUpdateCount - 1; i >= 0; i--) {
                this.mUpdateList[i].Update(this.mDelta);
            }
        };
        UpdateManager.TARGET_FRAMERATE = 60;
        UpdateManager.mUpdateCount = 0;
        UpdateManager.mDelta = 0;
        UpdateManager.mUpdateList = [];
        return UpdateManager;
    })();
    return UpdateManager;
});
