var canvas;
var context;
var values = [];
var grid = [];
var height;
var width;
var iterations = 256;
var ratio;

$(document).ready(function(){
    canvas = document.getElementById("c");
    context = canvas.getContext("2d");
    height = window.innerHeight;
    width = window.innerWidth;
    canvas.width = width;
    canvas.height = height;

    createGrid();

    var max = 0;
    for(var i = 0; i < width; i++){
        for(var j = 0; j < height; j++){
            var iter = getIter(values[i][j]);
            max = Math.max(max, iter);
            grid[i][j] = iter;
        }
    }
    console.log(grid);
    ratio = 256/max;
    for(var i = 0; i < width; i++){
        for(var j = 0; j < height; j++){
            colorPixel(i, j);
        }
    }
});

var createGrid = function(){
    var mid_x = Math.floor(width/2);
    var mid_y = Math.floor(height/2);
    var min = Math.min(width, height);
    var quar = Math.floor(min/4);
    for(var i = 0; i < width; i++){
        var valueRow = []
        var gridRow = []
        for(var j = 0; j < height; j++){
            valueRow.push([(i-mid_x)/quar, (j-mid_y)/quar]);
            gridRow.push(-1);
        }
        values.push(valueRow);
        grid.push(gridRow);
    }
}

var colorPixel = function(i, j){
    var v = grid[i][j];
    if(v < 0){
        v = 0;
    }
    v = Math.floor(v * ratio);
    var fill = "rgb("+v+","+v+","+v+")"
    context.fillStyle = fill;
    context.fillRect(i, j, 1, 1);
}

var getIter = function(value){
    var val = value;
    var constant = value;
    var count = 0;
    while(count < iterations && absVal(val)<=4){
        val = mandelbrotFormula(val, constant);
        count++;
    }
    return count;
}

var mandelbrotFormula = function(val, constant){
    var r = val[0];
    var c = val[1];
    var new_r = (r*r-c*c) + constant[0];
    var new_c = (2*r*c) + constant[1];
    return [new_r, new_c];
}

var absVal = function(value){
    var x = value[0];
    var y = value[1];
    return x*x + y*y;
}

// var iterate = function(){
//     for(var i = 0; i < width; i++){
//         for(var j = 0; j < height; j++){
//             if(grid[i][j] == -1){
//                 if(absVal(values[i][j]) > 4){
//                     grid[i][j] = iterations;
//                 } else{
//                     values[i][j] = mandelbrotFormula(i, j);
//                 }
//             }
//         }
//     }
//     iterations++;
// }