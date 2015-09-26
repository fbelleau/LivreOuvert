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

import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = require("../../core/mvc/AbstractView");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");
import Logger = require("../../core/debug/Logger");
import LazyLoader = require("../../core/net/LazyLoader");

class SearchController extends AbstractController implements INavigable {
	
	private mSearchView:AbstractView;
	
	private static mRouteList:Array<string> = ["", "typeahead"];
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void{
				
		this.mSearchView = new AbstractView();
		this.mSearchView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mSearchView.LoadTemplate("templates/search/index.html");
	}
	
	public Destroy():void {
		var loginHTMLElement:HTMLElement = document.getElementById("searchWrapper");
		document.getElementById("core").removeChild(loginHTMLElement);
		
		this.mSearchView.Destroy();
		this.mSearchView = null;
	}
	
	public GetRouteList():Array<string>{ return SearchController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		var _class = this;
		document.getElementById("core").innerHTML += this.mSearchView.RenderTemplate({});
		document.getElementById("keywords").addEventListener('keyup', function() { _class.OnKeyUpEvent(_class) });
		this.mSearchView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
	public OnKeyUpEvent(_class): void {
		var keywords = (<HTMLInputElement>document.getElementById("keywords")).value;
		if(keywords.length > 1) {
			var elasticSearchQuery = {
				"query" : {
					"query_string": {
						"fields" : ["titre"],
						"query" : keywords + "*"
					}
			},
				"highlight" : {
					"pre_tags" : ["<b>"],
					"post_tags" : ["</b>"],
					"fields" : {
						"titre" : {}
					}
				}
			};
			
			var url = "http://livreouvert.santerref.net/biblio-paris/resource/_search";
			var promise = LazyLoader.sendJSON(url, elasticSearchQuery, true);
			promise.then(() => this.OnDataReceived(promise.result,_class,keywords));
		}
	}
	
	private OnDataReceived(data,_class,keywords): void {
		document.getElementById("core").innerHTML = _class.mSearchView.RenderTemplate(data);
		(<HTMLInputElement>document.getElementById("keywords")).value = keywords;
		document.getElementById("keywords").addEventListener('keyup', function() { _class.OnKeyUpEvent(_class) });
		document.getElementById("keywords").focus()
	}	
}

export = SearchController;
