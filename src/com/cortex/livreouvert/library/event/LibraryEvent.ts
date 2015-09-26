
import Event = require("../../../core/event/Event");

class LibraryEvent extends Event {
	
	static BOOK_FETCHED: string = "com.cortex.livreouvert.library.event.LibraryEvent::BOOK_FETCHED";

	constructor(aEventName: string) {
		super(aEventName);
	}
}

export = LibraryEvent;
