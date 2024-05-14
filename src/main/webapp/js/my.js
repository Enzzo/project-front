$(document).ready(function() {
    let rows = initRowsSelect("rowsCount");
    let count = rows.val();
    let table = initTable("mainTable");
    let nav = initNav("pagination");
    loadPlayers(table, count, 0);

    $.get("/rest/players/count", function(data){
        count = rows.val();
        let pagesCount = Math.ceil(data / count);
        makeNavPages(nav, pagesCount);
        loadPlayers(table, count, 0);
    })

    rows.change(function (){
        $.get("/rest/players/count", function(data){
            count = rows.val();
            let pagesCount = Math.ceil(data / count);
            makeNavPages(nav, pagesCount);
            loadPlayers(table, count, 0);
        })
    });

    $("li").hover(function(){
        this.css("background-color", "lightblue");
    });
})

//  +-----------------------------------------------------------------------+
//  |   loadPlayers()                                                       |
//  +-----------------------------------------------------------------------+
//  |   gets data from /rest/players and fills #mainTable                   |
//  +-----------------------------------------------------------------------+
function loadPlayers(tbody, rows, page){
    //  очистим таблицу, если в ней были какие-то данные
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

function makeNavPages(list, pages){
    list.append("<li><<</li>");
    for(let i = 0; i < pages; ++i){
        list.append("<li>"+(i+1)+"</li>");
    }
    list.append("<li>>></li>");
}

function playersCount(){
    let count = 0;
    $.get("/rest/players/count", function(data){
        count = data;
    })
    return count;
}

function initNav(id){
    let nav = $("body").append("<div></div>").find("div").last();
    nav.attr("id", id);
    nav = nav.append("<nav></nav>").find("nav").last();
    return nav.append("<ul></ul>").find("ul").last();
}

function initRowsSelect(id){
    let select = $("body").append("<select></select>").find("select").last();
    select.attr("id", id);
    select.empty();
    select.append("<option>3</option>");
    select.append("<option>5</option>");
    select.append("<option>10</option>");
    select.append("<option>20</option>");
    return select;
}

function initTable(id){
    let table = $("body").append("<table></table>").find("table").last();
    table.attr("id", id);
    table.append("<thead></thead>").find("thead").last()
       .append("<tr></tr>")
       .find("tr").last()
       .append("<th>id</th>")
       .append("<th>name</th>")
       .append("<th>title</th>")
       .append("<th>race</th>")
       .append("<th>profession</th>")
       .append("<th>level</th>")
       .append("<th>birthday</th>")
       .append("<th>banned</th>");
    table.append("<tbody></tbody>");
    return table.find("tbody").last();
}