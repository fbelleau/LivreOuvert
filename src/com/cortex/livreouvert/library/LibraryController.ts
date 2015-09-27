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
import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");
import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");
import Logger = require("../../core/debug/Logger");

import LibraryModel = require("./LibraryModel");
import LibraryEvent = require("./event/LibraryEvent");
import Book = require("./data/Book");
import Genre = require("./data/Genre");

import SearchController = require("../search/SearchController");
import SearchEvent = require("../search/event/SearchEvent");

declare var Masonry: any;

class LibraryController extends AbstractController implements INavigable {
	
	private static mRouteList:Array<string> = ["", "library"];
	
	private mLibraryView:AbstractView;
	private mLibraryModel:LibraryModel;
	
	private mGridItemList:Array<any>;
	
	private mSearchController:SearchController;
	
	private mMasonry:any;
	
	private mSearchMode:string;
	
	constructor() {
		
		super();
		
		this.mLibraryModel = LibraryModel.GetInstance();
		
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void{
				
		this.mLibraryView = new AbstractView();
		this.mLibraryView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mLibraryView.LoadTemplate("templates/library/library.html");
	}
	
	public Destroy():void {
		
		var loginHTMLElement:HTMLElement = document.getElementById("libraryView");
		document.getElementById("core").removeChild(loginHTMLElement);
		
		this.mLibraryView.Destroy();
		this.mLibraryView = null;
	}
	
	public GetRouteList():Array<string>{ return LibraryController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		this.mLibraryView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		if(document.readyState == "complete" || document.readyState == "interactive"){
			
			this.OnDeviceReady();
			
		} else {
			
			document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
		}
	}
	
	private OnDeviceReady():void{
		
		this.mLibraryView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		var templateData:any = {dataList:this.mLibraryModel.GetBookList()};
		
		this.mGridItemList = new Array<any>();
		
		document.getElementById("core").innerHTML += this.mLibraryView.RenderTemplate({});
		
		this.mSearchMode = "menu";
		
		this.mSearchController = new SearchController();
		this.mSearchController.Init('searchBar');
		this.mSearchController.AddEventListener(SearchEvent.RESULTS_BOOK, this.OnBookListLoaded, this);
		
		this.mLibraryView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.RefreshGridList();
	}
	
	private RefreshGridList():void{
		
		var gridDiv:HTMLElement = document.getElementById("grid");
		
		while(this.mGridItemList.length > 0) {
			
			if(gridDiv.children[0] != null){
				gridDiv.removeChild(gridDiv.children[0]);
			}
			this.mGridItemList.splice(0,1);
		}
		
		if(this.mSearchMode == "menu"){
			
			this.ShowMenuList();
			
		} if(this.mSearchMode == "author"){
			
			this.ShowAuthorList();
			
		} if(this.mSearchMode == "genre"){
			
			this.ShowGenreList();
			
		} else {
			
			this.ShowBookList();
		}
	}
	
	private ShowAuthorList():void{
		
	}
	
	private ShowGenreList():void{
		debugger
		var genreList:Array<Genre> = this.mSearchController.results;
		
		for(var i:number = 0; i < genreList.length; i++){
			
			var gridItem:AbstractView = new AbstractView();
			
			gridItem.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnGenreTemplateLoaded, this);
			
			gridItem.LoadTemplate("templates/library/gridItem.html");
			
			this.mGridItemList.push({view:gridItem, genre:genreList[i], loaded:false});
		}
	}
	
	private OnGenreTemplateLoaded(aEvent:MVCEvent):void{
		
		this.SetupGenreTemplate(<AbstractView>aEvent.target);
		
		this.InitMasonry();
	}
	
	private ShowMenuList():void {
		
		var menuList:Array<any> = [
									{Type:function() { return "menu"; }, Name:"author"},
									{Type:function() { return "menu"; }, Name:"genre"},
									{Type:function() { return "menu"; }, Name:"title"}
								];
		
		for(var i:number = 0; i < menuList.length; i++){
			
			var gridItem:AbstractView = new AbstractView();
			
			gridItem.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnMenuTemplateLoaded, this);
			
			gridItem.LoadTemplate("templates/library/gridItem.html");
			
			this.mGridItemList.push({view:gridItem, menu:menuList[i], loaded:false});
		}
	}
	
	private SetupGenreTemplate(aGenreTemplate:AbstractView):void{
		
		aGenreTemplate.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnGenreTemplateLoaded, this);
		
		for(var i:number = 0; i < this.mGridItemList.length; i++){
			
			if(this.mGridItemList[i].view == aGenreTemplate){
				
				this.mGridItemList[i].loaded = true;
				
				document.getElementById("grid")
					.insertAdjacentHTML("beforeend", 
										aGenreTemplate.RenderTemplate({ ElasticObject:this.mGridItemList[i].genre }));
				break;
			}
		}
		
		this.mLibraryView.AddClickControl(document.getElementById("genre"+this.mGridItemList[i].genre.Title));
	}
	
	private SetupMenuTemplate(aMenuTemplate:AbstractView):void {
		
		aMenuTemplate.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBookTemplateLoaded, this);
		
		for(var i:number = 0; i < this.mGridItemList.length; i++){
			
			if(this.mGridItemList[i].view == aMenuTemplate){
				
				this.mGridItemList[i].loaded = true;
				
				document.getElementById("grid")
					.insertAdjacentHTML("beforeend", 
										aMenuTemplate.RenderTemplate({ ElasticObject:this.mGridItemList[i].menu }));
				break;
			}
		}
		
		this.mLibraryView.AddClickControl(document.getElementById("menu"+this.mGridItemList[i].menu.Name));
	}
	
	private OnMenuTemplateLoaded(aEvent:MVCEvent):void{
		
		this.SetupMenuTemplate(<AbstractView>aEvent.target);
		
		this.InitMasonry();
	}
	
	private ShowBookList():void {
		
		var bookList:Array<Book> = this.mLibraryModel.GetBookList();
		
		for(var i:number = 0; i < bookList.length; i++){
			
			var gridItem:AbstractView = new AbstractView();
			
			gridItem.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBookTemplateLoaded, this);
			
			gridItem.LoadTemplate("templates/library/gridItem.html");
			
			this.mGridItemList.push({view:gridItem, book:bookList[i], loaded:false});
		}
	}
	
	private SetupBookTemplate(aBookTemplate:AbstractView):void {
		
		aBookTemplate.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBookTemplateLoaded, this);
		
		for(var i:number = 0; i < this.mGridItemList.length; i++){
			
			if(this.mGridItemList[i].view == aBookTemplate){
				
				this.mGridItemList[i].loaded = true;
				document.getElementById("grid")
					.insertAdjacentHTML("beforeend", aBookTemplate.RenderTemplate({ElasticObject:this.mGridItemList[i].book}));
				break;
			}
		}
		
		this.mLibraryView.AddClickControl(document.getElementById(this.mGridItemList[i].book.ISBN));
	}
	
	private InitMasonry():void{
		
		var initMasonry:boolean = true;
		
		for(var i:number = 0; i < this.mGridItemList.length; i++){
			
			if(!this.mGridItemList[i].loaded){
				
				initMasonry = false;
				break;
			}
		}
		
		if(!initMasonry){ return; }
			
		this.mMasonry = new Masonry( '.grid', {
												columnWidth: 200,
												itemSelector: '.grid-item',
												transitionDuration: '0.2s'
											});
											
		this.mMasonry.layout();
	}
	
	private OnBookTemplateLoaded(aEvent:MVCEvent):void{
		
		this.SetupBookTemplate(<AbstractView>aEvent.target);
		
		this.InitMasonry();
	}
	
	private OnBookClick(aElement:HTMLElement):void{
		
		var bookISBN:string = this.mLibraryModel.GetBookByISBN(aElement.id).ISBN;
		
		if(aElement.className == "grid-item"){
			
			aElement.className = "grid-item-selected";
			document.getElementById("title"+bookISBN).style.visibility = "visible";
			
		} else {
			
			aElement.className = "grid-item";
			document.getElementById("title"+bookISBN).style.visibility = "hidden";
		}
	}
	
	private OnMenuClick(aElement:HTMLElement):void{
			
		this.mSearchMode = aElement.id.split("menu")[1];
		
		this.mSearchController.mSearchMode = this.mSearchMode;
		
		if(this.mSearchMode == "genre"){
			
			this.mSearchController.AddEventListener(SearchEvent.RESULTS_GENRE, this.OnGenreListLoaded, this);
			
		}else if(this.mSearchMode == "author"){
			
			this.mSearchController.AddEventListener(SearchEvent.RESULTS_AUTHOR, this.OnAuthorListLoaded, this);
				
		}else{
			
			this.mSearchController.AddEventListener(SearchEvent.RESULTS_BOOK, this.OnBookListLoaded, this);
		}
		
		this.mSearchController.Search("", false, [this.mSearchMode]);
	}
	
	private OnGenreClick(aElement:HTMLElement):void{
		
		var genre:string = aElement.id.split("genre")[1];
		
		this.mSearchController.mSearchMode = this.mSearchMode;
		
		this.mSearchController.GetTopGenreList(genre);
	}
	
	private OnBookListLoaded(aEvent:LibraryEvent):void {
		
		this.mSearchController.RemoveEventListener(SearchEvent.RESULTS_BOOK, this.OnBookListLoaded, this);
		
		this.mSearchMode = "title";
		
		this.RefreshGridList();
	}
	
	private OnGenreListLoaded(aEvent:MVCEvent):void {
		
		this.mSearchController.RemoveEventListener(SearchEvent.RESULTS_GENRE, this.OnGenreListLoaded, this);
		
		this.RefreshGridList();
	}
	
	private OnAuthorListLoaded(aEvent:MVCEvent):void{
		
		this.mSearchController.RemoveEventListener(SearchEvent.RESULTS_AUTHOR, this.OnAuthorListLoaded, this);
		
		this.RefreshGridList();
	}
	
	private OnScreenClicked(aEvent:MVCEvent):void{
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if(element.id.indexOf("menu") >= 0) {
			
			this.OnMenuClick(element);
			
		}else if(element.id.indexOf("genre") >= 0) {
			
			this.OnGenreClick(element);
			
		}else{
			
			this.OnBookClick(element);
		}
		
		this.mMasonry.layout();
	}
}

export = LibraryController;
