import ElasticTypes = require("./ElasticTypes");

interface ElasticInterface {
	LoadJSON(json: any): void;
	Type(): ElasticTypes;
}

export = ElasticInterface;