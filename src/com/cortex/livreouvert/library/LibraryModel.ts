
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
	
	constructor() {
		
		super();
		
		this.mBookList = new Array<Book>();
	}
	
	public GetBookList():Array<Book> {
		
		return this.mBookList;
	}
	
	public GetBookByISBN(aISBN:string):Book {
		
		for(var i:number = 0; i < this.mBookList.length; i++){
			
			if(this.mBookList[i].ISBN == aISBN){
				
				return(this.mBookList[i]);
			}
		}
		
		return(null);
	}
	
	public FormatBookData(aData:any):void{
		
		var rawData:Array<any> = aData.hits.hits;
		
		this.mBookList.length = 0;
		
		for(var i:number = 0; i < rawData.length; i++){
			
			var book:Book = new Book();
			book.LoadJSON(rawData[i]._source)
			this.mBookList.push(book)
		}
	}
	
	public static GetInstance():LibraryModel{
		
		if(LibraryModel.mInstance == null){
			
			LibraryModel.mInstance = new LibraryModel();
		}
		
		return LibraryModel.mInstance;
	}
}

export = LibraryModel;