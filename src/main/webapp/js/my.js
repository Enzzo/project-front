$(document).ready(function() {
$("h1").click(function (){
    $.ajax({
        type: "GET",
        url: "/rest/players",
        dataType: "json",
        success: function(data){
            let mainTable = $("#mainTable").val();
            console.log(mainTable.html());
            if(mainTable == null){
                mainTable = createBlankTable();
                console.log(mainTable.html());
            }
            console.log(mainTable.html());
            data.forEach(function(player){

            })
        }
    })
});
})

function createBlankTable(){
    return $(document.body).append("<table></table>")
        .find("table")
        .attr("id", "mainTable")
            .append("<thead></thead>")
            .find("thead")
                .append("<tr></tr>")
                .find("tr")
                    .append("<th>#</th>")
                    .append("<th>Name</th>")
                    .append("<th>Title</th>")
                    .append("<th>Race</th>")
                    .append("<th>Profession</th>")
                    .append("<th>Level</th>")
                    .append("<th>Birthday</th>")
                    .append("<th>Banned</th>")
                    .parentsUntil("table")
        .val();
}