var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractView"], function (require, exports, AbstractView) {
    var TeamView = (function (_super) {
        __extends(TeamView, _super);
        function TeamView() {
            _super.call(this);
        }
        TeamView.prototype.RenderTemplate = function (aAttributes) {
            if (aAttributes === void 0) { aAttributes = {}; }
            _super.prototype.RenderTemplate.call(this, aAttributes);
            return (this.TemplateDiv);
        };
        return TeamView;
    })(AbstractView);
    return TeamView;
});
