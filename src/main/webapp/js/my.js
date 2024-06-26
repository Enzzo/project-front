$(document).ready(function() {

    showPage(getActivePage());
    initForm()

    let rows = $("#rowsCount");
    rows.change(function () {
        let total = pagesTotal();
        let active = getActivePage();
        let page = Math.min(total-1, active);
        //---------------------------------------------------
        showPage(page);
    });

    $("#createButton").click(function(){
        $(this).hide();
        $("#createCharacterForm").show();
    })
    $("#sendButton").click(function(){
        sendData($("#createCharacterForm"));
    })
    $("#cancelButton").click(function(){
        $("#createCharacterForm").hide();
        $("#createButton").show();
    })
})

//  +-----------------------------------------------------------------------+
//  |   getPlayers(rows, page)                                              |
//  +-----------------------------------------------------------------------+
//  |   rows - максимальное количество рядов для отображения в таблице      |
//  |   page - номер страницы, которую необходимо отобразить                |
//  +-----------------------------------------------------------------------+
//  |   Получает GET с url /rest/players и                                  |
//  |   возвращает полученные данные                                        |
//  +-----------------------------------------------------------------------+
function getPlayers(rows, page){
    let url = "/rest/players?pageSize=" + rows + "&pageNumber=" + page;
    let getData = null;
    $.ajax({
        method: "GET",
        async: false,
        url: url,
        success: function(data){
            getData = data;
        }
    })
    return getData;
}

//  +-----------------------------------------------------------------------+
//  |   redrawTable()                                                       |
//  +-----------------------------------------------------------------------+
//  |   Перерисовывает таблицу, на основе данных, хранящихся в data         |
//  +-----------------------------------------------------------------------+
function redrawTable(data){
    let tbody = $("#mainTable").find("tbody").last();
    tbody.empty();

    for(let i = 0; i < data.length; i++){
        let row = tbody.append("<tr></tr>").find("tr").last();
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

//  +-----------------------------------------------------------------------+
//  |   redrawNavPages()                                                    |
//  +-----------------------------------------------------------------------+
//  |   Перерисовывает навиганионную панель                                 |
//  +-----------------------------------------------------------------------+
function redrawNavPages(pages){
    let list = $("#pagination");
    list.empty();
    for(let i = 0; i < pages; ++i){
        let li = list.append("<li>"+(i+1)+"</li>").find("li").last();
        li.on("click", function(){
            let page = $(this).text()-1;
            let rows = getRowsCount();
            let playersData = getPlayers(rows, page);
            redrawTable(playersData);
            setActivePage(page);
        });
    }
}

//  +-----------------------------------------------------------------------+
//  |   getRowsCount()                                                      |
//  +-----------------------------------------------------------------------+
//  |   Возвращает значение селектора #rowsCount                            |
//  +-----------------------------------------------------------------------+
//  |   Максимальное количество рядов для отображения в таблице             |
//  +-----------------------------------------------------------------------+
function getRowsCount(){
    return $("#rowsCount").val();
}

//  +-----------------------------------------------------------------------+
//  |   getPlayersCount()                                                   |
//  +-----------------------------------------------------------------------+
//  |   Возвращает общее количество аккаунтов в базе данных                 |
//  +-----------------------------------------------------------------------+
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

//  +-----------------------------------------------------------------------+
//  |   pagesTotal()                                                        |
//  +-----------------------------------------------------------------------+
//  |   Возвращает количество страниц для отображения по формуле:           |
//  |   PlayersCount / RowsCount, где                                       |
//  |   PlayersCount    - общее количество игроков в базе данных            |
//  |   RowsCount       - количество рядов для отображения в таблице        |
//  +-----------------------------------------------------------------------+
function pagesTotal(){
    return Math.ceil(getPlayersCount() / getRowsCount());
}

//  +-----------------------------------------------------------------------+
//  |   showPage()                                                          |
//  +-----------------------------------------------------------------------+
//  |   Показывает выбранную страницу.                                      |
//  +-----------------------------------------------------------------------+
function showPage(page){
    let rows = getRowsCount();
    let playersData = getPlayers(rows, page);
    redrawTable(playersData);
    redrawNavPages(pagesTotal());
    setActivePage(page);
}

//  +-----------------------------------------------------------------------+
//  |   setActivePage()                                                     |
//  +-----------------------------------------------------------------------+
//  |   Выделяет выбранную страницу.                                        |
//  |   Задаёт идентфикатор 'active' выбранной странице                     |
//  +-----------------------------------------------------------------------+
function setActivePage(page) {
    let list = $("#pagination");
    list.find("li").removeAttr("id");
    list.find("li").eq(page).attr("id", "active");
}

//  +-----------------------------------------------------------------------+
//  |   deleteRequest(id)                                                   |
//  +-----------------------------------------------------------------------+
//  |   id - идентификатор аккаунта                                         |
//  +-----------------------------------------------------------------------+
//  |   Запрос на удаление аккаунта по id                                   |
//  +-----------------------------------------------------------------------+
//  |   После успешного удаления обновляет табличное представление          |
//  +-----------------------------------------------------------------------+
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

//  +-----------------------------------------------------------------------+
//  |   getActivePage()                                                     |
//  +-----------------------------------------------------------------------+
//  |   Возвращает номер активной страницы                                  |
//  +-----------------------------------------------------------------------+
//  |   В селекторе #pagination находит элемент с id='active' и возвращает  |
//  |   его значение - 1                                                    |
//  |   Если #active не существует, то функция возвращает 0                 |
//  +-----------------------------------------------------------------------+
function getActivePage(){
    return Math.max(0, $("#pagination").find("#active").text()-1);
}

function getLastPage(){
    let lastPage = $("#pagination li").length;
    return lastPage;
}

//  +-----------------------------------------------------------------------+
//  |   editRow(row)                                                        |
//  +-----------------------------------------------------------------------+
//  |   row - ряд, который будем редактировать                              |
//  +-----------------------------------------------------------------------+
//  |   делает редактируемыми ячейки:                                       |
//  |   "name", "title", "race", "profession", "banned"                     |
//  +-----------------------------------------------------------------------+
//  |   при нажатии на кнопку "edit" выполняется POST на                    |
//  |   url "/rest/players/{id};                                            |
//  +-----------------------------------------------------------------------+
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

        let sendData =JSON.stringify({name, title, race, profession, banned});
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: postUrl,
            async: false,
            type: "POST",
            dataType: "json",
            data: sendData,
            success:  function() {
                showPage(getActivePage());
            }
        })
    });
    row.find(".delete").last().css("display", "none");
}

//  +-----------------------------------------------------------------------+
//  |   makeRaceField()                                                     |
//  +-----------------------------------------------------------------------+
function makeRaceField(field){
    let val = field.text();
    field.empty();
    makeRaceSelect(field, "raceSelect");
    field.find(".raceSelect").last().val(val);
    return field.find(".raceSelect").last();
}

//  +-----------------------------------------------------------------------+
//  |   makeRaceSelect()                                                    |
//  +-----------------------------------------------------------------------+
function makeRaceSelect(selector, className){
    selector.append("<select id='" + className + "' class='" + className + "' name='"+ className +"'></select>").find("."+className).last()
        .append("<option value='HUMAN'>HUMAN</option>")
        .append("<option value='DWARF'>DWARF</option>")
        .append("<option value='ELF'>ELF</option>")
        .append("<option value='GIANT'>GIANT</option>")
        .append("<option value='ORC'>ORC</option>")
        .append("<option value='TROLL'>TROLL</option>")
        .append("<option value='HOBBIT'>HOBBIT</option>");
}

//  +-----------------------------------------------------------------------+
//  |   makeProfessionField()                                               |
//  +-----------------------------------------------------------------------+
function makeProfessionField(field){
    let val = field.text();
    field.empty();
    makeProfessionSelect(field, "professionSelect");
    field.find(".professionSelect").last().val(val);
    return field.find(".professionSelect").last();
}

//  +-----------------------------------------------------------------------+
//  |   makeProfessionSelect()                                              |
//  +-----------------------------------------------------------------------+
function makeProfessionSelect(selector, className){
    selector.append("<select id='" + className + "' class='" + className + "' name='"+ className +"'></select>").find("."+className).last()
        .append("<option value='WARRIOR'>WARRIOR</option>")
        .append("<option value='ROGUE'>ROGUE</option>")
        .append("<option value='SORCERER'>SORCERER</option>")
        .append("<option value='CLERIC'>CLERIC</option>")
        .append("<option value='PALADIN'>PALADIN</option>")
        .append("<option value='NAZGUL'>NAZGUL</option>")
        .append("<option value='WARLOCK'>WARLOCK</option>")
        .append("<option value='DRUID'>DRUID</option>");
}

//  +-----------------------------------------------------------------------+
//  |   makeBannedField()                                                   |
//  +-----------------------------------------------------------------------+
function makeBannedField(field){
    let val = field.text();
    field.empty();
    makeBannedSelect(field, "bannedSelect");
    field.find(".bannedSelect").last().val(val);
    return field.find(".bannedSelect").last();
}

//  +-----------------------------------------------------------------------+
//  |   makeBannedSelect()                                                  |
//  +-----------------------------------------------------------------------+
function makeBannedSelect(selector, className){
    selector.append("<select id='" + className + "' class='" + className + "' name='"+ className +"'></select>").find("."+className).last()
        .append("<option>true</option>")
        .append("<option selected='selected'>false</option>");
}

//  +-----------------------------------------------------------------------+
//  |   initForm()                                                          |
//  +-----------------------------------------------------------------------+
function initForm(){
    let form = $("#createCharacterForm");
    form.empty();
    form.append("<h2>Create new account:</h2>");

    form.append("<label for='name'>Name:</label>");
    form.append("<input id='nameField' type='text' name='name' minlength='1' maxlength='12' /><br>");

    form.append("<label for='title'>Title:</label>");
    form.append("<input id='titleField' type='text' name='title' minlength='1' maxlength='30' /><br>");

    let race = form.append("<label for='race'>Race:</label>");
    makeRaceSelect(race, "raceField");
    race.append("<br>");

    let profession = form.append("<label for='profession'>Profession:</label>");
    makeProfessionSelect(profession, "professionField");
    profession.append("<br>");

    form.append("<label for='birthday'>Birthday:</label>");
    form.append("<input id='birthdayField' type='date' name='birthday' /><br>");

    let banned = form.append("<label for='banned'>Banned:</label>");
    makeBannedSelect(banned, "bannedField");
    banned.append("<br>");

    form.append("<label for='level'>Level:</label>");
    form.append("<input id='levelField' type='number' name='level' min='1' max='100'/><br>");

    form.append("<input type='button' id='sendButton' value='Save' />");
    form.append("<input type='button' id='cancelButton' value='Cancel' />")

    form.hide();
}

//  +-----------------------------------------------------------------------+
//  |   sendData()                                                          |
//  +-----------------------------------------------------------------------+
function sendData(form){
    let data = $(form).serializeArray();
    let name = data[0].value;
    let title =  data[1].value;
    let race =  data[2].value;
    let profession =  data[3].value;
    let birthday =  new Date(data[4].value).getTime();
    let banned = data[5].value;
    let level =  data[6].value;

    let sendData = JSON.stringify({name, title, race, profession, birthday, banned, level});
    $.ajax({
        url: "/rest/players",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: sendData,
        success: function(){
            for(let v in data){
                v.value = "";
            }
            redrawNavPages(pagesTotal());
            let page = getLastPage()-1;
            showPage(page);
        }
    })
}