var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractModel", "./data/Team"], function (require, exports, AbstractModel, Team) {
    var TeamModel = (function (_super) {
        __extends(TeamModel, _super);
        function TeamModel() {
            _super.call(this);
        }
        TeamModel.prototype.CreateTeam = function (aTeamName) {
            this.mTeam = new Team();
            this.mTeam.Name = aTeamName;
        };
        TeamModel.prototype.GetTeam = function () { return this.mTeam; };
        TeamModel.prototype.ValidateTeamName = function (aTeamName) {
            // validate team name on server
            return (false);
        };
        TeamModel.GetInstance = function () {
            if (TeamModel.mInstance == null) {
                TeamModel.mInstance = new TeamModel();
            }
            return TeamModel.mInstance;
        };
        return TeamModel;
    })(AbstractModel);
    return TeamModel;
});
