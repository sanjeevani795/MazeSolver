var maze = []; //create a 2 dimensional array to store maze data which is matrix of [101,101]
var start = new Object(); // object to store end point of maze
var end = new Object(); // object to store end point of maze

//boolean array to keep track of x and y pairs which are visited in a path.
//if visited[x][y] is True than the node os traversed else not
var visited = [];

var path = new Array(); // Array of objects pathXY and gives Final path between start and end
var pathIndex = 0; // index for array of objects path

  //initialize context for drawing on canvas
  var cnv = document.getElementById('mycanvas');
  var context = cnv.getContext("2d");

  //wall width and height
  var wallWidth = 10;
  var wallHeight = 10;

window.onload = function(){
  //load data for building maze from given URL
  $.ajax({
      url: 'https://s3-us-west-1.amazonaws.com/circleup-challenge/maze.json',
      type: 'GET',
      datatype: 'json',
      success: function(data) {
          maze = data['maze'];
          start = data['start'];
          end = data['end'];
          createMaze(data);
          //.log(start);
      },
      error: function(e) {
        console.log("error : " + e);
      }
  });

  //function which creates maze
  function createMaze(mazeData){
    var ypoint = start['y'] - 1;
    //run through the maze data row by row (horizontally)
    mazeData['maze'].forEach(function(list) {
      //reset xpoint for next horizontal line while ypoint remains same through the horizontal drawing
      var xpoint = start['x'] - 1;
      list.forEach(function(wallFlag){
        if(xpoint == wallWidth && ypoint == wallHeight){
          context.fillStyle = 'green';
          context.fillRect(xpoint , ypoint, wallWidth, wallHeight);
        }
        if(xpoint == (end['x'] * wallWidth) && ypoint == (end['y'] * wallHeight)){
          context.fillStyle = 'red';
          context.fillRect(xpoint , ypoint, wallWidth, wallHeight);
        }
        //if a wall than paint it black else cell remains empty
        if(wallFlag){
          context.fillStyle = 'Black';
          context.fillRect(xpoint , ypoint, wallWidth, wallHeight);
        }
          //xpoint increment for next cell in same row
          xpoint += wallWidth;

      });
      //ypoint increment to start drawing in next row
      ypoint += wallHeight;
    });
  }
}

//Event handler for button Solve, disables button after first click
function solveMaze(){
    if(maze != null && maze.length > 0){
      //initialize all x,y indexes to false indicates none of them are visited
      for (var row=0; row < maze.length; row++){
          visited[row] = [];
          for(var col=0; col < maze[row].length; col++){
            visited[row][col] = false;
          }
      }
      //recursive function to find path between two points given a start point
      pathExists = findPath(start['x'], start['y']);
      if(pathExists){
        console.log(path);
        drawPath(path);
      }
    }
    document.getElementById("solveBtn").disabled = true;
}

//Function to create array of x, y values i.e. path between 2 points, given X and Y value of start point.
function findPath(xVal, yVal){
  if(xVal == end['x'] && yVal == end['y']){
    return true;
  }
  else{
    //if maze node value is true means a wall or the node is visited
    if(maze[xVal][yVal] == true || visited[xVal][yVal]){
        return false;
    }
    else{
      visited[xVal][yVal] = true;

      //If y point is not start then find path towards top direction
      if(yVal != start['y']){
        if(findPath(xVal,yVal - 1)){
          var pathXY = {
              x : xVal,
              y : yVal
          };
          path[pathIndex] = pathXY;
          pathIndex++;
          return true;
        }
      }
      //If y point is not end then find path towards bottom direction
      if(yVal != end['y']){
        if(findPath(xVal,yVal + 1)){
          var pathXY = {
              x : xVal,
              y : yVal
          };
          path[pathIndex] = pathXY;
          pathIndex++;
          return true;
        }
      }
      ////If x point is not end then find path in right direction
      if(xVal != end['x']){
        if(findPath(xVal + 1,yVal)){
          var pathXY = {
              x : xVal,
              y : yVal
          };
          path[pathIndex] = pathXY;
          pathIndex++;
          return true;
        }
      }
      //If y point is not start then find path towards left direction
      if(xVal != start['x']){
        if(findPath(xVal - 1,yVal)){
          var pathXY = {
              x : xVal,
              y : yVal
          };
          path[pathIndex] = pathXY;
          pathIndex++;
          return true;
        }
      }
      return false;
    }
  }
}

//Function which draws path on the canvas element using path array
function drawPath(arrPath){
  //timer count for setTimeout function
  var count = 0;
  for (var arrIndex = arrPath.length - 1; arrIndex >= 0; arrIndex--){
    //the reason behind storing x value of object into Y point and vice versa is
    //that the result array is storing all the x values in Y and y values in X.
    var fromX = arrPath[arrIndex]['y'];
    var fromY = arrPath[arrIndex]['x'];

    context.fillStyle = 'blue';
    fromX *= wallWidth;
    fromY *= wallHeight;
    //IIFE to create setTimeout's own scope for x and y variables otherwise only last X,Y pair from array will be drawn
    (function(x,y){
      setTimeout(function(){
        context.fillRect(x, y, wallWidth, wallHeight);
      }, 100 * count);
    })(fromX, fromY);
    count++;
  }
  //below settimeout is a workaround for end X,Y node to be covered in correct path.
  setTimeout(function(){
    context.fillRect(end['x'] * wallWidth, end['y'] * wallHeight, wallWidth, wallHeight)
  }, 100 * count);
}
