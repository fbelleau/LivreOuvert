
import Event = require("../../../core/event/Event");

class SearchEvent extends Event {
	
	static RESULTS: string = "com.cortex.livreouvert.library.event.SearchEvent::RESULTS";

	constructor(aEventName: string) {
		super(aEventName);
	}
}

export = SearchEvent;
