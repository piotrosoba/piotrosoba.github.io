//global vars
var chooseBox =  $('#chooseBox');
var squareToChange;


// adding squares
(function () {
    chooseBox.hide();
    var iColumn = 1;
    var iSquare = 0;
    var addSquare = 1;
    for (i=1; i <= 81;i++){
        $('#sudoku').append("<div class='row"+(Math.floor((i-1)/9)+1)+" column"+iColumn+" square"+(Math.floor(iSquare/3)+addSquare)+"'></div>");
        iColumn++;
        if (iColumn == 10) iColumn = 1;

        iSquare++;
        if (iSquare == 9) iSquare = 0;
        if (i == 27 || i == 54) addSquare += 3;

        if (i <= 9) chooseBox.append("<div>"+i+"</div>");
    }
    chooseBox.append("<div>x</div>")

}) ();

// this should be export to JSON

var s0 = "876900000010006000040305800400000210090500000050040306029000008004690173000001004";
var s1 = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
var s2 = "040201060000000000905000307000000000507080104010000090001000600000705000608904503";
var s3 = "090006040005300008000070200001050003060009070200084100003010000800002500050400080";

var sudokuExamples = [s0, s1, s2, s3];

var sudokuNumber = 0;
if (localStorage.getItem("numSud")) sudokuNumber = parseInt(localStorage.getItem("numSud"));


var sudokuFiled = ["", "", "", ""];
if (localStorage.getItem("remSud")) sudokuFiled = JSON.parse(localStorage.getItem("remSud"));

$('body').append(localStorage.getItem("numSud"));

// fill sudoku

function sudokuInit (sampl){
    $('#sudoku div').removeClass("complete");
    $('#sudoku div').removeClass("starter");
    $('#sudoku div').removeClass("wrong");
    $('#sudoku div').removeClass("focused");
    $('#sudoku div').text("");
    for (i=0; i<sampl.length; i++){
        if (sampl[i] != "0")
            $('#sudoku div:nth-child('+(i+1)+')').text(sampl[i]).addClass("starter");
            
    }
};
sudokuInit (sudokuExamples[sudokuNumber]);
fillRemembered (sudokuFiled[sudokuNumber]);
sudokuChecker();

// remember filled squares
function rememberSudoku() {
    var checkingSquare;
    sudokuFiled[sudokuNumber] = "";
    for (i=1;i<=81;i++){
        checkingSquare = $('#sudoku div:nth-child('+i+')');
        if (checkingSquare.text() == "") sudokuFiled[sudokuNumber] += 0;
        else sudokuFiled[sudokuNumber] += checkingSquare.text();
    }
    localStorage.setItem('remSud', JSON.stringify(sudokuFiled));
}

// fill remembered squares
function fillRemembered(rem){
    for (i=0; i<81; i++){
        if (rem[i] != "0")
            $('#sudoku div:nth-child('+(i+1)+')').text(rem[i]);
    }
}

// < next > buttons
$('#prevousSudoku').click(function(e){
    rememberSudoku();
    chooseBox.hide();
    if (sudokuNumber != 0) sudokuNumber -= 1;
    sudokuInit (sudokuExamples[sudokuNumber]);
    fillRemembered(sudokuFiled[sudokuNumber]);
    localStorage.setItem('numSud', sudokuNumber);
    sudokuChecker();

});

$('#nextSudoku').click(function(e){
    rememberSudoku();
    chooseBox.hide();
    if (sudokuNumber != sudokuExamples.length-1) sudokuNumber += 1;
    sudokuInit (sudokuExamples[sudokuNumber]);
    fillRemembered(sudokuFiled[sudokuNumber]);
    localStorage.setItem('numSud', sudokuNumber);
    sudokuChecker();

});

$('#resetSudoku').click(function(e){
    sudokuFiled[sudokuNumber] = "";
    chooseBox.hide();
    sudokuInit (sudokuExamples[sudokuNumber]);
    rememberSudoku();

});

// show chooseBox
$('#sudoku div').click(function(e){
    squareToChange = $(this);
    if (!squareToChange.attr("class").includes("starter")){
        if (squareToChange.attr("class").includes("focused")){
            chooseBox.hide();
            $('#sudoku div').removeClass("focused");
    }
    else{
    $('#sudoku div').removeClass("focused");
    squareToChange.addClass("focused");
    chooseBox.hide();
    chooseBox.show(200);
    var squarePostion = squareToChange.offset();
    chooseBox.css({
        'top': squarePostion.top+15,
        'left': squarePostion.left+55
    });
}}});

//  change square value with chooseBox
$('#chooseBox div').click(function(e){
    $('#sudoku div').removeClass("focused");
    if ($(this).text() == "x") squareToChange.text("");
    else squareToChange.text($(this).text());
    chooseBox.hide();
    sudokuChecker();
    rememberSudoku();
});


// check in row column and square after choose number in chooseBox
function checker(currentSquare){
    var rowValue = $("."+currentSquare.attr("class").split(" ")[0]).text();
    var columnValue = $("."+currentSquare.attr("class").split(" ")[1]).text();
    var bigSquareValue = $("."+currentSquare.attr("class").split(" ")[2]).text();
    var squareValue = $(currentSquare).text();
    if (squareValue.length == 0){
        currentSquare.removeClass("wrong");
        return;
    }
    if(rowValue.indexOf(squareValue) == rowValue.lastIndexOf(squareValue)) 
        currentSquare.removeClass("wrong");
    else {
        currentSquare.addClass("wrong");
        return;}
    if(columnValue.indexOf(squareValue) == columnValue.lastIndexOf(squareValue)) 
        currentSquare.removeClass("wrong");
    else {
        currentSquare.addClass("wrong");
        return;}
    if(bigSquareValue.indexOf(squareValue) == bigSquareValue.lastIndexOf(squareValue)) 
        currentSquare.removeClass("wrong");
    else {
        currentSquare.addClass("wrong");
        return};
}
// check all
function sudokuChecker (){
    for (i=1;i<=81;i++){
        checker($('#sudoku div:nth-child('+i+')'))
    }


    if ($('#sudoku div').text().length == 81 && $(".wrong").length == 0){
        $('#sudoku div').addClass("starter");
        $('#sudoku div').addClass("complete")};
};
