function Piece(color, row, col, grid, grad)
{
	this.Color = color;
	this.Row = row;
	this.Col = col;
	this.Grid = grid;
	this.Gradient = grad;
	this.Stopped = false;
	this.Blocks = new Array();
}

Piece.prototype.HasBlock = function (row, col) {
    for (i = 0; i < this.Blocks.length; i++) {
        if (this.Blocks[i].Row == row && this.Blocks[i].Col == col) {
            return true;
        }
    }
    return false;
}

Piece.prototype.Top = function()
{
    var top = 50;
    this.SetupBlocks();
    for(i = 0; i < this.Blocks.length; i++)
    {
        if(this.Blocks[i].Row < top)
        {
            top = this.Blocks[i].Row;
        }
    }
    return top;
};

Piece.prototype.Left = function()
{
    var left = 50;
    this.SetupBlocks();
    for(i = 0; i < this.Blocks.length; i++)
    {
        if(this.Blocks[i].Col < left)
        {
            left = this.Blocks[i].Col;
        }
    }
    return left;
};

Piece.prototype.Bottom = function()
{
    var bottom = 0;
    this.SetupBlocks();
    for(i = 0; i < this.Blocks.length; i++)
    {
        if(this.Blocks[i].Row > bottom)
        {
            bottom = this.Blocks[i].Row;
        }
    }
    return bottom;
};

Piece.prototype.Right = function()
{
    var right = 0;
    this.SetupBlocks();
    for(i = 0; i < this.Blocks.length; i++)
    {
        if(this.Blocks[i].Col > right)
        {
            right = this.Blocks[i].Col;
        }
    }
    return right;
};


Piece.prototype.Draw = function()
{
    this.SetupBlocks();
	for(i = 0; i < this.Blocks.length; i++)
	{
		this.Blocks[i].Draw();
	}
};

Piece.prototype.Clear = function()
{
    this.SetupBlocks();
	for(i = 0; i < this.Blocks.length; i++)
	{
		this.Blocks[i].Clear();
	}
};

Piece.prototype.MoveRow = function(newRow)
{
    this.SetupBlocks();
    var dif = newRow - this.Row;
	this.Row = newRow;
	
	for(i = 0; i < this.Blocks.length; i++)
    {
        this.Blocks[i].Row += dif;
    }
};

Piece.prototype.MoveCol = function(newCol)
{
    this.SetupBlocks();
    var dif = newCol - this.Col;
    this.Col = newCol;
    
    for(i = 0; i < this.Blocks.length; i++)
    {
        this.Blocks[i].Col += dif;
    }
};

Piece.prototype.ChangColor = function(clr)
{
    this.SetupBlocks();
    this.Color = clr;
    for(i = 0; i < this.Blocks.length; i++)
    {
        this.Blocks[i].Color = clr;
    }
};

Piece.prototype.SetupBlocks = function()
{
	this.Setup = true;
};

Piece.prototype.Rotate = function()
{
    
};

Piece.prototype.StopPiece = function () {
    this.Stopped = true;
};

SquarePiece.prototype = new Piece();
SquarePiece.prototype.constructor = SquarePiece;

SquarePiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row, this.Col + 1, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 1, this.Col + 1, this.Grid, this.Gradient);
    }
};

function SquarePiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
};



LinePiece.prototype = new Piece();
LinePiece.prototype.constructor = LinePiece;

function LinePiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.SetupBlocks();
    this.Position = 1;
};

LinePiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 2, this.Col, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 3, this.Col, this.Grid, this.Gradient);
        
    }
};

LinePiece.prototype.Rotate = function()
{
    
    
    if(this.Position == 1)
    {
        this.Blocks[0].Row = this.Row  + 1;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col - 2;
        this.Blocks[1].Col = this.Col - 1;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 2;
    }
    else
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 2;
        this.Blocks[3].Row = this.Row + 3;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col;
        
        this.Position = 1;
    }
};

SPiece.prototype = new Piece();
SPiece.prototype.constructor = SPiece;

function SPiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.Position = 1;
};

SPiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row, this.Col + 1, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 1, this.Col - 1, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Position = 1;
    }
};

SPiece.prototype.Rotate = function()
{
    if(this.Position == 1)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col + 1;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 2;
    }
    else
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col + 1;
        this.Blocks[2].Col = this.Col - 1;
        this.Blocks[3].Col = this.Col;
        
        this.Position = 1;
    }
};

ZPiece.prototype = new Piece();
ZPiece.prototype.constructor = SPiece;

function ZPiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.Position = 1;
};

ZPiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col - 1, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 1, this.Col + 1, this.Grid, this.Gradient);
        this.Position = 1;
    }
};

ZPiece.prototype.Rotate = function()
{
    if(this.Position == 1)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col + 1;
        this.Blocks[1].Col = this.Col + 1;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col;
        
        this.Position = 2;
    }
    else
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col - 1;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 1;
    }
};

TriPiece.prototype = new Piece();
TriPiece.prototype.constructor = TriPiece;

function TriPiece(color, row, col, grid,grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.Position = 1;
};

TriPiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row + 1, this.Col - 1, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 1, this.Col + 1, this.Grid, this.Gradient);
        this.Position = 1;
    }
};

TriPiece.prototype.Rotate = function()
{
    if(this.Position == 1)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col + 1;
        this.Blocks[3].Col = this.Col;
        
        this.Position = 2;
    }
    else if( this.Position == 2)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row;
        
        this.Blocks[0].Col = this.Col - 1;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 3;
    }
    else if(this.Position == 3)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col - 1;
        this.Blocks[3].Col = this.Col;
        this.Position = 4;
    }
    else
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col - 1;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 1;
    }
};

LPiece.prototype = new Piece();
LPiece.prototype.constructor = LPiece;

function LPiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.Position = 1;
};

LPiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 2, this.Col, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 2, this.Col + 1, this.Grid, this.Gradient);
        this.Position = 1;
    }
};

LPiece.prototype.Rotate = function()
{
    if(this.Position == 1)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col - 1;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col + 1;
        this.Blocks[3].Col = this.Col - 1;
        
        this.Position = 2;
    }
    else if( this.Position == 2)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col - 1;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col;
        
        this.Position = 3;
    }
    else if(this.Position == 3)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col + 1;
        this.Blocks[1].Col = this.Col - 1;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        this.Position = 4;
    }
    else
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 2;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 1;
    }
};

SevenPiece.prototype = new Piece();
SevenPiece.prototype.constructor = SevenPiece;

function SevenPiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.Position = 1;
};

SevenPiece.prototype.SetupBlocks = function()
{
    if(this.Setup != true)
    {
        this.Setup = true;
        this.Blocks[0] = new Block(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Blocks[1] = new Block(this.Color, this.Row + 1, this.Col, this.Grid, this.Gradient);
        this.Blocks[2] = new Block(this.Color, this.Row + 2, this.Col, this.Grid, this.Gradient);
        this.Blocks[3] = new Block(this.Color, this.Row + 2, this.Col - 1, this.Grid, this.Gradient);
        this.Position = 1;
    }
};

SevenPiece.prototype.Rotate = function()
{
    if(this.Position == 1)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col - 1;
        this.Blocks[1].Col = this.Col - 1;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col + 1;
        
        this.Position = 2;
    }
    else if( this.Position == 2)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row + 1;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col + 1;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col;
        
        this.Position = 3;
    }
    else if(this.Position == 3)
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row;
        this.Blocks[2].Row = this.Row;
        this.Blocks[3].Row = this.Row + 1;
        
        this.Blocks[0].Col = this.Col - 1;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col + 1;
        this.Blocks[3].Col = this.Col + 1;
        this.Position = 4;
    }
    else
    {
        this.Blocks[0].Row = this.Row;
        this.Blocks[1].Row = this.Row + 1;
        this.Blocks[2].Row = this.Row + 2;
        this.Blocks[3].Row = this.Row + 2;
        
        this.Blocks[0].Col = this.Col;
        this.Blocks[1].Col = this.Col;
        this.Blocks[2].Col = this.Col;
        this.Blocks[3].Col = this.Col - 1;
        
        this.Position = 1;
    }
};

BombPiece.prototype = new Piece();
BombPiece.prototype.constructor = BombPiece;

function BombPiece(color, row, col, grid, grad) {
    Piece.prototype.constructor.call(this, color, row, col, grid, grad);
    this.Position = 1;
};

BombPiece.prototype.SetupBlocks = function () {
    if (this.Setup != true) {
        this.Setup = true;
        this.Blocks[0] = new BombBlock(this.Color, this.Row, this.Col, this.Grid, this.Gradient);
        this.Position = 1;
    }
};

BombPiece.prototype.Rotate = function () {
    if (this.OnExplode != undefined)
    {
        this.OnExplode(this);
    }
};

BombPiece.prototype.StopPiece = function () {
    if (this.Stopped != true) {
        if (this.OnExplode != undefined) {
            this.OnExplode(this);
        }
    }
    Piece.prototype.StopPiece();
};
