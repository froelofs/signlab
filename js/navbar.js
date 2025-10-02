$(function () {
  var bar = '';
  var hoverTimeout;

  bar += '<nav class="navbar navbar-shrink navbar-expand-lg navbar-light fixed-top" id="mainNav">';
  bar += '<div class="container-fluid" style="width: 83%; margin-top: 0px;">';
  bar += '<a class="navbar-brand" href="index.html">';
  bar += '<img src="images/Xbreed_logo_tr.png" height="25">';
  bar += '</a>';
  bar += '<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">';
  bar += '<i class="fas fa-bars"></i>';
  bar += ' Menu';
  bar += '</button>';
  bar += '<div class="collapse text-right navbar-collapse" style="margin-right:1%" id="navbarResponsive">';
  bar += '<ul class="navbar-nav ml-auto" role="tablist">';
  bar += '<li class="nav-item"><a class="nav-link" href="index.html" id="AboutNav">Welcome</a></li>';
  // Research dropdown
  bar += '<li class="nav-item dropdown">';
  bar += '<a class="nav-link dropdown-toggle" href="#" id="ResearchNav" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Research</a>';
  bar += '<div class="dropdown-menu" aria-labelledby="ResearchNav">';
  bar += '<a class="dropdown-item" href="research-overview.html" id="OverviewNav">Overview</a>';
  bar += '<a class="dropdown-item" href="research-methods.html" id="MethodsNav">New Methods</a>';
  bar += '<a class="dropdown-item" href="research-datasets.html" id="DatasetsNav">Datasets</a>';
  bar += '<a class="dropdown-item" href="research-theory.html" id="TheoryNav">Theory</a>';
  bar += '<a class="dropdown-item" href="research-applications.html" id="ApplicationsNav">Applications</a>';
  bar += '<a class="dropdown-item" href="research-publications.html" id="PublicationsNav">Publications</a>';
  bar += '<a class="dropdown-item" href="research-projects.html" id="ProjectsNav">Projects</a>';
  bar += '</div>';
  bar += '</li>';
  // bar += '<li class="nav-item"><a class="nav-link" href="news.html" id="NewsNav">News</a></li>';
  // Outreach dropdown
  bar += '<li class="nav-item dropdown">';
  bar += '<a class="nav-link dropdown-toggle" href="#" id="OutreachNav" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Outreach</a>';
  bar += '<div class="dropdown-menu" aria-labelledby="OutreachNav">';
  bar += '<a class="dropdown-item" href="outreach-events.html" id="EventsNav">Outreach Events</a>';
  bar += '<a class="dropdown-item" href="outreach-media.html" id="MediaNav">Media</a>';
  bar += '<a class="dropdown-item" href="outreach-signopsis.html" id="SignopsisNav">Signopsis</a>';
  bar += '</div>';
  bar += '</li>';
  bar += '<li class="nav-item"><a class="nav-link" href="people.html" id="PeopleNav">People</a></li>';
    // Nederlands dropdown
  bar += '<li class="nav-item dropdown">';
  bar += "<a class='nav-link dropdown-toggle' href='#' id='NederlandsNav' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Voor NGT'ers</a>";
  bar += '<div class="dropdown-menu" aria-labelledby="NederlandsNav">';
  bar += '<a class="dropdown-item" href="voor-ngt-evenementen.html" id="EvenementenNav">Doe mee!</a>';
  bar += '<a class="dropdown-item" href="voor-ngt-onderzoek.html" id="OnderzoekNav">Samenvattingen in NGT</a>';
  bar += '</div>';
  bar += '</li>';
  bar += '</ul>';
  bar += '</div>';
  bar += '</div>';
  bar += '</nav>';

  $("#nav-placeholder").html(bar);

  // Add hover functionality for dropdowns
$(".nav-item.dropdown").hover(
  function () {
    clearTimeout(hoverTimeout);

    // Close other open dropdowns
    $(".nav-item.dropdown").not(this).removeClass("show").find(".dropdown-menu").removeClass("show");

    // Open current dropdown
    $(this).addClass("show");
    $(this).find(".dropdown-menu").addClass("show");
  },
  function () {
    var that = $(this);
    hoverTimeout = setTimeout(function () {
        that.removeClass("show");
        that.find(".dropdown-menu").removeClass("show");
    }, 200);  // 200ms delay before hiding
  }
);

  // Highlight active page
  var id = getPage();
  console.log("navbar id", id);
  $("#" + id).addClass("active");
});

// Function to determine the active page
function getPage() {
    const allTabs = ['AboutNav', 'ResearchNav', 'PeopleNav', 'OutreachNav', 'NederlandsNav'];
    const sections = [
        'About',
        ['Overview', 'Methods', 'Datasets', 'Theory', 'Applications', 'Publications', 'Projects'], // Research dropdown sections
        'People',
        ['Events', 'Media', 'Signopsis'],
        ['Onderzoek', 'Evenementen']
    ];

    for (let j = 0; j < sections.length; j++) {
        if (Array.isArray(sections[j])) {
            // Check dropdown sections
            for (let k = 0; k < sections[j].length; k++) {
                if (document.getElementById(sections[j][k])) {
                    $("#" + allTabs[j]).addClass("active");
                    $("#" + sections[j][k] + "Nav").addClass("active");
                    return allTabs[j];
                }
            }
        } else if (document.getElementById(sections[j])) {
            return allTabs[j];
        }
    }
}

// Function to get the NavBar height for the sticky text
function adjustStickyOffset() {
  var navbarHeight = $('#mainNav').outerHeight();
  
  // Set CSS variable on <body> or root element
  document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
  
  // Alternatively, update top style on sticky elements directly
  $('.sticky-top').css('top', navbarHeight + 'px');
}

// Run on page load
$(document).ready(function(){
  adjustStickyOffset();
});

// Run on window resize to adapt to height changes
$(window).resize(function(){
  adjustStickyOffset();
});