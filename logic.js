let board; 
let score=0;
let rows = 4;
let columns = 4;
// These variables will be used to monitor if the user already won in the value of 2048,4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//declaring variable used for touch input
let startX =0;
let startY=0;
function setGame(){	
board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// This is to create a tile through creating div elements
			let tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();
			let num = board[r][c];
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}
	setTwo();
	setTwo();
}

//this function is to update the appearance of the tile based on its number
function updateTile(tile,num){
	tile.innerText = "";
	tile.classList.value="";

	tile.classList.add("tile");

if(num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

window.onload = function(){
	setGame();
}
function handleSlide(e){
	console.log(e.code);//prints out the key being pressed
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}
	document.getElementById("score").innerText = score;
	setTimeout(() => {
		checkWin();
	}, 1000);
	/*haslost function will check if there is still an empty tile 
	(meaning, there is still a possible move) and it will also check if there are same tile 
	value adjacent(baside/side by side/ adjacent to each other. meaning, there is still a possible move)).*/
	if(hasLost() == true){

		setTimeout(() => {
			alert("Game Over!:( You have lost the game. Game will restart");
			restartGame();
			alert("Click any arrow key to restart");
		}, 100)
		// setTimeout is used to delay the execution of the code inside the arrow function 

	}
}

document.addEventListener("keydown", handleSlide);
//This function removes the zeroes form the row/col
function filterZero(row){
	return row.filter(num => num!=0);
}
//slide function is the one merging the adjacent tiles
function slide(row){
	//[0,2,0,2]
	row = filterZero(row);//[2,2]

	for(let i =0; i<row.length -1; i++){
		if(row[i] == row[i+1]){// checks if a tile is equal to its adjacent tile
			row[i] *= 2; //merge - doubles the first tile to merge
						//[4,2]
			row[i + 1] = 0; // [4,0]
			// this adds the merged tile to the score
			score += row[i];
		}
	}

	row = filterZero(row);

	// Add zeroes on the back after merging
	while(row.length < columns){
		row.push(0); // [4,0,0,0]
	}
 
	return row;// submits the updated row/column
}
function slideLeft(){
	for(let r = 0; r < rows; r++){
        let row = board[r];
        //line for animation
        let originalRow = row.slice();
        row = slide(row);// we used the slide function, so that the slide function will merge the adjacent tiles
        board[r] = row;
        //After merging the position and the value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            //line for animation
            if(originalRow[c] !== num && num !== 0){ // if the original tile is not equal to the current tile, let's apply the animation
            	tile.style.animation = "slide-from-right 0.3s" // applies animation
            	//removes the animation class after the animation is complete
            	setTimeout(() =>{
            		tile.style.animation = ""
            	},300);
            }
            updateTile(tile,num);
        }
    }
}
function slideRight(){
	for(let r = 0; r < rows; r++){
        let row = board[r];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);// we used the slide function, so that the slide function will merge the adjacent tiles
        row.reverse();
        board[r] = row;
        //After merging the position and the value of the tiles might change, thus it follows that the id, number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            if(originalRow[c] !== num && num !== 0){ // if the original tile is not equal to the current tile, let's apply the animation
           	tile.style.animation = "slide-from-left 0.3s" // applies animation
           	//removes the animation class after the animation is complete
            setTimeout(() =>{
            tile.style.animation = ""
            },300);
            }

        }
    }
}
function slideUp() {
	for(let c=0; c <columns; c++) {
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		// Line for animation
		let originalCol = col.slice();

		col = slide(col);

		let changedIndeces = []
		for(let c = 0; c < columns; c++){
			if(originalCol[c] !== columns[c]) {
				changedIndeces.push(c)
			}
		}
		for(let r = 0; r < rows; r++){
		board[r][c] = col[r];
	    let tile = document.getElementById(r.toString() + "-" + c.toString());
	    let num = board[r][c];

	    // Line for animation
	    if(changedIndeces.includes(r) && num !==0) {
	    	tile.style.animation = "slide-from-bottom 0.3s"
	    	setTimeout(() => {
	    		tile.style.animation = ""
	    	}, 300)
	    }
	    updateTile(tile, num)
	}

	}
}
function slideDown(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		let originalCol = col.slice();
		col.reverse();
		col = slide(col);
		col.reverse();

		let changedIndeces = []
		for(let c = 0; c < columns; c++){
			if(originalCol[c] !== columns[c]) {
				changedIndeces.push(c)
			}
		}
		//After merging, the position and the valur of tiles night change, thus it follows 
		 for(let r = 0; r < rows; r++){
		 	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
           	if(changedIndeces.includes(r) && num !==0) {
	    	tile.style.animation = "slide-from-top 0.3s"
	    	setTimeout(() => {
	    		tile.style.animation = ""
	    	}, 300)
	    	}
            updateTile(tile, num);
        }
    }
}

function hasEmptyTile(){
	for(let r=0; r<rows; r++){
		for(let c = 0 ; c<columns; c++){
			if(board[r][c]==0){
				return true;
			}
		}
	}
	return false;
}
function setTwo(){
	if(hasEmptyTile() == false){
		return;
	}
	//these next codes is for generating random 2
	let found = false;

	while(found == false){
		let r = Math.floor(Math.random()* rows);
		let c = Math.floor(Math.random()* columns);

		if (board[r][c] == 0){
			//Generate new tile
			board[r][c]=2; 
			let tile = document.getElementById(r.toString()+ "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}
//checkwin function checks if we already have 2048, 4096, or 8192 in our tiles, and to congratulate us in this acoomplishment.
function checkWin(){
	for(let r=0; r<rows ; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist ==false){
				alert("You win! You got the 2048");
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!");
				is4096Exist = true;
			}
			else if(board[r][c]== 8192 && is8192Exist == false){
				alert("Victory! you have reached 8192! You are incredibly awesome x 8192!");
				is8192Exist = true;
			}
		}
	}
}
function hasLost(){
	for(let r=0; r<rows ; r++){
		for(let c=0; c<columns; c++){
			// this code will check if there is a tle that equal to zero(meaning, empty tile)
			if(board[r][c]===0){
				return false;
			}
			const currentTile = board [r][c];
			// this code will check if there are two adjacent tiles
			if(
				//check current tile if it has possible merge to its upper tile or
				r>0 && board[r-1][c] === currentTile ||
				//check current tile if it has possible merge to its lower tile
				r<rows-1 && board[r+1][c] === currentTile||
				//checks current tile if it has possible merge to the left or
				c>0 && board[r][c-1]=== currentTile||
				//checks current tile if it has possible merge to the right
				c<columns-1 && board[r][c+1]=== currentTile
				){
				//if we found adjacent tile with the same value as the current tile, false, the use has not lost
				return false;
			}
		}
	}
	//No empty tile and no possible moves left( meaning, true, the user already lost)
	return true;
}
function restartGame(){
	for(let r=0; r<rows ; r++){
		for(let c=0; c<columns; c++){
			board[r][c] = 0;
		}
	}
	score = 0;
	setTwo();
}
// this code will listen when we touch the screen and assigns the x and y coordinates of that touch or event
// inputs the x coordinate value to the startX and y coordinate value to startY
document.addEventListener('touchstart', (e)=>{
	startX= e.touches[0].clientX;
	startY= e.touches[0].clientY;
})

document.addEventListener('touchmove',(e)=>{
	if(!e.target.className.includes("tile")){
		return
	}
	//To disable scrolling feature
	e.preventDefault();
}, {passive: false});

 // use passive property to makesure that the preventDefault() will work.

document.addEventListener('touchend', (e)=>{
	if(!e.target.className.includes("tile")){
		return
	}
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	if (Math.abs(diffX) > Math.abs(diffY)) {
	    // Horizontal swipe
	    if (diffX > 0) {
	        slideLeft(); // Call a function for sliding left
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideRight(); // Call a function for sliding right
	        setTwo(); // Call a function named "setTwo"
	    }
	}else {
	    // Vertical swipe
	    if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}
		document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart");
	    }, 100); 
	}
})

//Variables - are storage of values
//function are callable programmed tasks
// This is to create a tile through creating div elements
// Each tile will have an id based on its row position and column position. 
            // Imagine students in a room who are given an id, but their id number is based on their seat row and column position.
// Get the number of a tile from a backend board
// Use the number to update the tile's appearance through updateTile() function
// Add the created tile with id to the frontend game board container.