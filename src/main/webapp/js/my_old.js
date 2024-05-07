function loadTable(){
    let table = initTable();
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(this.responseText);
            fillTable(obj);
        }
    }
    xhttp.open("GET", "/rest/players", true);
    xhttp.send();
}

function fillTable(data){
    let table = initTable();
    // let table = document.getElementById("mainTable");
    let body = table.getElementsByTagName("tbody")[0];
    if(body == null){
        body = table.appendChild(document.createElement("tbody"));
    }

    // sort by id in descending order
    data.sort(function(a, b){
        return b.id - a.id;
    })

    // fill the table with data
    data.forEach(function(player){
        let row = body.insertRow(0);
        row.insertCell(0).innerHTML = player.id;
        row.insertCell(1).innerHTML = player.name;
        row.insertCell(2).innerHTML = player.title;
        row.insertCell(3).innerHTML = player.race;
        row.insertCell(4).innerHTML = player.profession;
        row.insertCell(5).innerHTML = player.level;
        row.insertCell(6).innerHTML = player.birthday;
        row.insertCell(7).innerHTML = player.banned;
    })
}

// init the header of the table
function initTable(){
    let table = document.getElementById("mainTable");
    let head = table.getElementsByTagName("thead")[0];
    if(head == null){
        head = table.appendChild(document.createElement("thead"));
        let row = head.insertRow(0);
        row.insertCell(0).outerHTML = "<th>#</th>";
        row.insertCell(1).outerHTML = "<th>Name</th>";
        row.insertCell(2).outerHTML = "<th>Title</th>";
        row.insertCell(3).outerHTML = "<th>Race</th>";
        row.insertCell(4).outerHTML = "<th>Profession</th>";
        row.insertCell(5).outerHTML = "<th>Level</th>";
        row.insertCell(6).outerHTML = "<th>Birthday</th>";
        row.insertCell(7).outerHTML = "<th>Banned</th>";
    }
    return table;
}

