$(document).ready(function() {
    makeNavPages(getPagesCount());
    loadPlayers(getRowsCount(), 0);

    let rows = $("#rowsCount");
    rows.change(function () {
        makeNavPages(getPagesCount());
        loadPlayers(getRowsCount(), 0);
    });
})

//  +-----------------------------------------------------------------------+
//  |   loadPlayers()                                                       |
//  +-----------------------------------------------------------------------+
//  |   gets data from /rest/players and fills #mainTable                   |
//  +-----------------------------------------------------------------------+
function loadPlayers(rows, page){
    //  очистим таблицу, если в ней были какие-то данные
    let tbody = $("#mainTable").find("tbody").last();
    tbody.empty();
    let url = "/rest/players?pageSize=" + rows;
    url += "&pageNumber=" + page;
    $.get(url, function(data){
        makeTable(data, tbody);
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
    let list = $("#pagination");
    list.empty();
    list.append("<li><<</li>");
    let prev = null;
    for(let i = 0; i < pages; ++i){
        let li = list.append("<li>"+(i+1)+"</li>").find("li").last();
        li.on("click", function(){
            if(prev != null) {
                prev.css("color", "black");
            }
            loadPlayers(getRowsCount(), $(this).text()-1);
            $(this).css("color", "red");
            prev = $(this);
        });
    }
    list.append("<li>>></li>");
}

function getRowsCount(){
    return $("#rowsCount").val();
}

function getPlayersCount(){
    let count = 0;
    $.ajax({
        url: "/rest/players/count",
        async: false,
        success: function(data){
            count = data;
        }
    })
    return count;
}

function getRowsCount(){
    return $("#rowsCount").val();
}

function getPagesCount(){
    return Math.ceil(getPlayersCount() / getRowsCount());
}