var selectedRow = null;
var formData;

function Pager(tableName, itemsPerPage) {
    'use strict';

    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;

    this.showRecords = function (from, to) {
        let rows = document.getElementById(tableName).rows;

        // i starts from 1 to skip table header row
        for (let i = 1; i < rows.length; i++) {
            if (i < from || i > to) {
                rows[i].style.display = 'none';
            } else {
                rows[i].style.display = '';
            }
        }
    };

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            // Not initialized
            return;
        }

        let oldPageAnchor = document.getElementById('pg' + this.currentPage);
        oldPageAnchor.className = 'pg-normal';

        this.currentPage = pageNumber;
        let newPageAnchor = document.getElementById('pg' + this.currentPage);
        newPageAnchor.className = 'pg-selected';

        let from = (pageNumber - 1) * itemsPerPage + 1;
        let to = from + itemsPerPage - 1;
        this.showRecords(from, to);

        let pgNext = document.querySelector('.pg-next'),
            pgPrev = document.querySelector('.pg-prev');

        if (this.currentPage == this.pages && pgNext) {
            pgNext.style.display = 'none';
        } else {
            if (pgNext) {
                pgNext.style.display = '';
            }
        }

        if (this.currentPage === 1) {
            pgPrev.style.display = 'none';
        } else {
            pgPrev.style.display = '';
        }
    };

    this.prev = function () {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    };

    this.next = function () {
        if (this.currentPage < this.pages) {
            this.showPage(this.currentPage + 1);
        }
    };

    this.init = function () {
        let rows = document.getElementById(tableName).rows;
        let records = (rows.length - 1);

        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    };

    this.showPageNav = function (pagerName, positionId) {
        if (!this.inited) {
            // Not initialized
            return;
        }

        let element = document.getElementById(positionId),
            pagerHtml = '<span onclick="' + pagerName + '.prev();" class="pg-normal pg-prev">&#171;</span>';

        for (let page = 1; page <= this.pages; page++) {
            pagerHtml += '<span id="pg' + page + '" class="pg-normal pg-next" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span>';
        }

        pagerHtml += '<span onclick="' + pagerName + '.next();" class="pg-normal">&#187;</span>';

        element.innerHTML = pagerHtml;
    };
}


function CreateRecord() {
    var employeeData = {
        "jobTitleName": createRecordForm.jobTitleName.value,
        "firstName": createRecordForm.firstName.value,
        "lastName": createRecordForm.lastName.value,
        "preferredFullName": createRecordForm.firstName.value + createRecordForm.lastName.value,
        "employeeCode": createRecordForm.EM.value,
        "region": createRecordForm.region.value,
        "dob": createRecordForm.dob.value,
        "phoneNumber": createRecordForm.phoneNumber.value,
        "emailAddress": createRecordForm.emailAddress.value
    }

    fetch('https://5ed8babb4378690016c6a4ea.mockapi.io/api/employees/', {
            method: 'post',
            mode: "cors",
            body: JSON.stringify(employeeData),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }

        })
        .then(r => r.json())
        .then(function (response) {
            viewJson = response;
            document.getElementById('myModal').style.display = "block";
            document.getElementsByClassName('modal-title')[0].innerText = "Create Employee"


        })
        .catch(function (error) {
            console.log(error)

        });

    createTable();
}



function clearForm() {
    document.getElementById("createRecordForm").reset();
    selectedRow = null;
}

function editRecord(td) {
    rowToEdit = td.parentElement.parentElement.parentElement;
    var idToEdit = rowToEdit.rowIndex
    fetch('https://5ed8babb4378690016c6a4ea.mockapi.io/api/employees/' + idToEdit, {
            method: 'get',
            mode: "cors",
        })
        .then(r => r.json())
        .then(function (response) {
            viewJson = response;
            document.getElementById('myModal').style.display = "block";
            document.getElementsByClassName('modal-title')[0].innerText = "Edit Employee"

            if (createRecordForm) {
                document.querySelector('.viewDetaisLeft').style.display = "none"
                document.querySelector('.viewDetaisRight').style.display = "none"
                createRecordForm.style.display = "block";
                createRecordForm.firstName.value = viewJson.firstName
                createRecordForm.lastName.value = viewJson.lastName
                createRecordForm.emailAddress.value = viewJson.emailAddress
                createRecordForm.EM.value = viewJson.employeeCode
                createRecordForm.phoneNumber.value = viewJson.phoneNumber
                createRecordForm.region.value = viewJson.region
                createRecordForm.dob.value = viewJson.dob
                createRecordForm.jobTitleName.value = viewJson.jobTitleName
            }

        })
        .catch(function (error) {
            console.log(error)

        });

    document.getElementById("modalButton").value = "Update";
    if (createRecordForm) {
        createRecordForm.onsubmit = function () {
            updateRecord(idToEdit)
        };
    }
}


function updateRecord(idToEdit) {
    var employeeData = {
        "jobTitleName": createRecordForm.jobTitleName.value,
        "firstName": createRecordForm.firstName.value,
        "lastName": createRecordForm.lastName.value,
        "preferredFullName": createRecordForm.firstName.value + createRecordForm.lastName.value,
        "employeeCode": createRecordForm.EM.value,
        "region": createRecordForm.region.value,
        "dob": createRecordForm.dob.value,
        "phoneNumber": createRecordForm.phoneNumber.value,
        "emailAddress": createRecordForm.emailAddress.value
    }
    fetch('https://5ed8babb4378690016c6a4ea.mockapi.io/api/employees/' + idToEdit, {
            method: 'put',
            mode: "cors",
            body: JSON.stringify(employeeData),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }

        })
        .then(r => r.json())
        .then(function (response) {
            createTable();

        })
        .catch(function (error) {
            console.log(error)

        });
}


function deleteRecord(td) {
    rowToDelete = td.parentElement.parentElement.parentElement;
    var idToDelete = rowToDelete.rowIndex
    fetch('https://5ed8babb4378690016c6a4ea.mockapi.io/api/employees/' + idToDelete, {
            method: 'delete',
            mode: "cors",
        })
        .then(function () {
            document.getElementById("sortable").deleteRow(rowToDelete.rowIndex);
        })
        .catch(function (error) {
            console.log(error)

        });

    clearForm();
}

function viewRecord(td) {
    rowToView = td.parentElement.parentElement.parentElement;
    var idToView = rowToView.rowIndex
    fetch('https://5ed8babb4378690016c6a4ea.mockapi.io/api/employees/' + idToView, {
            method: 'get',
            mode: "cors",
        })
        .then(r => r.json())
        .then(function (response) {
            viewJson = response;
            document.getElementById('myModal').style.display = "block";
            document.querySelector('div.modal-header > h4').innerText = "EM" + viewJson.employeeCode
            document.querySelector('div.modal-header > h4').innerText += "\n" + viewJson.firstName + viewJson.lastName
            document.querySelector('div.modal-header > h4').appendChild(document.createElement('hr'))
            if (createRecordForm) {
                createRecordForm.style.display = "none";
                document.querySelector('.viewDetaisLeft').style.display = "inline-block"
                document.querySelector('.viewDetaisRight').style.display = "inline-block"
                var viewDetaisRightElements = document.querySelectorAll('.viewDetaisRight p');
                viewDetaisRightElements[0].innerText = viewJson.firstName + viewJson.lastName
                viewDetaisRightElements[1].innerText = "EM" + viewJson.employeeCode
                viewDetaisRightElements[2].innerText = viewJson.jobTitleName
                viewDetaisRightElements[3].innerText = viewJson.phoneNumber
                viewDetaisRightElements[4].innerText = viewJson.emailAddress
                viewDetaisRightElements[5].innerText = viewJson.region
                viewDetaisRightElements[6].innerText = viewJson.dob

            }

        })
        .catch(function (error) {
            console.log(error)

        });

    clearForm();
}

function filterTable() {
    let dropdown, table, rows, cells, filterData, filter;
    dropdown = document.querySelector(".select-table-filter");
    table = document.getElementById("sortable");
    rows = table.getElementsByTagName("tr");
    filter = dropdown.value;
    for (let row of rows) {
        cells = row.getElementsByTagName("td");
        filterData = cells[1] || null;
        if (filter === "All" || !filterData || (filter === filterData.textContent)) {
            row.style.display = "";
            row.style.display = "none";
        }
    }
}

function searchRecord() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("sortable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}

function validateMailId() {
    let mail = document.getElementById("mailId").value;
    let atposition = mail.indexOf("@");
    let dotposition = mail.lastIndexOf(".");
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= mail.length) {
        alert("Please enter a valid e-mail address");
        document.getElementById("mailId").focus();
        return false
    }
    return true;
}



var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
    document.getElementById("modalButton").value = "Create";
    document.querySelector('.modal-title').innerText = "Create Employee"

    clearForm();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function createTable() {
    var divId = 'dynamic-table';
    var div = document.getElementById(divId);

    div.innerHTML = '<span class="loading">Loading...</span>';

    setTimeout(() => {
        div.innerHTML = '';

        var tableId = 'sortable';
        fetch('https://5ed8babb4378690016c6a4ea.mockapi.io/api/employees/', {
                method: 'get',
                mode: "cors",
            })
            .then(r => r.json())
            .then(function (response) {
                window.json = response

                var table = new DynamicTable(tableId, window.json);
                div.appendChild(table);

                new SortableTable(tableId);

            })
            .catch(function (error) {
                console.log(error)

            });

    }, 500);
}

function createTableWithData() {
    var divId = 'dynamic-table';
    var div = document.getElementById(divId);

    div.innerHTML = '<span class="loading">Loading...</span>';

    setTimeout(() => {
        div.innerHTML = '';

        var tableId = 'sortable';

        try {
            json = JSON.parse(json);

            if (json.length > 0) {
                var table = new DynamicTable(tableId, json);
                // table.className = "pagination";
                tableId.pagecount = "3"
                div.appendChild(table);

                new SortableTable(tableId);
            } else {
                div.innerHTML = 'Empty collection of data detected';
            }
        } catch (error) {
            div.innerHTML = 'Invalid data. Please validate your data first.';
        }
    }, 100);
}

window.onload = function () {
    createTable();
};


// Sort helper
function sortFn(a, b) {
    if (a.value < b.value) {
        return -1;
    }

    if (a.value > b.value) {
        return 1;
    }

    return 0;
}

// Sort the list
function sortList(list, direction) {
    var sorted = list.sort(sortFn);

    if (direction === -1) {
        list.reverse();
    }

    return sorted;
}

// Event triggered on heading anchor click (which will trigger the sort)
function onHeadigClick(that, cellIndex) {
    return function () {
        that.sortColumn(this, cellIndex);

        return false;
    };
}

// Create anchor for each th
function createAnchor(html, index) {
    var a = document.createElement('a');
    a.href = '#';
    a.innerHTML = html;
    a.onclick = onHeadigClick(this, index);

    return a;
}



/**
 * Solution for task A. Generate a table with dymanic headers based on the data
 * @param {string} id the id the table will have
 * @param {array} data json data
 *
 * @return {HTMLElement} resulting table
 */
function DynamicTable(tableId, data) {
    var headings = data.reduce(function (result, item) {
        var item_headings = Object.keys(item);

        item_headings.forEach(function (heading) {
            if (result.indexOf(heading) === -1) {
                result.push(heading);
            }
        });

        return result;
    }, []);

    var table = document.createElement('table');
    var thead = document.createElement('thead');

    var tbody = document.createElement('tbody');
    var thead_tr = document.createElement('tr');

    headings.forEach(function (heading) {
        // if (!((heading == "lastName") || (heading == "firstName"))) {
        var cell = document.createElement('th');
        cell.className = "ascendent_sort "
        cell.innerHTML = heading;

        thead_tr.appendChild(cell);
        // }

    });


    // thead +=  '<th><a href="#">Action</a></th>'
    data.forEach(function (item) {
        var tbody_tr = document.createElement('tr');

        headings.forEach(function (heading) {
            // if (((heading == "lastName") || (heading == "firstName"))) {
            //     heading = "Fullname"
            //     var cell = document.createElement('td');
            //     cell.innerHTML = item[heading] || '';
            //     tbody_tr.appendChild(cell);
            // }
            // else {
            var cell = document.createElement('td');
            cell.innerHTML = item[heading] || '';
            tbody_tr.appendChild(cell);
            // }
        });
        document.createElement
        tbody_tr.innerHTML += '<div class="dropdown"> <span class="dot"></span><span class="dot"></span><span class="dot"></span><div class="dropdown-content">  <a onclick="viewRecord(this)">View</a>    <a onclick="editRecord(this)">Edit</a> <a onclick="deleteRecord(this)">Delete</a> </div> </div>';

        tbody.appendChild(tbody_tr);
    });



    thead.appendChild(thead_tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    table.id = tableId;

    return table;
}



function SortableTable(id) {

    window.pages = new Pager('sortable', 10);
    window.pages.init();
    window.pages.showPageNav('pages', 'pageNavPosition');
    window.pages.showPage(1);

    this.table = document.getElementById(id);
    this.lastSortedTh = null;

    if (this.table && this.table.nodeName === 'TABLE') {
        var headings = this.table.tHead.rows[0].cells;

        Object.assign([], headings).forEach(
            function (heading, index) {
                if (heading.className.match(/ascendent_sort|descendent_sort/)) {
                    this.lastSortedTh = heading;
                }
            }.bind(this),
        );

        this.setTableSortable();


    }
}

SortableTable.prototype.setTableSortable = function () {
    var headings = this.table.tHead.rows[0].cells;

    Object.assign([], headings).forEach(
        function (heading, index) {
            var sortAnchor = createAnchor.bind(this);
            var html = heading.innerHTML;
            heading.innerHTML = '';
            heading.appendChild(sortAnchor(html, index));
        }.bind(this),
    );
};

SortableTable.prototype.sortColumn = function (el, cellIndex) {
    var tBody = this.table.tBodies[0];
    var rows = this.table.rows;
    var th = el.parentNode;
    var list = [];

    Object.assign([], rows).forEach(function (row, index) {
        if (index > 0) {
            var cell = row.cells[cellIndex];
            var content = cell.textContent || cell.innerText;

            list.push({
                value: content,
                row: row,
            });
        }
    });

    var hasAscendentClassName = th.className.match('ascendent_sort');
    var hasDescendentClassName = th.className.match('descendent_sort');

    list = sortList(list, hasAscendentClassName ? -1 : 1);

    if (hasAscendentClassName) {
        th.className = th.className.replace(/ascendent_sort/, 'descendent_sort');
    } else {
        if (hasDescendentClassName) {
            th.className = th.className.replace(/descendent_sort/, 'ascendent_sort');
        } else {
            th.className += 'ascendent_sort';
        }
    }




    if (this.lastSortedTh && th !== this.lastSortedTh) {
        this.lastSortedTh.className = this.lastSortedTh.className.replace(
            /descendent_sort|ascendent_sort/g,
            '',
        );
    }

    this.lastSortedTh = th;

    list.forEach(function (item, index) {
        tBody.appendChild(item.row);
    });
};


var perPage = 5;

function genTables() {
    var tables = document.querySelectorAll(".pagination");
    for (var i = 0; i < tables.length; i++) {
        perPage = parseInt(tables[i].dataset.pagecount);
        createFooters(tables[i]);
        createTableMeta(tables[i]);
        loadTable(tables[i]);
    }
}


function loadTable(table) {
    var startIndex = 0;

    if (table.querySelector('th'))
        startIndex = 1;

    console.log(startIndex);

    var start = (parseInt(table.dataset.currentpage) * table.dataset.pagecount) + startIndex;
    var end = start + parseInt(table.dataset.pagecount);
    var rows = table.rows;

    for (var x = startIndex; x < rows.length; x++) {
        if (x < start || x >= end)
            rows[x].classList.add("inactive");
        else
            rows[x].classList.remove("inactive");
    }
}

function createTableMeta(table) {
    table.dataset.currentpage = "0";
}

function createFooters(table) {
    var hasHeader = false;
    if (table.querySelector('th'))
        hasHeader = true;

    var rows = table.rows.length;

    if (hasHeader)
        rows = rows - 1;

    var numPages = rows / perPage;
    var pages = document.createElement("div");

    // add an extra page, if we're 
    if (numPages % 1 > 0)
        numPages = Math.floor(numPages) + 1;

    pages.className = "pages";
    for (var i = 0; i < numPages; i++) {
        var page = document.createElement("div");
        page.innerHTML = i + 1;
        page.className = "pages-item";
        page.dataset.index = i;

        if (i == 0)
            page.classList.add("selected");

        page.addEventListener('click', function () {
            var parent = this.parentNode;
            var items = parent.querySelectorAll(".pages-item");
            for (var x = 0; x < items.length; x++) {
                items[x].classList.remove("selected");
            }
            this.classList.add('selected');
            table.dataset.currentpage = this.dataset.index;
            loadTable(table);
        });
        pages.appendChild(page);
    }

    // insert page at the top of the table
    table.parentNode.insertBefore(pages, table);
}

window.addEventListener('load', function () {
    genTables();
});