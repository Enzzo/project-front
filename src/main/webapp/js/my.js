$(document).ready(function() {
$("h1").click(function (){
    getPlayers();
    getPlayersCount();
});
})

function getPlayersCount(){
    $.ajax({
        type: "GET",
        url: "/rest/players/count",
        dataType: "json",
        success: function(data){
            console.log(data);
        }
    })
}

//  +-----------------------------------------------------------------------+
//  |   getPlayers()                                                        |
//  +-----------------------------------------------------------------------+
//  |   gets data from /rest/players and fills #mainTable                   |
//  +-----------------------------------------------------------------------+
function getPlayers(){
    $.ajax({
        type: "GET",
        url: "/rest/players",
        dataType: "json",
        success: function(data){
            let mainTable = $("#mainTable");
            if(!mainTable.length){
                mainTable = makeBlankTable();
            }
            let body = mainTable.find("tbody");
            if(!body.length){
                body = mainTable.append("<tbody></tbody>").find("tbody").last();
            }
            data.forEach(function(player){
                body.append("<tr></tr>")
                    .find("tr").last()
                    .append("<td>" + player.id + "</td>")
                    .append("<td>" + player.name + "</td>")
                    .append("<td>" + player.title + "</td>")
                    .append("<td>" + player.race + "</td>")
                    .append("<td>" + player.profession + "</td>")
                    .append("<td>" + player.level + "</td>")
                    .append("<td>" + player.birthday + "</td>")
                    .append("<td>" + player.banned + "</td>")

            })
        }
    })
}
//  +-----------------------------------------------------------------------+
//  |   makeBlankTable()                                                    |
//  +-----------------------------------------------------------------------+
//  |   makes blank table with header                                       |
//  +-----------------------------------------------------------------------+
function makeBlankTable(){
    let table = $(document.body).append("<table></table>")
        .find("table").last()
        .attr("id", "mainTable");

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