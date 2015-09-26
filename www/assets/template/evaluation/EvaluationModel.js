var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractModel"], function (require, exports, AbstractModel) {
    var EvaluationModel = (function (_super) {
        __extends(EvaluationModel, _super);
        function EvaluationModel() {
            _super.call(this);
            this.mEvaluationList = new Array();
        }
        EvaluationModel.prototype.AddEvaluation = function (aEvaluation) {
            this.mEvaluationList.push(aEvaluation);
        };
        EvaluationModel.prototype.GetEvaluationList = function () {
            return this.mEvaluationList;
        };
        EvaluationModel.GetInstance = function () {
            if (EvaluationModel.mInstance == null) {
                EvaluationModel.mInstance = new EvaluationModel();
            }
            return EvaluationModel.mInstance;
        };
        return EvaluationModel;
    })(AbstractModel);
    return EvaluationModel;
});
