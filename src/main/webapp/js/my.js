$(document).ready(function() {

    showPage(0);
    let rows = $("#rowsCount");
    rows.change(function () {
        showPage(getActivePage());
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
    changeNumberStyle(page);
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
            .append("<td><img src = \"img\\edit.png\"></td>")
            .append("<td><img src = \"img\\delete.png\"></td>").on("click", function() {
                deleteRequest(data[i].id);
        });
    }
}

function makeNavPages(pages){
    let list = $("#pagination");
    list.empty();
    // list.css("cursor", "pointer");
    for(let i = 0; i < pages; ++i){
        let li = list.append("<li>"+(i+1)+"</li>").find("li").last();
        li.on("click", function(){
            loadPlayers(getRowsCount(), $(this).text()-1);
        });
    }
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

function getPagesCount(){
    return Math.ceil(getPlayersCount() / getRowsCount());
}

function showPage(page){
    makeNavPages(getPagesCount());
    loadPlayers(getRowsCount(), page);
}

function changeNumberStyle(page) {
    let list = $("#pagination");
    list.find("li").css("color", "black").removeAttr("id");
    list.find("li").eq(page).css("color", "red").attr("id", "active");
}

function deleteRequest(id){
    $.ajax({
        url: "/rest/players/" + id,
        async: false,
        type: "DELETE",
        success: function(){
            showPage(getActivePage());
        }
    })
}

function getActivePage(){
    let page = 0;
    page = $("#pagination").find("#active").text()-1;
    return page;
}