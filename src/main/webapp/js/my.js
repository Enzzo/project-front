$(window).load(function() {
    let tableId = "mainTable";
    let rows = $("#rowsCount").val();
    loadPlayers(tableId, rows, 0);

    $("#rowsCount").change(function (){
        $.get("/rest/players/count", function(data){
            rows = $("#rowsCount").val();
            let pagesCount = Math.ceil(data / rows);
            makeNavPages(pagesCount);
            loadPlayers(tableId, rows, 0);
        })
    });

    $("h1").hover(function(){
        console.log($(this).text())
    });

    $("li").hover(function(){
        console.log($(this).text())
    });
})

//  +-----------------------------------------------------------------------+
//  |   loadPlayers()                                                       |
//  +-----------------------------------------------------------------------+
//  |   gets data from /rest/players and fills #mainTable                   |
//  +-----------------------------------------------------------------------+
function loadPlayers(tableId = "tableId", rows, page){
    let mainTable = $("#" + tableId);
    let body = mainTable.find("tbody");
    if(!body.length){
        body = mainTable.append("<tbody></tbody>").find("tbody").last();
    }

    //  очистим таблицу, если в ней были какие-то данные
    body.empty();
    let url = "/rest/players?pageSize=" + rows;
    url += "&pageNumber=" + page;
    console.log(url);
    $.get(url, function(data){
        makeTable(data, body);
    });
}

//  +-----------------------------------------------------------------------+
//  |   makeTable()                                                         |
//  +-----------------------------------------------------------------------+
//  |   fill destination table by data                                      |
//  +-----------------------------------------------------------------------+
function makeTable(data, table){
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