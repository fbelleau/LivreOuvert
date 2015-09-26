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
import SearchController = require("../search/SearchController");
import SearchEvent = require("../search/event/SearchEvent");

declare var Masonry: any;

class LibraryController extends AbstractController implements INavigable {
	
	private static mRouteList:Array<string> = ["", "library"];
	
	private mLibraryView:AbstractView;
	private mLibraryModel:LibraryModel;
	
	private mSearchController:SearchController;
	private mMasonry:any;
	
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
		
		document.getElementById("core").innerHTML += this.mLibraryView.RenderTemplate({});
		
		this.mSearchController = new SearchController();
		this.mSearchController.Init('searchBar');
		this.mSearchController.AddEventListener(SearchEvent.RESULTS, this.OnBookListLoaded, this);
	}
	
	private OnBookListLoaded(aEvent:LibraryEvent):void {
		
		var templateData:any = {dataList:this.mSearchController.results};
		
		document.getElementById("core").innerHTML += this.mLibraryView.RenderTemplate(templateData);
		
		this.mMasonry = new Masonry( '.grid', {
												columnWidth: 200,
												itemSelector: '.grid-item',
												transitionDuration: '0.2s'
											});
		
		this.mLibraryView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		for(var i:number = 0; i < templateData.dataList.length; i++){
			 
			this.mLibraryView.AddClickControl(document.getElementById(templateData.dataList[i].ISBN));
		}
		
		this.mMasonry.layout();
	}
	
	private OnScreenClicked(aEvent:MVCEvent):void{
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		var bookISBN:string = this.mLibraryModel.GetBookByISBN(element.id).ISBN;
		
		if(element.className == "grid-item"){
			
			element.className = "grid-item-selected";
			document.getElementById("title"+bookISBN).style.visibility = "visible";
		} else {
			
			element.className = "grid-item";
			document.getElementById("title"+bookISBN).style.visibility = "hidden";
		}
		
		this.mMasonry.layout();
	}
}

export = LibraryController;
