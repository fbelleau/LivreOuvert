import ElasticInterface = require("./ElasticInterface");
import ElasticTypes = require("./ElasticTypes");

class Genre implements ElasticInterface {
	
	private mTitle:any;
	
	public get Title():string { 
		if(Array.isArray(this.mTitle)) {
			return this.mTitle.join(', ');
		}
		return this.mTitle; 
	}
	
	public set Title(aValue:string) { this.mTitle = aValue; }
	
	/**
	 * Interface methods
	 */
	
	public Type(): ElasticTypes {
		return ElasticTypes.Author;
	}
	
	public LoadJSON(json: any):void {
		this.mTitle = json.genre;
	}
}

export = Genre;