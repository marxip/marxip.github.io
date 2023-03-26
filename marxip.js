function openTab(evt, expOrHab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(expOrHab).style.display = "block";
    evt.currentTarget.className += " active";
}

function darkModo() {
    var element = document.body;
    element.classList.toggle("dark-modo");
}

