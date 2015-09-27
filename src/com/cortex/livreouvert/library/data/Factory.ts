import Book = require("./Book");
import Author = require("./Author");
import Genre = require("./Genre");

import ElasticObject = require("./ElasticObject");
import ElasticTypes = require("./ElasticTypes");

class Factory {

	public static BuildJSON(aType:ElasticTypes, json:any):ElasticObject {
		var elasticObject;
		if(aType == ElasticTypes.Book) {
			elasticObject = new Book().LoadJSON(json);
		} else if(aType == ElasticTypes.Author) {
			elasticObject = new Author().LoadJSON(json);
		} else if(aType == ElasticTypes.Genre) {
			elasticObject = new Genre().LoadJSON(json);
		}
		return elasticObject;
	}

}