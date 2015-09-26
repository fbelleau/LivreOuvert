/******
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
import Logger = require("../debug/Logger");
import EventDispatcher = require("../event/EventDispatcher");
import MouseTouchEvent = require("./event/MouseTouchEvent");
import IDestroyable = require("../garbage/IDestroyable");
import Mouse = require("./Mouse");
import Point = require("../geom/Point");

class AbstractView extends EventDispatcher implements IDestroyable {
	
	private mTouchTarget:any;
	private mLastTouchEvent:TouchEvent;
	
	private mMousePosition:Point;
	
	private mElementList:Array<HTMLElement>;
	
	constructor() {
		
		super();
		
		this.mElementList = new Array<HTMLElement>();
		
		this.mMousePosition = new Point();
	}
	
	public Destroy() : void {
		
		for(var i:number = 0; i < this.mElementList.length; i++){
			
			this.RemoveClickControl(this.mElementList[i]);
		}
		
		this.mElementList.length = 0;
		this.mElementList = null;
		
		this.mLastTouchEvent = null;
		
		this.mMousePosition = null;
	}
	
	public AddClickControl(aElement:HTMLElement):void {
		
		this.mElementList.push(aElement);
		
		aElement.addEventListener("touchstart", this.OnTouchStart.bind(this));
		aElement.addEventListener("touchmove", this.OnTouchMove.bind(this));
		aElement.addEventListener("touchend", this.OnTouchEnd.bind(this));
		aElement.addEventListener("mousedown", this.OnMouseDown.bind(this));
		aElement.addEventListener("mouseup", this.OnMouseUp.bind(this));
	}
	
	public RemoveClickControl(aElement:HTMLElement):void {
		
		var elementIndex:number = this.mElementList.indexOf(aElement);
		
		var element:HTMLElement = this.mElementList[elementIndex];
		
		element.removeEventListener("touchstart", this.OnTouchStart.bind(this));
		element.removeEventListener("touchmove", this.OnTouchMove.bind(this));
		element.removeEventListener("touchend", this.OnTouchEnd.bind(this));
		element.removeEventListener("mousedown", this.OnMouseDown.bind(this));
		element.removeEventListener("mouseup", this.OnMouseUp.bind(this));
		
		this.mElementList.splice(elementIndex, 1);
	}
	
	private OnMouseDown(aEvent:MouseEvent):void{
		
			
	}
	
	private OnMouseUp(aEvent:MouseEvent):void{
		
		var touchEvent:MouseTouchEvent = new MouseTouchEvent(MouseTouchEvent.TOUCHED);
		
		touchEvent.target = aEvent.target;
		touchEvent.currentTarget = aEvent.currentTarget;
		
		this.DispatchEvent(touchEvent);
	}
	
	private OnTouchStart(aEvent:TouchEvent):void{
		
		this.mLastTouchEvent = aEvent;
		
		this.mTouchTarget = aEvent.target;
		
		var firstTouch:Touch = aEvent.targetTouches.item(0);
		
		this.mMousePosition.X = firstTouch.clientX || firstTouch.pageX;
		this.mMousePosition.Y = firstTouch.clientY || firstTouch.pageY;
	}
	
	private OnTouchMove(aEvent:TouchEvent):void{
		
		this.mLastTouchEvent = aEvent;
	}
	
	private OnTouchEnd(aEvent:TouchEvent):void{
		
		var endTouch:Touch = this.mLastTouchEvent.targetTouches.item(0);
		
		var endTouchX:number = endTouch.clientX || endTouch.pageX;
		var endTouchY:number = endTouch.clientY || endTouch.pageY;
		
		if(	this.mTouchTarget === this.mLastTouchEvent.target && 
			this.mMousePosition.X === endTouchX && 
			this.mMousePosition.Y === endTouchY)
		{
			var touchEvent:MouseTouchEvent = new MouseTouchEvent(MouseTouchEvent.TOUCHED);
			
			touchEvent.target = aEvent.target;
			touchEvent.currentTarget = aEvent.currentTarget;
			
			this.DispatchEvent(touchEvent)	
		}	
	}
}

export = AbstractView;
