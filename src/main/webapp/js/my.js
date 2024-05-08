$(document).ready(function() {
$("h1").click(function (){
    let selectorId = "selector";
    let tableId = "mainTable";
    makeSelector(selectorId);
    loadPlayers(tableId);
});
})

function getPlayersCount(){
    $.get("rest/players/count", function(data){
            let select = $("#rowsCount");
            if(!select.length){
                select = makeSelector(data);
            }
        }
    )
}

//  +-----------------------------------------------------------------------+
//  |   loadPlayers()                                                        |
//  +-----------------------------------------------------------------------+
//  |   gets data from /rest/players and fills #mainTable                   |
//  +-----------------------------------------------------------------------+
function loadPlayers(tableId = "tableId"){
    let mainTable = $("#" + tableId);
    if(!mainTable.length){
        mainTable = makeBlankTable(tableId);
    }
    let body = mainTable.find("tbody");
    if(!body.length){
        body = mainTable.append("<tbody></tbody>").find("tbody").last();
    }
    $.get("/rest/players", function(data){
        for(let i = 0; i < data.length; i++){
            body.append("<tr></tr>")
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
    })
}
//  +-----------------------------------------------------------------------+
//  |   makeBlankTable()                                                    |
//  +-----------------------------------------------------------------------+
//  |   makes blank table with header                                       |
//  +-----------------------------------------------------------------------+
function makeBlankTable(tableId = "tableId"){
    let table = $(document.body).append("<table></table>")
        .find("table").last()
        .attr("id", tableId);

        table.append("<thead></thead>").find("thead").last()
            .append("<tr></tr>").find("tr").last()
                .append("<th>#</th>")
                .append("<th>Name</th>")
                .append("<th>Title</th>")
                .append("<th>Race</th>")
                .append("<th>Profession</th>")
                .append("<th>Level</th>")
                .append("<th>Birthday</th>")
                .append("<th>Banned</th>")

    return table;
}

function makeSelector(selectorId = "selectorId"){
    let select = $("#" + selectorId);
    if(!select.length){
        select = $(document.body).append("<select></select>").find("select").last().attr("id", selectorId);
        select.append("<option>" + 3 + "</option>");
        select.append("<option>" + 5 + "</option>");
        select.append("<option>" + 10 + "</option>");
        select.append("<option>" + 20 + "</option>");
    }
}