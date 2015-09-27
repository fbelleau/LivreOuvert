
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

import Genre = require("../library/data/Genre");
import Author = require("../library/data/Author");
import Book = require("../library/data/Book");

import SearchEvent = require("./event/SearchEvent");

class SearchModel extends AbstractModel {
	
	private static mInstance:SearchModel;
	
	public static BASE_URL:string = "http://louiscyr2.bio2rdf.org/biblio-*/_search";
	
	public mBookList:Array<Book>;
	public mAuthorList:Array<Author>;
	public mGenreList:Array<Genre>;
	
	constructor() {
		
		super();
		
		this.mBookList = new Array<Book>();
		this.mAuthorList = new Array<Author>();
		this.mGenreList = new Array<Genre>();
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
	
	public RequestGenreTopList(aGenre:string):void{
		
		var elasticSearchQuery = {
			"query":{
				"query_string":{
					"query":"image:http* AND genre:"+aGenre+"*",
					"analyze_wildcard":true
				}
			},
			"size":0,
			"aggs":{"9":{"terms":{"field":"genre.raw","size":1,"order":{"_count":"desc"}},"aggs":{"7":{"terms":{"field":"image.raw","size":10,"order":{"_count":"desc"}}}}}}
		}
		
		LazyLoader.killLast();
		
		this.AddEventListener(MVCEvent.JSON_LOADED, this.OnGenreTopListResponse, this);
		
		this.Post(SearchModel.BASE_URL, elasticSearchQuery, true);
	}
	
	private OnGenreTopListResponse(aEvent:MVCEvent):void{
		
		this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnGenreTopListResponse, this);
		
		this.mGenreList.length = 0;
		
		var bucketList = this.mDataCache[SearchModel.BASE_URL].aggregations["9"].buckets;

		for(var i:number = 0; i < bucketList.length; i++){
			
			var genre:Genre = new Genre();
			
			genre.Title = bucketList[i].key;
			genre.Image = bucketList[i]["7"].buckets[0].key;
			
			this.mGenreList.push(genre);
		}
		
		this.DispatchEvent(new SearchEvent(SearchEvent.RESULTS_BOOK));
	}
	
	public RequestTopGenreList(aGenre:string):void{
		
		var elasticSearchQuery = {
			"query":{
				"query_string":{
					"query":"image:http* AND genre:"+aGenre+"*",
					"analyze_wildcard":true
				}
			},
			"size":0,
			"aggs":{"9":{"terms":{"field":"genre.raw","size":40,"order":{"_count":"desc"}},"aggs":{"7":{"terms":{"field":"image.raw","size":1,"order":{"_count":"desc"}}}}}}}
		
		LazyLoader.killLast();
		
		this.AddEventListener(MVCEvent.JSON_LOADED, this.OnTopGenreListResponse, this);
		
		this.Post(SearchModel.BASE_URL, elasticSearchQuery, true);
	}
	
	private OnTopGenreListResponse(aEvent:MVCEvent):void {
		
		this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnTopGenreListResponse, this);
		
		this.mGenreList.length = 0;
		
		var bucketList = this.mDataCache[SearchModel.BASE_URL].aggregations["9"].buckets;

		for(var i:number = 0; i < bucketList.length; i++){
			
			var genre:Genre = new Genre();
			
			genre.Title = bucketList[i].key;
			genre.Image = bucketList[i]["7"].buckets[0].key;
			
			this.mGenreList.push(genre);
		}
		
		this.DispatchEvent(new SearchEvent(SearchEvent.RESULTS_GENRE));
	}
	
	public RequestAuthorTopList(aAuthor:string):void {
		
		var elasticSearchQuery = 
		{
			"query": {
				"query_string": {
				"query": "image:http* AND author:"+aAuthor+"*",
				"analyze_wildcard": true
				}
			},
			"size": 0,
			"aggs":{"6":{"terms":{"field":"author.raw","size":1,"order":{"_count":"desc"}},"aggs":{"8":{"terms":{"field":"name.raw","size":10,"order":{"_count":"desc"}},"aggs":{"5":{"terms":{"field":"genre.raw","size":1,"order":{"_count":"desc"}},"aggs":{"10":{"terms":{"field":"publisher.raw","size":1,"order":{"_count":"desc"}},"aggs":{"9":{"terms":{"field":"copyrightYear.raw","size":1,"order":{"_count":"desc"}},"aggs":{"7":{"terms":{"field":"image.raw","size":1,"order":{"_count":"desc"}}}}}}}}}}}}}}
		}
		
		LazyLoader.killLast();
		
		this.AddEventListener(MVCEvent.JSON_LOADED, this.OnDataReceived, this);
		
		this.Post(SearchModel.BASE_URL, elasticSearchQuery, true);
		
	}
	private OnDataReceived(aEvent:MVCEvent):void{
		
		console.log(this.mDataCache[SearchModel.BASE_URL])
		
		this.DispatchEvent(new SearchEvent(SearchEvent.RESULTS_BOOK));
	}
	
	public static GetInstance():SearchModel{
		
		if(SearchModel.mInstance == null){
			
			SearchModel.mInstance = new SearchModel();
		}
		
		return SearchModel.mInstance;
	}
}

export = SearchModel;