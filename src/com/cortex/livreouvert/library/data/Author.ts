import ElasticInterface = require("./ElasticInterface");
import ElasticTypes = require("./ElasticTypes");

class Author implements ElasticInterface {
	
	private mName:string;
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	/**
	 * Interface methods
	 */
	
	public Type(): ElasticTypes {
		return ElasticTypes.Author;
	}
	
	public LoadJSON(json: any):void {
		this.mName = json.name;
	}
}

export = Author;