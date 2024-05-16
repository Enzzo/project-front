$(document).ready(function() {

    showPage(0);
    let rows = $("#rowsCount");
    rows.change(function () {
        showPage(0);
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
        let row = table.append("<tr></tr>").find("tr").last();
            row.append("<td class='id'>" + data[i].id + "</td>")
                .append("<td class='name'>" + data[i].name + "</td>")
                .append("<td class='title'>" + data[i].title + "</td>")
                .append("<td class='race'>" + data[i].race + "</td>")
                .append("<td class='profession'>" + data[i].profession + "</td>")
                .append("<td class='level'>" + data[i].level + "</td>")
                .append("<td class='birthday'>" + new Date(data[i].birthday).toLocaleDateString() + "</td>")
                .append("<td class='banned'>" + data[i].banned + "</td>");

                let editCell = row.append("<td class='edit'><img src = \"img\\edit.png\"></td>").find("td").last();
                editCell.on("click", function(){
                    editRow(row);
                });

                let deleteCell = row.append("<td class='delete'><img src = \"img\\delete.png\"></td>").find("td").last();
                deleteCell.on("click", function() {
                    deleteRequest(data[i].id);
                });
    }
}

function makeNavPages(pages){
    let list = $("#pagination");
    list.empty();
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

function editRow(row){
    row.find(".id").attr("contenteditable", "true");
    row.find(".name").attr("contenteditable", "true");
    row.find(".title").attr("contenteditable", "true");
    row.find(".race").attr("contenteditable", "true");
    row.find(".profession").attr("contenteditable", "true");
    row.find(".level").attr("contenteditable", "true");
    row.find(".birthday").attr("contenteditable", "true");
    row.find(".banned").attr("contenteditable", "true");
    row.find(".edit").empty().append("<td class='edit'><img src = \"img\\save.png\"></td>").on("click", function(){
        showPage(getActivePage());
    });
    row.find(".delete").css("display", "none");
}