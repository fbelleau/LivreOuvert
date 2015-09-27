
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
import AbstractModel = require("../../core/mvc/AbstractModel");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import Logger = require("../../core/debug/Logger");
import LazyLoader = require("../../core/net/LazyLoader");

import SearchEvent = require("./event/SearchEvent");

class SearchModel extends AbstractModel {
	
	private static mInstance:SearchModel;
	
	public static BASE_URL:string = "http://louiscyr2.bio2rdf.org/biblio-lo-v2/_search";
	
	constructor() {
		
		super();
	}
	
	public RequestSearch(aKeyword:string, aAutoComplete:boolean, fields:string[]):void {
		
		var query:string = (aAutoComplete) ? aKeyword + "*" : aKeyword;
		
		var elasticSearchQuery = 
		{
			"query" : {
				"query_string": {
					"fields" : fields,
					"query" : query,
					"default_operator" : "AND"
				}
			},
			"highlight" : {
				"pre_tags" : ["<b>"],
				"post_tags" : ["</b>"],
				"fields" : {
					"*" : {}
				}
			}
		};
		
		LazyLoader.killLast();
		
		this.AddEventListener(MVCEvent.JSON_LOADED, this.OnDataReceived, this);
		
		this.Post(SearchModel.BASE_URL, elasticSearchQuery, true);
	}
	
	private OnDataReceived(aEvent:MVCEvent):void{
		
		console.log(this.mDataCache[SearchModel.BASE_URL])
		
		this.DispatchEvent(new SearchEvent(SearchEvent.RESULTS));
	}
	
	public static GetInstance():SearchModel{
		
		if(SearchModel.mInstance == null){
			
			SearchModel.mInstance = new SearchModel();
		}
		
		return SearchModel.mInstance;
	}
}

export = SearchModel;