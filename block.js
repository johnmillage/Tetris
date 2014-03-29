function Block (color, row, col, grid, grad)
{
	this.Col = col;
	this.Row = row;
	this.Grid = grid;
	this.Color = color;
	this.Gradient = grad;
}

Block.prototype.Draw = function() 
{
    var ctx = this.Grid.Canvas.getContext("2d");
    var cell = this.Grid.GetCell(this.Row, this.Col);
    if (this.Gradient == true) {
        var hW = cell.Width / 2;
        var hH = cell.Height / 2;
        var grd = ctx.createRadialGradient(cell.Left + hW, cell.Top + hH, (cell.Height / 8), cell.Left + hW, cell.Top + hH, hH * 2);
        grd.addColorStop(0, this.Color);
        grd.addColorStop(1, "Black");
        // Fill with gradient
        ctx.fillStyle = grd;
    }
    else {
        ctx.fillStyle = this.Color;
    }
	
	ctx.fillRect(cell.Left + 2, cell.Top + 2, cell.Width - 4, cell.Height - 4);
	ctx.strokeRect(cell.Left + 1, cell.Top + 1, cell.Width - 2, cell.Height - 2);
};

Block.prototype.Clear = function()
{
	var ctx = this.Grid.Canvas.getContext("2d");
	var cell = this.Grid.GetCell(this.Row, this.Col);
	ctx.clearRect(cell.Left - 1, cell.Top -1, cell.Width + 2, cell.Height + 2);
};

BombBlock.prototype = new Block();
BombBlock.prototype.constructor = BombBlock;

function BombBlock(color, row, col, grid, grad) {
    Block.prototype.constructor.call(this, color, row, col, grid, grad);
};

BombBlock.prototype.Draw = function () 
{
    var ctx = this.Grid.Canvas.getContext("2d");
    var cell = this.Grid.GetCell(this.Row, this.Col);
    this.Color = "#000000";
    var hW = cell.Width / 2;
    var hH = cell.Height / 2;
    if (this.Gradient == true) {
        var grd = ctx.createRadialGradient(cell.Left + hW, cell.Top + (cell.Height * .1) + hH,
        (cell.Height / 7), cell.Left + hW, cell.Top + (cell.Height * .15) + hH, hH);
        grd.addColorStop(0, "Black");
        grd.addColorStop(1, "White");

        // Fill with gradient
        ctx.fillStyle = grd;
    }
    else {

        ctx.fillStyle = "Black";
    }

    
    
    ctx.strokeStyle = "White";
    ctx.beginPath();
    ctx.arc(cell.Left + hW, (cell.Top + (cell.Height * .15)) + hH, ((cell.Height * .6) / 2), 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cell.Left + hW, (cell.Top + (cell.Height * .15)) + hH + 1, ((cell.Height * .6) / 2) + 1, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.lineWidth = (cell.Width / 10);//10 percent of width
    ctx.beginPath();
    ctx.moveTo(cell.Left + hW, (cell.Top + (cell.Height * .35)));
    ctx.lineTo(cell.Left + hW, cell.Top + (cell.Height * .1));
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "#FF0000";
    ctx.moveTo(cell.Left + hW, cell.Top + (cell.Height * .1));
    ctx.lineTo(cell.Left + hW, cell.Top + 1);
    ctx.stroke();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
};



