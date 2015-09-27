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
import LazyLoader = require("../../core/net/LazyLoader");

import SearchEvent = require("./event/SearchEvent");
import SearchModel = require("./SearchModel");

class SearchController extends AbstractController implements INavigable {
	
	private static mRouteList:Array<string> = ["", "typeahead"];
	
	private mSearchView:AbstractView;
	private mSearchModel:SearchModel;
	
	private mTimeout;
	public results;
	
	public mSearchMode:string = "name";
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void{
				
		this.mSearchView = new AbstractView();
		this.mSearchView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mSearchView.LoadTemplate("templates/search/index.html");
		
		this.mSearchModel = SearchModel.GetInstance();
	}
	
	public Destroy():void {
		var loginHTMLElement:HTMLElement = document.getElementById("searchResults");
		document.getElementById("core").removeChild(loginHTMLElement);
		
		this.mSearchView.Destroy();
		this.mSearchView = null;
	}
	
	public GetRouteList():Array<string>{ return SearchController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
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
			
			this.Search(keywords, true, [this.mSearchMode]);	
		}
	}
	
	public Search(aKeyword:string, aAutoComplete:boolean, aFields:string[]):void{
		
		LazyLoader.killLast();

		if(this.mSearchMode == "author"){
			this.mSearchModel.AddEventListener(SearchEvent.RESULTS_AUTHOR, this.OnSearchResults, this);
			this.mSearchModel.RequestAuthorTopList(aKeyword);
		}else if(this.mSearchMode == "genre"){
			this.mSearchModel.AddEventListener(SearchEvent.RESULTS_GENRE, this.OnSearchResults, this);
			this.mSearchModel.RequestTopGenreList(aKeyword);
		}else{
			this.mSearchModel.AddEventListener(SearchEvent.RESULTS_BOOK, this.OnSearchResults, this);
			this.mSearchModel.RequestSearch(aKeyword, aAutoComplete, aFields);
		}
	}
	
	public GetTopGenreList(aKeyword:string):void{
		
		this.mSearchModel.AddEventListener(SearchEvent.RESULTS_BOOK, this.OnSearchResults, this);
		this.mSearchModel.RequestGenreTopList(aKeyword);
	}
	
	private OnSearchResults(aEvent:SearchEvent):void{
		
		this.mSearchModel.RemoveEventListener(aEvent.eventName, this.OnSearchResults, this);
		
		if(this.mSearchMode == "author"){
			
			this.results = this.mSearchModel.mAuthorList;
			
		}else if(this.mSearchMode == "genre"){
			
			this.results = this.mSearchModel.mGenreList;
			
		}else{
			
			this.results = this.mSearchModel.mBookList;
		}
		
		document.getElementById("typeAHeadresults").innerHTML = this.mSearchView.RenderTemplate(this.results);
		
		this.DispatchEvent(new SearchEvent(aEvent.eventName));
		this.bindEvents();
	}
	
	private bindEvents(): void {
		document.getElementById("keywords").addEventListener('keyup', this.InputTextUpdated.bind(this) );
		document.getElementById("keywords").addEventListener('change', this.InputTextUpdated.bind(this) );
	}
}

export = SearchController;
