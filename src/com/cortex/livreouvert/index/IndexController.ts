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

class IndexController extends AbstractController implements INavigable {
	
	private mIndexView:AbstractView;
	
	private static mRouteList:Array<string> = ["", "login"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void{
				
		this.mIndexView = new AbstractView();
		this.mIndexView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		var url = "http://livreouvert.santerref.net/biblio-paris/resource/a2440359a918c2810bd55b76e4cdd7adfc6ce8c1";
		var promise = LazyLoader.loadJSON(url);
		promise.then(() => this.OnDataReceive(promise.result));
		
		this.mIndexView.LoadTemplate("templates/index/index.html");
	}
	
	private OnDataReceive(data):void {
		document.getElementById("core").innerHTML = this.mIndexView.RenderTemplate(data._source.fields);
		this.mIndexView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
	public Destroy():void {
		
		var loginHTMLElement:HTMLElement = document.getElementById("indexWrapper");
		document.getElementById("core").removeChild(loginHTMLElement);
		
		this.mIndexView.Destroy();
		this.mIndexView = null;
	}
	
	public GetRouteList():Array<string>{ return IndexController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		document.getElementById("core").innerHTML = '<div id="loading"></div>';
	}
	
}

export = IndexController;
