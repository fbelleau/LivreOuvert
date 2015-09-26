/**
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractController", "../../core/mvc/AbstractView", "./TeamModel", "./event/TeamEvent", "../../core/mvc/event/MVCEvent", "../../core/mouse/event/MouseTouchEvent", "../../core/ui/GraphicValidator", "../../core/navigation/NavigationManager"], function (require, exports, AbstractController, AbstractView, TeamModel, TeamEvent, MVCEvent, MouseTouchEvent, GraphicValidator, NavigationManager) {
    var TeamController = (function (_super) {
        __extends(TeamController, _super);
        function TeamController() {
            _super.call(this);
            NavigationManager.Register(this);
        }
        TeamController.prototype.Init = function (aActions) {
            _super.prototype.Init.call(this, aActions);
            this.mTeamView = new AbstractView();
            this.mTeamView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mTeamView.LoadTemplate("templates/team/team.html");
        };
        TeamController.prototype.Destroy = function () {
            document.getElementById("core").removeChild(document.getElementById("teamView"));
            this.mTeamInput = null;
            this.mTeamView.Destroy();
            this.mTeamView = null;
        };
        TeamController.prototype.GetRouteList = function () { return TeamController.mRouteList; };
        TeamController.prototype.OnTemplateLoaded = function (aEvent) {
            document.getElementById("core").innerHTML += this.mTeamView.RenderTemplate({});
            this.mTeamView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
            this.mTeamInput = document.getElementById("teamName");
            this.mTeamInput.addEventListener("focusout", this.OnTeamNameFocusOut.bind(this));
            this.mTeamView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
            this.mTeamView.AddClickControl(document.getElementById("createAccount"));
        };
        TeamController.prototype.OnTeamNameFocusOut = function (aEvent) {
            GraphicValidator.HideInputErrorMessage("teamName");
            var teamName = this.mTeamInput.value;
            if (teamName == "") {
                GraphicValidator.ShowInputErrorMessage("teamName", "team name cannot be empty");
            }
            else if (TeamModel.GetInstance().ValidateTeamName(teamName)) {
                GraphicValidator.ShowInputErrorMessage("teamName", "team name is already taken");
            }
        };
        TeamController.prototype.OnScreenClicked = function (aEvent) {
            var element = aEvent.currentTarget;
            if (element.id == "createAccount") {
                TeamModel.GetInstance().CreateTeam(this.mTeamInput.value);
                this.DispatchEvent(new TeamEvent(TeamEvent.SHOW_DEPARTMENT));
            }
        };
        TeamController.mRouteList = ["team"];
        return TeamController;
    })(AbstractController);
    return TeamController;
});
