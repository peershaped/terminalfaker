/**
 * Editor is het globale object voor elke applicatie
 * Editors zijn bijvoorbeeld:
 * - touch
 * - nano
 * - vim
 */

/**
 * RESERVED COMMANDS 
 * - close nano
 * - close vim
 * - close touch
 */
var commands = [
	'cd Desktop',
	'nano explenation.md',
	'vim bla.txt',
	'rinke is gek',
	'maar dit is een iets langere zin'
]

$(function(){
	window.terminal = new Terminal(commands);
	// window.scriptrunner = new Scriptrunner();
});

	// haal de commands op
	// write de eerste command
	// luister voor event executed true
	// write volgende command
	// 

/**
 * Terminal Object
 * 
 */
var Terminal = function(commands) {	
	this.init.apply(this, arguments);
}


Terminal.prototype.init = function()
{	
	this.setDate();
	this.editor = new Editor();						// initiate editor;
	this.consoleHostName = 'Peters-MacBook-Pro';	// Computer naam in line
	this.consoleUserName = 'peter$';				// Gebruikersnaam in line
	this.currentDir = '~ ';							// Huidige directory bv cd Desktop

	this.editorOpen = false; 						// if editorOpen == true triggerWrite will trigger another write function;


	this.commands = arguments[0];
	this.commandExecuted = new Event('CommandExecuted');
	this.commandExecutedEl = $('.console');
	this.currentCommand = 0;


	this.console = $('.console');
	this.consoleTextfield = $('.console__textfield');
	this.date = $('.console__date');
	this.host = $('.console__host');
	this.user = $('.console__user');

	this.date.text(this.consoleDate); 
	this.host.text(this.consoleHost); 
	this.user.text(this.consoleUser); 	

	this.currentline = $('.current .line__writable');

	// initiele settings voor type functie
	this.count = 0;
	this.commandStr = '';
	this.command = '';
	
	this.newLine();
	this.Scriptrunner();
}

Terminal.prototype.setDate = function() {
	var d = new Date();
		d = d.toString();
	this.consoleDate = d.replace('GMT+0100 (CET)','') + ' on ttys000';
}

Terminal.prototype.Scriptrunner = function() {
	this.triggerWrite(this.commands[this.currentCommand]);
}
Terminal.prototype.nextCommand = function()
{
	// counter for the command array
	this.currentCommand++;
	// only if ther is another command to execute we will trigger the write function
	if(this.commands[this.currentCommand] !== undefined)
	{
		var thaat = this;
		setTimeout(function(){
			thaat.triggerWrite(thaat.commands[thaat.currentCommand]);
		}, Math.floor((Math.random() * 400) + 120)); // make the timeout random to give it a more realistic feel.
	}
}
Terminal.prototype.newLine = function(){
	// prepare an empty line
	this.emptyLine = '<span class="console__line current">'
							+'<span class="console__host">'+this.consoleHostName+'</span>'
							+'<span class="line__currentdir">:'+this.currentDir+'</span>'
							+'<span class="console__user">'+this.consoleUserName+' </span>'
							+'<span class="line__writable"> </span>'
							+'<span class="line__cursor">&nbsp;</span>'
						+'</span>';

	// grab the current line
	this.currentLine = $('.current');
	// if the currentline exists remove the .current class so it's not the current line anymore
	if(this.currentLine.length)
	{
		this.currentLine.removeClass('current');
	}
	// add new line to terminal
	this.consoleTextfield.append(this.emptyLine);
	// assign the newly added line as the current line
	this.currentLine = $('.current');
	// get the writable part of the currentline wher the write function can write out the commands
	this.currentLine.writable = this.currentLine.find('.line__writable');
	// assign the currentLine cursor to do something with.
	// for example stop blinking while writing .
	this.currentLine.cursor = this.currentLine.find('.line__cursor');
}

Terminal.prototype.writeTerminal = function() {

	// stop cursor from blinking
	this.currentLine.cursor.addClass('writing');
	// slice next letter in string
	this.command = this.commandStr.slice(0, ++this.count);
	if (this.command === this.commandStr) 
	{
		// make cursor blink again
		this.currentLine.cursor.removeClass('writing');
		// execute the command that got written
		this.doAction(this.command);
		return
	}
	// write letter to line
	this.currentLine.writable.text(this.command);
	
	// @ that keep scope hack
	// @ Math function for more realistic feel of type speed.
	var that = this;
	setTimeout(function(){
		that.writeTerminal();
	}, Math.floor((Math.random() * 96) + 48)); //* 96) + 78)); 
}

Terminal.prototype.writeEditor = function() {

	// stop cursor from blinking
	this.currentLine.cursor.addClass('writing');
	// slice next letter in string
	this.command = this.commandStr.slice(0, ++this.count);
	if (this.command === this.commandStr) 
	{
		// make cursor blink again
		this.currentLine.cursor.removeClass('writing');
		// execute the command that got written
		this.doAction(this.command);
		return
	}
	// write letter to line
	this.currentLine.writable.text(this.command);
	
	// @ that keep scope hack
	// @ Math function for more realistic feel of type speed.
	var that = this;
	setTimeout(function(){
		that.write();
	}, Math.floor((Math.random() * 96) + 78)); 
}

Terminal.prototype.triggerWrite = function(input)
{
	this.count = 0;
	this.commandStr = input+' ';
	this.command = '';
	
	// check if editor is open. If so trigger editorWrite function 
	if(this.editorOpen)
	{
		this.writeEditor();
		return;
	}
	// default write in Terminal
	this.writeTerminal();
}

Terminal.prototype.doAction = function(input){
	
	/* Always remove SUDO it's fake anyway */
	if(input.indexOf('sudo') == 0) 
	{
		input = input.replace('sudo ','');
	}

	/* Open NANO command */
	if(input.indexOf('nano') == 0)
	{
		console.log('OPEN DE EDITOR');
		//this.editor.open('nano');
		//this.console.addClass('js-hide');
	}

	/* Open VIM command */
	if(input.indexOf('vim') == 0)
	{
		console.log('OPEN VIM');
		//this.editor.open('vim');
		//this.console.addClass('js-hide');
	}

	/* CD command */
	if(input.indexOf('cd') == 0)
	{
		
		// Count number of slashes in path
		var slashcount = (input.match(/\//g) || []).length;
		// Reduce input string to last directory in path in preperation for currentDir
		for(i = 0;i < slashcount; i++)
		{
			var input = input.substring(input.indexOf("/") + 1);
		}
		
		this.currentDir = input;
	}


	// add new line
	this.newLine();
	// trigger next command
	this.nextCommand();
}

Terminal.prototype.openNano = function(file)
{
	this.write('sudo nano '+file);
}


/**
 * Editor Object
 * 
 */
var Editor = function(){
	this.init.apply(this,arguments);
}

Editor.prototype.init = function()
{

}

Editor.prototype.newLine = function()
{
	
}

Editor.prototype.exists = function()
{
	
}

Editor.prototype.open = function(type, file){
	this.editor.addClass(type);
	this.editor.removeClass('js-hide');
}

/**
 * Filesystem Object
 * Later ooit een filesystem toevoegen waar texten opgeslagen kunnen worden.
 */

var Filesystem = function() {
	this.init.apply(this,arguments);
}

Filesystem.prototype.init = function(){
	this.root = {
			Documents: 	'Documents',
			Desktop: 	'Desktop'
	};
}

Filesystem.prototype.moveUp = function(){

}

Filesystem.prototype.moveDown = function(){
	
}

Filesystem.prototype.store = function(){

}
Filesystem.prototype.storage = function() {
	
}


// var str = "<p>This is my <span style='color:red;'>special string</span> with an <img src='http://placehold.it/150x150'> image !</p>",
//     i = 0,
//     isTag,
//     text;
// type(text);
// function type(text) {
//     text = str.slice(0, ++i);
//     if (text === str) return;
//     $('.current .line__writable').text(text);
//     //var char = text.slice(-1);
//     // if( char === '<' ) isTag = true;
//     // if( char === '>' ) isTag = false;
//     // if (isTag) return type();
//     setTimeout(type, Math.floor((Math.random() * 96) + 78));
// };