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

import ComponentData = require("../../../core/component/data/ComponentData");

class Book extends ComponentData {
	
	private mISBN:string;
	private mType:string;
	private mTitle:string;
	private mAuthor:string;
	private mCollection:string;
	private mImage:string;
	
	constructor() {
		
		super();
	}
	
	public get ISBN():string { return this.mISBN; }
	public set ISBN(aValue:string) { this.mISBN = aValue; }
	
	public get Type():string { return this.mType; }
	public set Type(aValue:string) { this.mType = aValue; }
	
	public get Title():string { return this.mTitle; }
	public set Title(aValue:string) { this.mTitle = aValue; }
	
	public get Author():string { return this.mAuthor; }
	public set Author(aValue:string) { this.mAuthor = aValue; }
	
	public get Collection():string { return this.mCollection; }
	public set Collection(aValue:string) { this.mCollection = aValue; }
	
	public get Image():string { return this.mImage; }
	public set Image(aValue:string) { this.mImage = aValue; }
	
	public FromJSON(aData:any):void{
		this.mTitle = aData.name;
		this.mAuthor = aData.author;
		this.mType = "book";
		this.mImage = aData.image;
		this.ISBN = aData.isbn;
		this.mTitle = aData.title;
	}
}

export = Book;
