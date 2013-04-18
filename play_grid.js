function play_cell(grid, row, col)
{
    this.Grid = grid;
    this.Row = row;
    this.Col = col;
}

play_cell.prototype.SetupBounds = function()
{
    this.Width = (this.Grid.Canvas.width / this.Grid.Width);
    this.Height = (this.Grid.Canvas.height / this.Grid.Height);
    this.Left = this.Width * this.Col;
    this.Top =  this.Height * this.Row;
};

function play_grid(canvas, height, width)
{
	this.Canvas = canvas;
	this.Grid = new Array();
	if (width == undefined) {
	    this.Width = 10;
	}
	else {
	    this.Width = width;
	}

	if (height == undefined) {
	    this.Height = 20;
	}
	else {
	    this.Height = height;
	}
	this.SetupCells();
}

play_grid.prototype.SetupCells = function()
{
    for(i = 0; i < this.Height; i++)
    {
        this.Grid[i] = new Array();
        for(j = 0; j < this.Width; j++)
        {
            this.Grid[i][j] = new play_cell(this, i, j);
            this.Grid[i][j].SetupBounds();
        }
    }
};

play_grid.prototype.ClearRow = function(row)
{
    if(row >= 0 && row < this.Height)
    {
        var ctx = this.Canvas.getContext("2d");
        
        ctx.clearRect(this.Grid[row][0].Left - 1, this.Grid[row][0].Top - 1, 
                this.Grid[row][this.Width - 1].Left + this.Grid[row][this.Width - 1].Width  + 2,
                this.Grid[row][this.Width - 1].Height + 2);
    }
};

play_grid.prototype.FillRow = function (row, color, grad) {
    if (row >= 0 && row < this.Height) {
        var ctx = this.Canvas.getContext("2d");
        var rH = this.Grid[row][this.Width - 1].Height;
        var rW = this.Grid[row][this.Width - 1].Left + this.Grid[row][this.Width - 1].Width;

        if (grad == true) {
           
            var lMid = this.Grid[row][0].Left + ( rW / 2);
            var tMid = this.Grid[row][0].Top + (rH / 2);
            var grd = ctx.createRadialGradient(lMid, tMid , (rW / 8), lMid, tMid, (rW / 1.75) );
            grd.addColorStop(0, color);
            grd.addColorStop(1, "Black");

            // Fill with gradient
            ctx.fillStyle = grd;
        }
        else {
            ctx.fillStyle = color;
        }
        
        ctx.fillRect(this.Grid[row][0].Left , this.Grid[row][0].Top , rW + 1, rH + 1);
    }
}

play_grid.prototype.ClearGrid = function () {
    var ctx = this.Canvas.getContext("2d");
    ctx.clearRect(this.Grid[0][0].Left, this.Grid[0][0].Top,
        this.Grid[this.Height - 1][this.Width - 1].Left + this.Grid[this.Height - 1][this.Width - 1].Width,
        this.Grid[this.Height - 1][this.Width - 1].Top + this.Grid[this.Height - 1][this.Width - 1].Height );
}

play_grid.prototype.FillBlock = function (row, col, range, color, grad) {
    if (row >= 0 && row < this.Height) {
        var ctx = this.Canvas.getContext("2d");
        var topLeftRow = row;
        var topLeftCol = col;
        var bottomRightRow = row;
        var bottomRightCol = col;
        if (row > range) {
            topLeftRow = row - range;
        }
        else {
            topLeftRow = 0;
        }
        if (col > range) {
            topLeftCol = col - range;
        }
        else {
            topLeftCol = 0;
        }
        if (row + range < this.Height) {
            bottomRightRow = row + range;
        }
        else {
            bottomRightRow = this.Height - 1;
        }
        if (col + range < this.Width) {
            bottomRightCol = col + range;
        }
        else {
            bottomRightCol = this.Width - 1;
        }

        var rH = (this.Grid[bottomRightRow][bottomRightCol].Top + this.Grid[bottomRightRow][bottomRightCol].Height) - this.Grid[topLeftRow][topLeftCol].Top;
        var rW = (this.Grid[bottomRightRow][bottomRightCol].Left + this.Grid[bottomRightRow][bottomRightCol].Width) - this.Grid[topLeftRow][topLeftCol].Left;

        if (grad == true) {   
            var m = Math.max(rH, rW);
            var lMid = this.Grid[row][col].Left + (this.Grid[row][col].Width / 2);
            var tMid = this.Grid[row][col].Top + (this.Grid[row][col].Height / 2);
            var grd = ctx.createRadialGradient(lMid, tMid, (this.Grid[row][col].Width / 2), lMid, tMid, (m / 1.75));
            grd.addColorStop(0, color);
            grd.addColorStop(.77, "Orange");
            grd.addColorStop(.90, "Black");

            // Fill with gradient
            ctx.fillStyle = grd;
        }
        else {
            ctx.fillStyle = color;
        }

        ctx.fillRect(this.Grid[topLeftRow][topLeftCol].Left, this.Grid[topLeftRow][topLeftCol].Top, rW, rH);
    }
}

play_grid.prototype.GetCell = function(row, col)
{
    if(row < this.Height && col < this.Width)
    {
        return this.Grid[row][col];
    }
};