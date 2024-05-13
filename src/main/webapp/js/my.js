$(document).ready(function() {
    $("#rowsCount").change(function (){
        makeNavPages($(this).val());
    });

    $("h1").click(function (){
        let tableId = "mainTable";
        loadPlayers(tableId);
    });
})

//  +-----------------------------------------------------------------------+
//  |   loadPlayers()                                                       |
//  +-----------------------------------------------------------------------+
//  |   gets data from /rest/players and fills #mainTable                   |
//  +-----------------------------------------------------------------------+
function loadPlayers(tableId = "tableId"){
    let mainTable = $("#" + tableId);
    let body = mainTable.find("tbody");
    if(!body.length){
        body = mainTable.append("<tbody></tbody>").find("tbody").last();
    }

    let rowsToDisplay = $("#selector").val();
    $.get("/rest/players", function(data){
        makeTable(data, body, rowsToDisplay);
    });
}

//  +-----------------------------------------------------------------------+
//  |   makeTable()                                                         |
//  +-----------------------------------------------------------------------+
//  |   fill destination table by data                                      |
//  +-----------------------------------------------------------------------+
function makeTable(data, table, count){
    console.log(count);
    for(let i = 0; i < data.length; i++){
        table.append("<tr></tr>")
            .find("tr").last()
            .append("<td>" + data[i].id + "</td>")
            .append("<td>" + data[i].name + "</td>")
            .append("<td>" + data[i].title + "</td>")
            .append("<td>" + data[i].race + "</td>")
            .append("<td>" + data[i].profession + "</td>")
            .append("<td>" + data[i].level + "</td>")
            .append("<td>" + new Date(data[i].birthday).toLocaleDateString() + "</td>")
            .append("<td>" + data[i].banned + "</td>")
    }
}

function makeNavPages(pages){
    let nav = $("#pagination");
    nav.empty();
    let list = nav.append("<ul></ul>").find("ul").last();

    list.append("<li><<</li>");
    for(let i = 0; i < pages; ++i){
        list.append("<li>"+(i+1)+"</li>");
    }
    list.append("<li>>></li>");
}