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
import SearchEvent = require("./event/SearchEvent");

class SearchController extends AbstractController implements INavigable {
	
	private mSearchView:AbstractView;
	private static mRouteList:Array<string> = ["", "typeahead"];
	private mTimeout;
	public results;
	
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
		var loginHTMLElement:HTMLElement = document.getElementById("searchResults");
		document.getElementById("core").removeChild(loginHTMLElement);
		
		this.mSearchView.Destroy();
		this.mSearchView = null;
	}
	
	public GetRouteList():Array<string>{ return SearchController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		var _class = this;
		document.getElementById("searchBar").innerHTML += this.mSearchView.RenderTemplate({});
		this.bindEvents();
		this.mSearchView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
	public InputTextUpdated(): void {
		if(this.mTimeout) {
			clearTimeout(this.mTimeout);
		}
		this.mTimeout = setTimeout(this.UpdateResults.bind(this), 200);
	}
	
	private UpdateResults():void {
		var keywords = (<HTMLInputElement>document.getElementById("keywords")).value;
		if(keywords.length < 2) {
			document.getElementById("typeAHeadresults").innerHTML = '';
		}
		if(keywords.length > 1) {
			keywords = keywords.replace('-',' ');
			var elasticSearchQuery = {
				"query" : {
					"query_string": {
						"fields" : ["name"],
						"query" : keywords + "*",
						"default_operator" : "AND"
					}
				},
				"highlight" : {
					"pre_tags" : ["<b>"],
					"post_tags" : ["</b>"],
					"fields" : {
						"name" : {}
					}
				}
			};
			
			var url = "http://louiscyr2.bio2rdf.org/biblio-lo-v2/_search";
			LazyLoader.killLast();
			var promise = LazyLoader.sendJSON(url, elasticSearchQuery, true);
			promise.then(() => this.OnDataReceived(promise.result, keywords));
		}
	}
	
	private bindEvents(): void {
		document.getElementById("keywords").addEventListener('keyup', this.InputTextUpdated.bind(this) );
		document.getElementById("keywords").addEventListener('change', this.InputTextUpdated.bind(this) );
	}
	
	private OnDataReceived(data,keywords): void {
		document.getElementById("typeAHeadresults").innerHTML = this.mSearchView.RenderTemplate(data);
		this.results = data;
		this.DispatchEvent(new SearchEvent(SearchEvent.RESULTS));
		this.bindEvents();
	}		
}

export = SearchController;
