
import Event = require("../../../core/event/Event");

class SearchEvent extends Event {
	
	static RESULTS_GENRE: string = "com.cortex.livreouvert.library.event.SearchEvent::RESULTS_GENRE";
	static RESULTS_BOOK: string = "com.cortex.livreouvert.library.event.SearchEvent::RESULTS_BOOK";
	static RESULTS_AUTHOR: string = "com.cortex.livreouvert.library.event.SearchEvent::RESULTS_AUTHOR";

	constructor(aEventName: string) {
		super(aEventName);
	}
}

export = SearchEvent;
