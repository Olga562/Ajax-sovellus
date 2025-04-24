document.addEventListener("DOMContentLoaded", function () {
    haeTeatterit();

    document.getElementById("theatre").addEventListener("change", haePaivamaarat);
    document.querySelector(".loadFilms").addEventListener("click", haeElokuvat);
});

//hae tetterit
function haeTeatterit(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.finnkino.fi/xml/TheatreAreas/', true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var data = xhr.responseXML;
            var allTheatres = data.getElementsByTagName("TheatreArea");

            var theatres = document.getElementById("theatre");

            for(var i=2; i<allTheatres.length; i++){
              var option = document.createElement("option");
              option.value  = allTheatres[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
              option.text  = allTheatres[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
              
              theatres.appendChild(option);
            }
        }
    };

}

//hae päivämäärät valitulle teatterille
function haePaivamaarat(){
    var theatreID = document.getElementById("theatre").value;
    var dateSelect = document.getElementById("date");

    dateSelect.innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.finnkino.fi/xml/ScheduleDates/?area=' + theatreID, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status ===200){
            var data = xhr.responseXML;
            var allDates = data.getElementsByTagName("dateTime");

            for(var i = 0; i < allDates.length; i++){
                var option = document.createElement("option");
                var date = allDates[i].textContent.split("T")[0];
                option.value = date;
                option.text = new Date(date).toLocaleDateString("fi-FI", { weekday: 'long', day: 'numeric', month: 'long' });

                dateSelect.appendChild(option);
            }
        }
    };
}

// haetaan elokuvat 
function haeElokuvat(){
    var theatreID = document.getElementById("theatre").value;
    var date = document.getElementById("date").value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.finnkino.fi/xml/Schedule/?area=' + theatreID + date, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var data = xhr.responseXML;
            var allShows = data.getElementsByTagName("Show");

            var indicators = document.getElementById("carousel-indicators");
            var carouselInner = document.getElementById("carousel-inner");

            indicators.innerHTML = "";
            carouselInner.innerHTML = "";

            for(var i = 0; i < allShows.length; i++){
                var title = allShows[i].getElementsByTagName("Title")[0].textContent;
                var image = allShows[i].getElementsByTagName("EventLargeImagePortrait")[0].textContent;
                var startTimeRaw = allShows[i].getElementsByTagName("dttmShowStart")[0].textContent;
                var startTime = new Date(startTimeRaw).toLocaleTimeString("fi-FI", {
                    hour: "2-digit",
                    minute: "2-digit"
                });

                var indicator = document.createElement("button");
                indicator.setAttribute("type", "button");
                indicator.setAttribute("data-bs-target", "#movieCarousel");
                indicator.setAttribute("data-bs-slide-to", i);
                if (i === 0) indicator.classList.add("active");
                indicators.appendChild(indicator);

                // Luo karusellin item
                var item = document.createElement("div");
                item.classList.add("carousel-item");
                if (i === 0) item.classList.add("active");
                var synopsisElement = allShows[i].getElementsByTagName("ShortSynopsis")[0];
                var synopsis = synopsisElement ? synopsisElement.textContent : "Ei kuvausta saatavilla";

                item.innerHTML = `
                    <div class="position-relative">
                        <img class="d-block w-100 rounded shadow-lg" src="${image}" alt="${title}" style="object-fit: cover; height: 500px;">
                        <div class="carousel-overlay position-absolute bottom-0 start-0 end-0 p-3 text-white bg-gradient">
                            <h5 class="mb-1">${title}</h5>
                            <p class="synopsis-text mb-0">Näytös alkaa klo ${startTime}</p>
                        </div>
                    </div>
                `;

                carouselInner.appendChild(item);
            }
        }
    }
}