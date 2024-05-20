$(document).ready(function() {

    showPage(0);
    initForm()

    let rows = $("#rowsCount");
    rows.change(function () {
        initForm();
        showPage(0);
        console.log($(this));
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
    row.find(".name").attr("contenteditable", "true");
    row.find(".title").attr("contenteditable", "true");
    let raceField = makeRaceField(row.find(".race"));
    let professionField = makeProfessionField(row.find(".profession"));
    let bannedField = makeBannedField(row.find(".banned"));

    row.find(".edit").empty().append("<img src = \"img\\save.png\">").on("click", function(){

        let id = row.find(".id").last().text();
        let postUrl = "/rest/players/" + id;
        let name = row.find(".name").last().text();
        let title =  row.find(".title").last().text();
        let race =  raceField.val();
        let profession =  professionField.val();
        let banned = bannedField.val();

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: postUrl,
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({name, title, race, profession, banned}),
        })
        showPage(getActivePage());
    });
    row.find(".delete").last().css("display", "none");
}

function makeRaceField(field){
    let val = field.text();
    field.empty();
    makeRaceSelect(field, "raceSelect");
    field.find(".raceSelect").last().val(val);
    return field.find(".raceSelect").last();
}

function makeRaceSelect(selector, className){
    selector.append("<select class='" + className + "' name='"+ className +"'></select>").find("."+className).last()
        .append("<option value='HUMAN'>HUMAN</option>")
        .append("<option value='DWARF'>DWARF</option>")
        .append("<option value='ELF'>ELF</option>")
        .append("<option value='GIANT'>GIANT</option>")
        .append("<option value='ORC'>ORC</option>")
        .append("<option value='TROLL'>TROLL</option>")
        .append("<option value='HOBBIT'>HOBBIT</option>");
}

function makeProfessionField(field){
    let val = field.text();
    field.empty();
    makeProfessionSelect(field, "professionSelect");
    field.find(".professionSelect").last().val(val);
    return field.find(".professionSelect").last();
}

function makeProfessionSelect(selector, className){
    selector.append("<select class='" + className + "' name='"+ className +"'></select>").find("."+className).last()
        .append("<option value='WARRIOR'>WARRIOR</option>")
        .append("<option value='ROGUE'>ROGUE</option>")
        .append("<option value='SORCERER'>SORCERER</option>")
        .append("<option value='CLERIC'>CLERIC</option>")
        .append("<option value='PALADIN'>PALADIN</option>")
        .append("<option value='NAZGUL'>NAZGUL</option>")
        .append("<option value='WARLOCK'>WARLOCK</option>")
        .append("<option value='DRUID'>DRUID</option>");
}

function makeBannedField(field){
    let val = field.text();
    field.empty();
    makeBannedSelect(field, "bannedSelect");
    field.find(".bannedSelect").last().val(val);
    return field.find(".bannedSelect").last();
}

function makeBannedSelect(selector, className){
    selector.append("<select class='" + className + "' name='"+ className +"'></select>").find("."+className).last()
        .append("<option>true</option>")
        .append("<option>false</option>");
}

function initForm(){
    let form = $("#createCharacter");
    let id = getFreeId();
    form.empty();
    form.append("<input type='hidden' name='id' value='" + id + "' />");

    form.append("<label for='name'>Name:</label>");
    form.append("<input type='text' name='name' /><br>");

    form.append("<label for='title'>Title:</label>");
    form.append("<input type='text' name='title' /><br>");

    let race = form.append("<label for='race'>Race:</label>");
    makeRaceSelect(race, "race");
    race.append("<br>");

    let profession = form.append("<label for='profession'>Profession:</label>");
    makeProfessionSelect(profession, "profession");
    profession.append("<br>");

    form.append("<label for='birthday'>Birthday:</label>");
    form.append("<input type='date' name='birthday' /><br>");

    let banned = form.append("<label for='banned'>Banned:</label>");
    makeBannedSelect(banned, "banned");
    banned.append("<br>");

    form.append("<label for='level'>Level:</label>");
    form.append("<input type='text' name='level' /><br>");

    form.append("<input type='submit' />")
}

function getFreeId(){
    return 3;
}

function sendData(form){
    let formData = JSON.stringify($(form).serializeArray());
    for()
    console.log("hello");
    console.log(formData);

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "/rest/players/3",
        async: false,
        type: "POST",
        dataType: "json",
        data: formData
    })
}