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

import ElasticInterface = require("./ElasticInterface");
import ElasticTypes = require("./ElasticTypes");
import Genre = require("./Genre");
import Author = require("./Author");

class Book implements ElasticInterface {
	
	private mISBN:string;
	private mType:string;
	private mTitle:string;

	private mCollection:string;
	private mImage:string;
	
	private mGenre:Genre;
	private mAuthor:Author;
	
	public get ISBN():string { return this.mISBN; }
	public set ISBN(aValue:string) { this.mISBN = aValue; }
	
	public get Title():string { return this.mTitle; }
	public set Title(aValue:string) { this.mTitle = aValue; }
	
	public get Author():Author { return this.mAuthor; }	
	public get Genre():Genre { return this.mGenre; }

	public get Collection():string { return this.mCollection; }
	public set Collection(aValue:string) { this.mCollection = aValue; }
	
	public get Image():string { return this.mImage; }
	public set Image(aValue:string) { this.mImage = aValue; }
	
	/**
	 * Interface methods
	 */
	
	public Type():ElasticTypes {
		return ElasticTypes.Book; 
	}
	
	public LoadJSON(json:any):void {
		this.mTitle = json.name;
		this.mAuthor = json.author;
		this.mImage = json.image;
		this.ISBN = json.isbn;
		this.mAuthor = new Author();
		this.mAuthor.Name = json.author;
		this.mGenre = new Genre();
		this.mGenre.Title = json.genre;
	}
}

export = Book;
