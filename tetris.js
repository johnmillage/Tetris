var current;
var grid;
var nextGrid;
var direction = 1;
var boardFill = new Array();
var oppFill = new Array();
var timer;
var colorAr = new Array();
var removes = new Array();
var score = 0;
var lines = 0;
var explodedBlock;
var nextPeice;
var nextNum;
var nextCol;
var nextGrad;
var timerInc;
var level = 1;
var mouseX;
var mouseY;
var endmouseX;
var endmouseY;
var touchMode = false;
var ws;
var oppGrid;
var oppPlayer;
var isPlaying = false;
var oppScore = 0;
var oppPlaying = false;


function LoadCanvas()
{
    var c = document.getElementById("myCanvas");
    var np = document.getElementById("nextPiece");
    var opp = document.getElementById("oppCanvas");
    c.focus();
    //standard colors
    colorAr[1] = "#00FFFF";
    colorAr[2] = "#FF0000";
    colorAr[3] = "#0000FF";
    colorAr[7] = "#FF00FF";
    colorAr[6] = "#FFFF00";
    colorAr[5] = "#C0C0C0";
    colorAr[4] = "#00FF00";
    
    current = undefined;
    nextPeice = undefined;
    score = 0;
    lines = 0;
    level = 1;

    grid = new play_grid(c);
    nextGrid = new play_grid(np, 4, 4);
    oppGrid = new play_grid(opp);

    for (i = 0; i < grid.Height; i++) {
        boardFill[i] = new Array();
        for (j = 0; j < grid.Width; j++) {
            boardFill[i][j] = false;
        }
    }

    for (i = 0; i < oppGrid.Height; i++) {
        oppFill[i] = new Array();
        for (j = 0; j < oppGrid.Width; j++) {
            oppFill[i][j] = false;
        }
    }

    Resize();
    //c.height=window.innerHeight - 50;
    //c.width = c.height / 2;

    //np.style.left = (c.width + 20).toString() + "px";
    //np.height = c.height / 4;
    //np.width = np.height;

    //var sc = document.getElementById("spScore");
    //sc.style.left = (c.width + 20).toString() + "px";
    //sc.style.top = "5px";

    //var rand = document.getElementById("spRand");
    //rand.style.left = sc.style.left;
    //rand.style.top = "50px";
    //var grad = document.getElementById("spGrad");
    //grad.style.left = rand.style.left;
    //grad.style.top = "100px";


    GetNextPiece(); //call once to get first piece;
	current = GetNextPiece();
	current.Draw();
	timerInc = 500;

	document.getElementById("lblScore").innerHTML = score.toString();


   
	if (ws == undefined) {
	    ws = new WebSocket("ws://" + "www.jmillage.net" + ":" + "8080/ws");

	    ws.onmessage = OnMessage;

	    ws.onclose = function (evt) {
	        alert("Connection close");
	        ws = undefined;
	    };

	    ws.onopen = OnOpen;
	}
}

function OnOpen(evt) {
    document.getElementById("txtName").disabled = false;
    document.getElementById("btnSendName").disabled = false;
}

function OnMessage(evt)
{
    var msg = JSON.parse(evt.data);

    if (msg.type == "players_response") {
        var cPl = document.getElementById("cboPlayers");
        for (i = 0; i < msg.players.length; i++) {
            var opt = document.createElement("option");
            opt.text = msg.players[i];
            opt.value = msg.players[i];
            cPl.options.add(opt);
        }
        cPl.disabled = false;
        document.getElementById("btnMatch").disabled = false;
    }
    else if (msg.type == "new_player") {
        var cPl = document.getElementById("cboPlayers");
        var opt = document.createElement("option");
        opt.text = msg.player;
        opt.value = msg.player;
        cPl.options.add(opt);
    }
    else if (msg.type == "player_left") {
        var cPl = document.getElementById("cboPlayers");
        for (i = 0; i < cPl.options.length; i++) {
            if (cPl.options[i].value == msg.player) {
                cPl.options.remove(cPl.options[i]);
                break;
            }
        }
    }
    else if (msg.type == "set_name_response") {
        if (msg.data = "OK") {
            var outmsg = new Object();
            outmsg.type = "get_players";
            ws.send(JSON.stringify(outmsg));
            document.getElementById("spPlayer").style.visibility = "hidden";
            document.getElementById("spComp").style.visibility = "visible";
        }
        else {
            alert("That name is already taken by another user");
            document.getElementById("btnSendName").disabled = false;
            document.getElementById("txtName").disabled = false;
        }
    }
    else if (msg.type == "connect_player_request") {
        var outmsg = new Object();
        outmsg.type = "connect_player_response";
        if (confirm("Player " + msg.player + " would like to play.  Connect?")) {
            outmsg.answer = "yes";
            document.getElementById("cboPlayers").disabled = true;
            document.getElementById("btnMatch").disabled = true;
            OnResetClick();
            document.getElementById("spOppScore").style.visibility = "visible";
            document.getElementById("oppCanvas").style.visibility = "visible";
            document.getElementById("btnReset").disabled = true;
            oppPlayer = msg.player;
        }
        else {
            outmsg.answer = "no";
        }
        ws.send(JSON.stringify(outmsg));
    }
    else if (msg.type == "connect_player_response") {
        if (msg.answer == "yes") {
            OnResetClick();
            document.getElementById("spOppScore").style.visibility = "visible";
            document.getElementById("oppCanvas").style.visibility = "visible";
            document.getElementById("btnReset").disabled = true;
        }
        else {
            alert("Player refused request");
            document.getElementById("cboPlayers").disabled = false;
            document.getElementById("btnMatch").disabled = false;
            
            oppPlayer = undefined;
        }
    }
    else if (msg.type == "game_data") {
        oppBoard = msg.data;
        for (i = 0; i < oppBoard.length; i++) {
            for (j = 0; j < oppBoard[i].length; j++) {
                if (oppBoard[i][j] != 0) {
                    if (oppFill[i][j] == false) {
                        if (oppBoard[i][j] == "#000000") {
                            oppFill[i][j] = new BombBlock(oppBoard[i][j], i, j, oppGrid, false);
                        }
                        else {
                            oppFill[i][j] = new Block(oppBoard[i][j], i, j, oppGrid, false);
                        }
                        oppFill[i][j].Draw();
                    }
                }
                else {
                    if (oppFill[i][j] != false) {
                        oppFill[i][j].Clear();
                        oppFill[i][j] = false;
                    }
                }
            }
        }
        oppScore = msg.score;
        oppPlaying = msg.playing;
        var othScore = oppScore.toString();
        if (oppPlaying == false) {
            othScore += " Done";
            if (isPlaying == false) {  //let them play again now if they want
                if (score > oppScore) {
                    document.getElementById("lblScore").innerHTML += " WIN";
                }
                else {
                    document.getElementById("lblScore").innerHTML += " LOSE";
                }
                document.getElementById("cboPlayers").disabled = false;
                document.getElementById("btnMatch").disabled = false;
                document.getElementById("btnReset").disabled = false;
                oppPlayer = undefined;
                msg = new Object();
                msg.type = "game_over";
                ws.send(JSON.stringify(msg));
            }
        }
        document.getElementById("lblOppScore").innerHTML = othScore;
    }

}

function OnSendName() {
    var n = document.getElementById("txtName");
    if (n.value != undefined && n.value != "") {
        msg = new Object();
        msg.type = "set_name";
        msg.name = n.value;
        ws.send(JSON.stringify(msg));
        n.disabled = true;
        document.getElementById("btnSendName").disabled = true;
    }
}

function OnMatchClick() {
    var p = document.getElementById("cboPlayers");
    if (p.value != undefined && p.value != "") {
        msg = new Object();
        msg.type = "connect_player";
        msg.player = p.value;
        ws.send(JSON.stringify(msg));
        oppPlayer = msg.player;
        p.disabled = true;
        document.getElementById("btnMatch").disabled = true;
    }
}

function SendGameData() {
    var msg = new Object();
    msg.type = "game_data";
    msg.data = new Array();
    for (i = 0; i < grid.Height; i++) {
        msg.data[i] = new Array();
        for (j = 0; j < grid.Width; j++) {
            if(boardFill[i][j] == false)
            {
                msg.data[i][j] = 0;
            }
            else
            {
                msg.data[i][j] = boardFill[i][j].Color;
            }
        }
    }
    msg.score = score;
    msg.playing = isPlaying;

    if (current != undefined) {
        for (i = 0; i < current.Blocks.length; i++) {
            msg.data[current.Blocks[i].Row][current.Blocks[i].Col] = current.Blocks[i].Color;
        }
    }

    ws.send(JSON.stringify(msg));
}



function debugPrint(msg) {
    document.getElementById("lblScore").innerHTML = msg;
}

function KeyDown(e)
{
    if (isPlaying == false)
        return;

    if(e.keyCode == 32)  //space
    {
        RotatePiece();
        e.preventDefault();
    }
    else if(e.keyCode == 37)  //left
    {
        MovePieceLeft();
        e.preventDefault();
    }
    else if(e.keyCode == 39) //right
    {
        MovePieceRight();
        e.preventDefault();
    }
    else if(e.keyCode == 40) //down
    {
        MovePieceDown();
        e.preventDefault();
    }
}

function OnCanvasMouseDown(event) {
    if (isPlaying == false)
        return;

    if (touchMode == true)
        return;
    //event.preventDefault();
    mouseX = event.screenX;
    mouseY = event.screenY;
}

function OnTouchStart(event) {
    if (isPlaying == false)
        return;
    touchMode = true;
    mouseX = event.touches[event.touches.length - 1].clientX;
    mouseY = event.touches[event.touches.length - 1].clientY;
    endmouseX = mouseX;
    endmouseY = mouseY;
}

function OnTouchMove(event) {
    if (isPlaying == false)
        return;
    touchMode = true;
    event.preventDefault();
    endmouseX = event.touches[event.touches.length - 1].clientX;
    endmouseY = event.touches[event.touches.length - 1].clientY;
}

function HandleEndMouse(curX, curY) {
    if (isPlaying == false)
        return;
    var difX = mouseX - curX;
    var difY = mouseY - curY;

    var right = false;
    var down = false;

    if (difX < 0) {
        difX *= -1;
        right = true;
    }

    if (difY < 0) {
        difY *= -1;
        down = true;
    }

    if (difX <= 10 && difY <= 10) {
        RotatePiece();
    }
    else if (difX > difY) {
        if (right == true) {
            MovePieceRight();
        }
        else {
            MovePieceLeft();
        }
    }
    else if (down == true) {
        MovePieceDown();
    }
}

function OnTouchEnd(event) {
    if (isPlaying == false)
        return;
    HandleEndMouse(endmouseX, endmouseY);

}

function OnCanvasMouseUp(event) {
    if (isPlaying == false)
        return;

    if (touchMode == true)
        return;
    //event.preventDefault = true;
    var curX = event.screenX;
    var curY = event.screenY;
    HandleEndMouse(curX, curY);
   
}

function OnResetClick() {

    if (timer == undefined) {
        isPlaying = true;
        timer = setInterval(MovePieceDown, timerInc);
        document.getElementById("btnReset").innerHTML = "Stop";
    }
    else {
        isPlaying = false;
        clearInterval(timer);
        timer = undefined;
        document.getElementById("btnReset").innerHTML = "Start";
        timerInc = 500
    }
    grid.ClearGrid();

    LoadCanvas();

    document.getElementById("spOppScore").style.visibility = "hidden";
    document.getElementById("oppCanvas").style.visibility = "hidden";
}



function Resize()
{
    var c = document.getElementById("myCanvas");
    var np = document.getElementById("nextPiece");
    var opp = document.getElementById("oppCanvas");
    c.height = window.innerHeight - 50;
    c.width = c.height / 2;

    var sc = document.getElementById("spScore");
    sc.style.left = (c.width + 20).toString() + "px";
    sc.style.top = "5px";

    np.style.top = "50px";
    np.style.left = (c.width + 20).toString() + "px";
    np.height = c.width / 3;
    np.width = np.height;


    opp.style.top = (50 + np.height + 25).toString() + "px";
    opp.style.left = (c.width + 20).toString() + "px";
    opp.width = 196;
    opp.height = opp.width * 2;

    grid.SetupCells();
    nextGrid.SetupCells();
    RedrawBoard();
    if (nextPeice != undefined) {
        nextPeice.Draw();
    }
    if (current != undefined) {
        current.Draw();
    }
    
    var oppScore = document.getElementById("spOppScore");
    oppScore.style.left = sc.style.left;
    oppScore.width = 196;
    oppScore.style.top = (50 + np.height).toString() + "px";

    var rand = document.getElementById("spPlayer");
    rand.style.left = sc.style.left;
    rand.style.top = (c.height - 100).toString() + "px";
    var grad = document.getElementById("spComp");
    grad.style.left = rand.style.left;
    grad.style.top = (c.height - 100).toString() + "px";
    var res = document.getElementById("btnReset");
    res.style.left = sc.style.left;
    res.style.top = (c.height - 50).toString() + "px";
    
}

function RedrawBoard()
{
    for(i = 0; i < grid.Height; i++)
    {
        for(j = 0; j < grid.Width; j++)
        {
            if(boardFill[i][j] != false)
            {
                boardFill[i][j].Draw();
            }

            if (oppFill[i][j] != false)
            {
                oppFill[i][j].Draw();
            }
        }
    }
}

function OnExplode(expBlock)
{
    var top = expBlock.Top();
    var left = expBlock.Left();

    expBlock.Clear();

    grid.FillBlock(top, left, 1, "Red", document.getElementById("chkGradCols").checked);

    explodedBlock = expBlock;

    if (expBlock == current) {
        current = undefined;
    }
}

function ClearExploded() {
    
    if (explodedBlock == undefined) {
        return;
    }

    var top = explodedBlock.Top();
    var left = explodedBlock.Left();

    grid.ClearGrid();

    for (i = top - 1; i <= top + 1 ; i++) {
        for (j = left - 1; j <= left + 1; j++) {
            if (i >= 0 && i < grid.Height && j >= 0 && j < grid.Width) {
                if (boardFill[i][j] != false) {
                    boardFill[i][j] = false;
                }
            }
        }
    }
    RedrawBoard();
    explodedBlock = undefined;
}

function GetNextPiece()
{

    var num = Math.floor((Math.random() * 7) + 1);
    var rand = document.getElementById("chkRandCols");
    col = "#000000";
    if (rand.checked == true) {
        col = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    }
    else {
        col = colorAr[num];
    }

    var grad = document.getElementById("chkGradCols").checked;

    if (Math.floor((Math.random() * 20)) > 10) {
        num = 8;
        col = "#000000";
    }

    var retPeice;

    if (nextPeice != undefined) {
        nextPeice.Clear();
        retPeice = GetPeice(nextNum, nextCol, nextGrad, true);
    }

    nextPeice = GetPeice(num, col, grad, false);
    nextPeice.Draw();

    nextNum = num;
    nextCol = col;
    nextGrad = grad;


    return retPeice;
   
}

function GetPeice(num, col, grad, main) {

    if (num == 1) {
        if (main == true) {
            return new SquarePiece(col, 0, 5, grid, grad);
        }
        else {
            return new SquarePiece(col, 1, 1, nextGrid, grad);
        }
    }
    else if (num == 2) {
        if (main == true) {
            return new LinePiece(col, 0, 5, grid, grad);
        }
        else {
            return new LinePiece(col, 0, 1, nextGrid, grad);
        }
    }
    else if (num == 3) {
        if (main == true) {
            return new SPiece(col, 0, 5, grid, grad);
        }
        else {
            return new SPiece(col, 1, 2, nextGrid, grad);
        }
    }
    else if (num == 4) {
        if (main == true) {
            return new ZPiece(col, 0, 5, grid, grad);
        }
        else {
            return new ZPiece(col, 1, 2, nextGrid, grad);
        }
    }
    else if (num == 5) {
        if (main == true) {
            return new TriPiece(col, 0, 5, grid, grad);
        }
        else {
            return new TriPiece(col, 1, 2, nextGrid, grad);
        }
    }
    else if (num == 6) {
        if (main == true) {
            return new LPiece(col, 0, 5, grid, grad);
        }
        else {
            return new LPiece(col, 1, 1, nextGrid, grad);
        }
    }
    else if (num == 7) {
        if (main == true) {
            return new SevenPiece(col, 0, 5, grid, grad);
        }
        else {
            return new SevenPiece(col, 1, 2, nextGrid, grad);
        }
    }
    else
    {
        var bomb;
        if (main == true) {
            bomb = new BombPiece(col, 0, 5, grid, grad);
        }
        else {
            bomb = new BombPiece(col, 1, 1, nextGrid, grad);
        }
        bomb.OnExplode = OnExplode;

        return bomb;
    }
}

function MovePieceLeft()
{
    if (current == undefined) {
        return;
    }
    if(current.Left() > 0)
    {
        current.Clear();
        current.MoveCol(current.Col - 1);
        if (IsInOtherBlock() == true)
        {
            current.MoveCol(current.Col + 1);
        }
        current.Draw();
    }
}

function MovePieceRight()
{
    if (current == undefined) {
        return;
    }
    if(current.Right() <  grid.Width - 1)
    {
        current.Clear();
        current.MoveCol(current.Col + 1);
        if (IsInOtherBlock() == true)
        {
            current.MoveCol(current.Col - 1);
        }
        current.Draw();
    }
}

function RotatePiece()
{
    if (current == undefined) {
        return;
    }
    var pos = current.Position;
    current.Clear();
    current.Rotate();
    if (current == undefined) {
        return;
    }
    if(IsInOtherBlock() == true || 
        current.Top() < 0 ||
        current.Bottom() > grid.Height - 1 ||
        current.Left() < 0 ||
        current.Right() > grid.Width - 1)
    {
        //we rotated to a bad spot,  need to back it out
        var newPos = current.Position;
        while(newPos != pos)
        {
            current.Rotate();
            newPos = current.Position;
        }
    }
    current.Draw();
}

function IsOnOtherBlock()
{
    var on = false;
    for(i = 0; i < current.Blocks.length; i++)
    {
        if(boardFill[current.Blocks[i].Row + 1][current.Blocks[i].Col] != false)
        {
            on = true;
            break;
        }
    }
    return on;
}

function IsInOtherBlock()
{
    var colide = false;
    for(i = 0; i < current.Blocks.length; i++)
    {
        if(boardFill[current.Blocks[i].Row][current.Blocks[i].Col] != false)
        {
            colide = true;
            break;
        }
    }
    return colide;
}

function StopPiece()
{
    if (current == undefined) {
        return false;
    }

    var stop = false;
    if(current.Setup != true)
    {
        current.Draw();
        stop = IsOnOtherBlock() || IsInOtherBlock();
    }
    else
    {
        if(current.Bottom() == grid.Height - 1)
        {
            stop = true;
        }
        else
        {
            stop = IsOnOtherBlock();
        }
    }

   
    return stop;
}

function MovePieceDown()
{

    ClearExploded();
    //lets see if the current peice is already at it's stopping point
    //and if so go ahead and switch to a new piece.  You shouldn't have any
    //full rows here because we check for that after the move.
    if (StopPiece())
    {
        current.StopPiece();
        SwitchToNextPiece();
    }

    var newCur = false;
    //the switch to next peice might have cleared current
    //if so gen a new peice
    if (current == undefined )
    {
        current = GetNextPiece();
        newCur = true;
    }

    //remove any full rows here so the user sees the full row for 1 time increment.  it felt strange to have it remove right away
    RemoveFullRows();

    //if new don't move
    if (newCur == false) {
        current.Clear();
        current.MoveRow(current.Row + 1);
        if (IsInOtherBlock() == true) {
            current.MoveRow(current.Row - 1);
        }
    }
    current.Draw();

    var stop = StopPiece();

    //see if after we moved down we need to stop
    //and if so highlight any full rows and switch to new piece
    if (stop == true)
    {
        current.StopPiece();
        if (CheckFullRows())
        {
            SwitchToNextPiece();
        }
    }

    if (oppPlayer != undefined) {
        SendGameData();
    }
}

function SwitchToNextPiece()
{
    MoveCurrentToBoard();
    
    if(current != undefined && current.Row == 0)  //end game
    {
        isPlaying = false;
        clearInterval(timer);
        timer = undefined;
        document.getElementById("btnReset").innerHTML = "Start";
        timerInc = 500

        if (oppPlayer != undefined) {
            if (oppPlaying == false) {
                if (score >= oppScore) {
                    document.getElementById("lblScore").innerHTML += " WIN";
                }
                else {
                    document.getElementById("lblScore").innerHTML += " LOSE";
                }
                document.getElementById("btnReset").disabled = false;
                oppPlayer = undefined;
                document.getElementById("cboPlayers").disabled = false;
                document.getElementById("btnMatch").disabled = false;
                SendGameData();
                msg = new Object();
                msg.type = "game_over";
                ws.send(JSON.stringify(msg));
            }
            
            
        }
    }
    else
    {
        current = undefined;
    }
}

function MoveCurrentToBoard()
{
    if (current != undefined)
    {
        for (i = 0; i < current.Blocks.length; i++)
        {
            boardFill[current.Blocks[i].Row][current.Blocks[i].Col] = current.Blocks[i];
        }
    }
}

function CheckFullRows()
{
    if (current == undefined)
    {
        return false;
    }
    //get unique list of rows this current Piece effects
    removes = new Array();
    var rows = new Array();
    if (current != undefined)
    {
        for (i = 0; i < current.Blocks.length; i++) {
            var row = current.Blocks[i].Row;
            var found = false;
            for (n = 0; n < rows.length; n++) {
                if (rows[n] == row) {
                    found = true;
                    break;
                }
            }

            if (found == false) {
                rows.push(row);
            }
        }
    }
    
    //then see if this row is full
    for(c = 0; c < rows.length;c++)
    {
        var full = true;
        row = rows[c];
        for(j = 0; j < boardFill[row].length; j++)
        {
            if((boardFill[row][j] == false) && (current.HasBlock(row, j) == false))
            {
                full = false;
                break;
            }
        }
        
        if(full == true)
        {
            removes.push(row);
        }
    }
    
    if (removes.length > 0)
    {
        lines += removes.length;

        if (lines % 10 == 0 && timerInc > 50 && timer != undefined) {
            clearInterval(timer);
            timerInc -= 50;
            timer = undefined;
            timer = setInterval(MovePieceDown, timerInc);
        }

        MoveCurrentToBoard();
        if (removes.length == 1) {
            score += 10;
        }
        else if (removes.length == 2) {
            score += 30;
        }
        else if (removes.length == 3) {
            score += 70;
        }
        else {
            score += 150;
        }

        document.getElementById("lblScore").innerHTML = score.toString();
    }

    for (i = 0; i < removes.length; i++) {
        grid.FillRow(removes[i], "gold", document.getElementById("chkGradCols").checked);
    }

    return (removes.length > 0);

}

function RemoveFullRows()
{
    //now go through cells and set row and col to new values
    if (removes.length > 0)
    {

        removes.sort(function (a, b) { b - a; });
        for (i = 0; i < removes.length; i++) {
            boardFill.splice(removes[i], 1);
            boardFill.splice(0, 0, new Array());
            for (c = 0; c < grid.Width; c++) {
                boardFill[0].push(false);
            }
        }

        var remRow = removes[removes.length - 1];
        for (r = remRow; r >= 0; r--) {
            grid.ClearRow(r);
            for (c = 0; c < boardFill[r].length; c++) {
                if (boardFill[r][c] != false) {
                    boardFill[r][c].Clear();
                    boardFill[r][c].Row = r;
                    boardFill[r][c].Col = c;
                    boardFill[r][c].Draw();
                }
            }
        }
        removes = new Array();
    }
}
    
