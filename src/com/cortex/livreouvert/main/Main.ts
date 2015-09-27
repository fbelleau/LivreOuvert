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

/// <reference path="../../../../../definitions/routie/routie.d.ts" />

import MVCEvent = require("../../core/mvc/event/MVCEvent");
import AbstractController = require("../../core/mvc/AbstractController");

import KeyManager = require("../../core/key/KeyManager");
import IKeyBindable = require("../../core/key/IKeyBindable");
import NavigationManager = require("../../core/navigation/NavigationManager");

import LibraryController = require("../library/LibraryController");

import LazyLoader = require("../../core/net/LazyLoader");

class Main implements IKeyBindable {
	
	private mLastActions: string;
	
	private mLastController:AbstractController;
	
	constructor() {
		
		this.Init();
	}

	public Init(): void {

		this.SetupRouting();
		
		KeyManager.Register(this);
	}

	public KeyPressed(aKeyList:Array<number>):void{
		
		if(aKeyList.indexOf(192) >= 0){
			
			var outputStyle:CSSStyleDeclaration = document.getElementById("output").style;
			
			outputStyle.visibility = outputStyle.visibility == "hidden" ? "visible" : "hidden";
		}
	}
	
	private SetupRouting():void{
		
		routie("", this.ShowLibraryScreen.bind( this ) );
	}
	
	private OnDataLoaded(aResult):void{
		console.log(aResult);
	}
	
	private ShowLibraryScreen():void{
		this.SetupNavigable("library", LibraryController);
	}
	
	private SetupNavigable(aName:string, aControllerClass:any):void {
		
		if(NavigationManager.NavigateTo(aName) == null) {
			
			this.mLastController = this.LoadNavigation(aName, new aControllerClass());
			
		} else {
			
			this.mLastController = this.LoadNavigation(aName);
		}
	}
	
	private LoadNavigation( aActions: string, aForceController:AbstractController = null): AbstractController {
		
		aActions = ( aActions == null ) ? "" : aActions;

		this.mLastActions = aActions;
		
		if(this.mLastController != null){
			
			this.mLastController.Destroy();
		}
		
		this.mLastController = (aForceController != null) ? aForceController : <AbstractController><any>NavigationManager.NavigateTo( aActions.split( "/" )[0] );

		this.mLastController.Init(aActions );
		
		return this.mLastController;
	}
}

export = Main;