
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

import Book = require("./data/Book");
import LibraryEvent = require("./event/LibraryEvent");

class LibraryModel extends AbstractModel {
	
	private static mInstance:LibraryModel;
	
	private mBookList:Array<Book>;
	
	public static AUTHOR_URL:string = "http://louiscyr2.bio2rdf.org/biblio-lo-v2/_search?/q=author";
	
	constructor() {
		
		super();
		
		this.mBookList = new Array<Book>();
	}
	
	public GetBookList():Array<Book> {
		
		return this.mBookList;
	}
	
	public RequestBookList():void {
		
		this.AddEventListener(MVCEvent.JSON_LOADED, this.OnBookListLoaded, this);
		
		this.Fetch(LibraryModel.AUTHOR_URL);
	}
	
	private OnBookListLoaded(aEvent:MVCEvent):void{
		
		this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnBookListLoaded, this);
		
		var rawData:Array<any> = this.mDataCache[LibraryModel.AUTHOR_URL].hits.hits;
		
		for(var i:number = 0; i < rawData.length; i++){
			
			var book:Book = new Book();
			book.FromJSON(rawData[i]._source)
			this.mBookList.push(book)
		}
		
		this.DispatchEvent(new LibraryEvent(LibraryEvent.BOOK_FETCHED));
	}
	
	public static GetInstance():LibraryModel{
		
		if(LibraryModel.mInstance == null){
			
			LibraryModel.mInstance = new LibraryModel();
		}
		
		return LibraryModel.mInstance;
	}
}

export = LibraryModel;