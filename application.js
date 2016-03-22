var canvas;
var context;
var values = [];
var grid = [];
var startingIterations = 128;
var ratio;
var zoomLevel = 0;
var startingWidth = 5;

$(document).ready(function(){
    canvas = document.getElementById("c");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createGrid([0,0], startingWidth);
    colorGrid();

    $(canvas).on('click',processClick);
});

var processClick = function(e){
    zoomLevel++;
    var x = e.offsetX;
    var y = e.offsetY;
    var oldvalues = values;
    var currWidth = startingWidth/Math.pow(2, zoomLevel);
    createGrid([values[x][y][0], values[x][y][1]], currWidth);
    // for(var i = 0; i < values.length; i++){
    //     for(var j = 0; j < values[0].length; j++){
    //         if(oldvalues[i][j] !== values[i][j]){
    //             console.log('here')
    //         }
    //     }
    // }
    colorGrid();
}

var createGrid = function(center, width){
    var height = canvas.height * width / canvas.width;
    topleft = [center[0]-width/2, center[1]+height/2];
    values=[];
    grid = [];
    var incr = width/canvas.width;
    for(var i = 0; i < canvas.width; i++){
        var valueRow = []
        var gridRow = []
        for(var j = 0; j < canvas.height; j++){
            var x = topleft[0] + i*incr;
            var y = topleft[1] - j*incr;
            valueRow.push([x,y]);
            gridRow.push(-1);
        }
        values.push(valueRow);
        grid.push(gridRow);
    }
}

var colorGrid = function(){
    var max = 0;
    for(var i = 0; i < values.length; i++){
        for(var j = 0; j < values[0].length; j++){
            var iter = getIter(values[i][j]);
            max = Math.max(max, iter);
            grid[i][j] = iter;
        }
    }
    console.log(max);
    ratio = 256/max;
    for(var i = 0; i < values.length; i++){
        for(var j = 0; j < values[0].length; j++){
            colorPixel(i, j);
            // if(grid[i][j] > 1 && grid[i][j] < 200){
            //     console.log(grid[i][j]);
            // }
        }
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
    if(Math.abs(value[0]) < 1 && Math.abs(value[1]) < 1){
        // console.log('here')
        var y = 0;
    }
    var val = value;
    var constant = value;
    var count = 0;
    var iterations = startingIterations * Math.pow(2, zoomLevel-1);
    while(count < iterations && absVal(val)<=4){
        val = mandelbrotFormula(val, constant);
        count++;
    }
    if(count == iterations){
        count = -1;
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