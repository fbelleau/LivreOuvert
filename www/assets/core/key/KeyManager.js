define(["require", "exports"], function (require, exports) {
    var KeyManager = (function () {
        function KeyManager() {
        }
        KeyManager.Register = function (aKeyBindable) {
            if (!this.mInitialize) {
                document.addEventListener('keydown', this.OnKeyDown.bind(this));
                document.addEventListener('keyup', this.OnKeyUp.bind(this));
                this.mInitialize = true;
            }
            if (this.mKeyBindableList.indexOf(aKeyBindable) >= 0) {
                return;
            }
            this.mKeyBindableList.push(aKeyBindable);
            this.mListLength++;
        };
        KeyManager.Unregister = function (aKeyBindable) {
            var keyBindableIndex = this.mKeyBindableList.indexOf(aKeyBindable);
            if (keyBindableIndex <= -1) {
                return;
            }
            this.mKeyBindableList.splice(keyBindableIndex, 1);
            this.mListLength--;
            if (this.mListLength == 0) {
                document.removeEventListener('keydown', this.OnKeyDown.bind(this));
                document.removeEventListener('keyup', this.OnKeyUp.bind(this));
            }
        };
        KeyManager.OnKeyDown = function (aEvent) {
            var keyListIndex = this.mKeyList.indexOf(aEvent.keyCode);
            if (keyListIndex >= 0) {
                return;
            }
            this.mKeyList.push(aEvent.keyCode);
            var keyBindableListLength = this.mKeyBindableList.length;
            for (var i = 0; i < keyBindableListLength; i++) {
                this.mKeyBindableList[i].KeyPressed(this.mKeyList);
            }
        };
        KeyManager.OnKeyUp = function (aEvent) {
            var keyListIndex = this.mKeyList.indexOf(aEvent.keyCode);
            this.mKeyList.splice(keyListIndex, 1);
        };
        KeyManager.mListLength = 0;
        KeyManager.mKeyList = [];
        KeyManager.mKeyBindableList = [];
        return KeyManager;
    })();
    return KeyManager;
});
