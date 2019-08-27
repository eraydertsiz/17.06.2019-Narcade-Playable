var debugEnabled = true;

var config = {
    type: Phaser.AUTO,
	scale: {
		scale: 'SHOW_ALL',
		//mode: Phaser.Scale.FIT,
		//autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 270,
		height: 480,
		update: update
	},
    //, resolution: window.devicePixelRatio,
	orientation: 'PORTRAIT',
    scene: {
        preload: preload,
        create: create
	}
    //, pixelArt: true
    /*
    ,physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 500
            }
        }
    }
    */
};

var game = new Phaser.Game(config);
var gameScene;
var gameState = 'loading';


var gameWidth = 270;
var gameHeight = 480;

var ballFrameList = [];
var ballFrameTexSize = 40;
var ballFrameRadius = ballFrameTexSize / 2;

var rowCount = 13;
var colCount = 13;

var isBrushOn = false;
var brushColorIndex = 0;

var brushColorList = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xffff00,
    0xff00ff
];

var ballImages = [
	'red',
	'green',
	'blue',
	'yellow',
	'purple'
]

var balls = [];

var saveButton;

function preload(){
    
    gameScene = this;
	
    this.load.image('ballframe','./assets/sprites/ball40px.png');
    this.load.image('rect64','./assets/sprites/rect64.png');
	
	this.load.image('red','./assets/sprites/red.png');
	this.load.image('green','./assets/sprites/green.png');
	this.load.image('yellow','./assets/sprites/yellow.png');
	this.load.image('purple','./assets/sprites/purple.png');
	this.load.image('blue','./assets/sprites/blue.png');
    
}

function create(){
    
    createBallFrames();
    createColorPalette();
    registerEvents();
    calculateHexagonalCoordinates();
	
	console.log(ballFrameList[0][0]);
	
	console.log(gameScene.textures.get('red').getSourceImage());
    
}

function update(){
    
    
}

function registerEvents(){
    
    gameScene.input.enabled = true;
    gameScene.input.on('pointerdown', pointerdown);
    gameScene.input.on('pointerup', pointerup);
    saveKey = gameScene.input.keyboard.addKey('S');
    
}

function pointerdown(){
    
    isBrushOn = true;
    
}

function pointerup(){
    
    isBrushOn = false;
    
}

function exportLevel(){
    
    var hexaMaxX = -9999, hexaMaxY = -99999, hexaMaxZ = -9999;
    var hexaMinX = 9999, hexaMinY = 99999, hexaMinZ = 99999;
    
    for(var i = 0; i < ballFrameList.length; i++){
        for(var j = 0; j < ballFrameList[i].length; j++){
            if(ballFrameList[i][j].hexaCoordinates.x > hexaMaxX){
                hexaMaxX = ballFrameList[i][j].hexaCoordinates.x;
            }
            if(ballFrameList[i][j].hexaCoordinates.x < hexaMinX){
                hexaMinX = ballFrameList[i][j].hexaCoordinates.x;
            }
            if(ballFrameList[i][j].hexaCoordinates.y > hexaMaxY){
                hexaMaxY = ballFrameList[i][j].hexaCoordinates.y;
            }
            if(ballFrameList[i][j].hexaCoordinates.y < hexaMinY){
                hexaMinY = ballFrameList[i][j].hexaCoordinates.y;
            }
            if(ballFrameList[i][j].hexaCoordinates.z > hexaMaxZ){
                hexaMaxZ = ballFrameList[i][j].hexaCoordinates.z;
            }
            if(ballFrameList[i][j].hexaCoordinates.x < hexaMinZ){
                hexaMinZ = ballFrameList[i][j].hexaCoordinates.z;
            }
        }
    }
    
    for(var i = 0; i < ballFrameList.length; i++){
        for(var j = 0; j < ballFrameList[i].length; j++){
            if(hexaMinX < 0){
                ballFrameList[i][j].hexaCoordinates.x -= hexaMinX;
            }
            if(hexaMinY < 0){
                ballFrameList[i][j].hexaCoordinates.y -= hexaMinY;
            }
            if(hexaMinZ < 0){
                ballFrameList[i][j].hexaCoordinates.z -= hexaMinZ;
            }
        }
    }
    
    if(hexaMinX < 0){
        hexaMaxX -= hexaMinX;
    }
    if(hexaMinY < 0){
        hexaMaxY -= hexaMinY;
    }
    if(hexaMinZ < 0){
        hexaMaxZ -= hexaMinZ;
    }
    
    var levelObj = [];
    
    for(var x = 0; x < hexaMaxX + 1; x++){
        levelObj[x] = [];
    }
    
    for(var x = 0; x < hexaMaxX + 1; x++){
        for(var y = 0; y < hexaMaxY + 1; y++){
            levelObj[x][y] = [];
        }
    }
    
    for(var x = 0; x < hexaMaxX + 1; x++){
        for(var y = 0; y < hexaMaxY + 1; y++){
            for(var z = 0; z <hexaMaxZ + 1; z++){
                levelObj[x][y][z] = {};
            }
        }
    }
    
    for(var row = 0; row < ballFrameList.length; row++){
        for(var col = 0; col < ballFrameList[row].length; col++){
            var currentObj = ballFrameList[row][col];
            if(currentObj === undefined || currentObj === null)
                continue;
            levelObj[currentObj.hexaCoordinates.x][currentObj.hexaCoordinates.y][currentObj.hexaCoordinates.z].colIndex = currentObj.colIndex;
        }
    }
    
    //FIND EDGES
    var findEdgesStartBallCubical = {x: 0, y: 0, z: 0};
    var findEdgesStartBallAxial = {x: 0, y: 0};
    var findEdgesLastDirection = 3;
    
    var total = 0;
    
    for(var i = 0; i < rowCount * colCount; i++){/*
        if(ballFrameList[i/colCount][i%colCount]){
            
        }*/
        if(ballFrameList[parseInt(i/colCount)] !== undefined && ballFrameList[parseInt(i/colCount)][parseInt(i%colCount)] !== undefined){
            if(typeof(ballFrameList[parseInt(i/colCount)].colIndex) === 'number'){
                console.log(ballFrameList[parseInt(i/colCount)][parseInt(i%colCount)]);
                total++;
            }
        }
    }
    
    console.log("total: " + total);
    
    var lvlStr = "";
    lvlStr += "{";
    
    lvlStr += "\"levelType\":" + "\"vertical\",\n";
    lvlStr += "\"ballsArray\":" + JSON.stringify(levelObj) + ",\n";
    
    lvlStr += "\"ballColors\": " + JSON.stringify(brushColorList) + ",\n";
    
    lvlStr += "\"colCount\":" + colCount + ",\n";
    
    lvlStr += "\"firstBallCoord\": { \"x\": " + ballFrameList[0][0].hexaCoordinates.x + ", \"y\": " + ballFrameList[0][0].hexaCoordinates.y + ", \"z\": " + ballFrameList[0][0].hexaCoordinates.z + "}";
    
    lvlStr += "}";
     
    
    
    download(lvlStr, "level1.json", "text/plain");
    
}

function calculateHexagonalCoordinates(){
    
    for(var row = 0; row < rowCount; row++){
        for(var col = 0; col < colCount; col++){
            if(ballFrameList[row][col] !== undefined && ballFrameList[row][col] !== null)
                ballFrameList[row][col].hexaCoordinates = axialToCube(col, row); 
        }
    }
    
}

function axialToCube(x, y){
    
    var cubeX = x - (y- (y % 2)) / 2;
    var cubeZ = y;
    var cubeY = -cubeX -cubeZ;
    
    return { x: cubeX, z: cubeZ, y: cubeY};
    
}

function createColorPalette(){
    
    var colorPaletteX = 15;
    var colorPaletteY = gameHeight - 15;
    var colorPaletteStepX = 30;
    
    for(var i = 0; i < brushColorList.length; i++){
        
        gameScene.add.image(colorPaletteX, colorPaletteY, 'rect64').setTint(brushColorList[i]).setScale(0.375, 0.375).setInteractive().on('pointerdown', changeBrushDelegate(i));
        
        colorPaletteX += colorPaletteStepX;
        
    }
    
    saveButton = gameScene.add.image(gameWidth - 15, gameHeight - 15, 'rect64').setScale(0.375,0.375).setInteractive().on('pointerdown', exportLevel);
    
}

function createBallFrames(){
    
    var initialX = gameWidth / colCount / 2;
    var initialY = initialX;
    
    var offsetX = gameWidth / colCount;
    var offsetY = offsetX * Math.sqrt(3) / 2;
    
    var ballScale = gameWidth / colCount / ballFrameTexSize;
    
    for(var row = 0; row < rowCount; row++){
        ballFrameList[row] = [];
        for(var col = 0; col < colCount; col++){
            if(row % 2 == 0){
                ballFrameList[row][col] = gameScene.add.image(initialX + offsetX * col, initialY + offsetY * row, 'ballframe').setTint(0x555555).setScale(ballScale).setInteractive().on('pointermove', paintDelegate(row, col)).on('pointerdown', debugGameObjectDelegate(row, col));
            }
            else{
                if(col == colCount - 1)
                    continue;
                ballFrameList[row][col] = gameScene.add.image(offsetX * (col + 1), initialY + offsetY * row, 'ballframe').setTint(0x555555).setScale(ballScale).setInteractive().on('pointermove', paintDelegate(row, col)).on('pointerdown', debugGameObjectDelegate(row, col));
            }
        }
    }
    
}

function debugGameObjectDelegate(rowNum, colNum){
    return function(){
        debugGameObject(rowNum, colNum);
    }
}

function debugGameObject(rowNum, colNum){
    console.log(ballFrameList[rowNum][colNum].hexaCoordinates);
}

function changeBrushDelegate(selectedColorIndex){
    return function(){
        changeBrush(selectedColorIndex);
    }
}

function changeBrush(selectedColorIndexArg){
    brushColorIndex = selectedColorIndexArg;
}

function paintDelegate(rowNum, colNum){
    
    return function(){
        paint(rowNum, colNum);
    }
    
}

function paint(rowNum, colNum){
    
    if(gameScene.input.activePointer.isDown){
        ballFrameList[rowNum][colNum].setTint(0xffffff);
		
		//let oldSize = ballFrameList[rowNum][colNum].width;
		
		let oldTextureSize = gameScene.textures.get(ballFrameList[rowNum][colNum].texture.key).getSourceImage().width;
		ballFrameList[rowNum][colNum].setTexture(ballImages[brushColorIndex]);
		let newTextureSize = gameScene.textures.get(ballFrameList[rowNum][colNum].texture.key).getSourceImage().width;
		ballFrameList[rowNum][colNum].setScale(ballFrameList[rowNum][colNum].scaleX * oldTextureSize / newTextureSize);
		
		//ballFrameList[rowNum][colNum].setSize(oldSize, oldSize);
		
        ballFrameList[rowNum][colNum].colIndex = brushColorIndex;
		
		
		
    }
    
}

function findEdges(){
    
    
    
}

function getNeighborIndex(ballCoord, dir){
    return addVectors3(ballCoord, getDirectionVector(dir));
}

function addVectors3(vector1, vector2){
    return {x: vector1.x + vector2.x , y: vector1.y + vector2.y, z: vector1.z + vector2.z};
}

function getDirectionVector(dir){
    
    switch(dir) {
    case 0:
        return {x: 1, y: 1, z: 0};
        break;
    case 1:
        return {x: 0, y: -1, z: 1};
        break;
    case 2:
        return {x: -1, y: 0, z: 1};
        break;
    case 3:
        return {x: -1, y: 1, z: 0};
        break;
    case 4:
        return {x: 0, y: 1, z: -1};
        break;
    case 5:
        return {x: 1, y: 0, z: -1};
        break;
    }
    
}
