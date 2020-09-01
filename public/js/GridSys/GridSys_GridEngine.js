/* Simple Adventure Grid Engine
 * An alteration of the game engine to use a grid based level building system.
 * Version: 0.1
 * Date Created: 08.23.2020
 * Last Updated: 08.23.2020
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial implementation
*/

var keysDown;
var animate;
var stopAnimating;
var stateMachine;
var canvas;
var gameWindow;
var player;
var levels_xml;
var levels;
var levelNumber;
var context;

// current level info
var currentLevel;
var currentLevelWalls;
var currentLevelDoors;
var currentLevelItems;
var currentLevelRndEncounterEngine;

var movementGrid;

var fi;
var dm;

var directions;

var owHeight = 600;
var owWidth = 820;

// timing
var start;
var lastTick;
var deltaTime = 0;

function load()
{
	canvas = document.createElement('canvas');
    gameWindow = document.createElement('section');
	gameWindow.appendChild(canvas);
	
	directions = ['N', 'E', 'S', 'W'];
	
	document.getElementsByTagName('body')[0].appendChild(gameWindow);

    // TODO: switch this to json parsing
	levels_xml = loadJSON("json/levelData.json");
	levels = levels_xml.getElementsByTagName('level');
    currentLevel = 0;
    
    movementGrid = new Grid(41, 30, 20, 20, 1, 1);
	player = new Player(0, 10, 20, "Dude!!!", movementGrid);
	stateMachine = new StateStack(new OverWorldState(gameWindow, canvas, player));

	/* FOR TESTING PURPOSES */
	animate = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };
	stopAnimating = false;
    keysDown = [];
    start = Date.now();
    lastTick = start;
	animate(step);
}

var step = function(){
	if(!stopAnimating) {
		stateMachine.update();
        stateMachine.render();
        let currentTick = Date.now();
        deltaTime = currentTick - lastTick;
        lastTick = currentTick;
		animate(step);
	}
}

window.addEventListener("keydown", function(event){
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
	delete keysDown[event.keyCode];
});

document.addEventListener("DOMContentLoaded", load, false);