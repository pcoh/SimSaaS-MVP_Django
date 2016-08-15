$( document ).ready(function() {
  $('#simButton').button('disable');
  buildEventControls();
    
  // $('#liEvent'+currEvent).click();
  $('#event'+currEvent).click();

  resizeTrackArea();
  resizeWorkSpace();
  $("#divControlTableRow").css({ 'margin-bottom': $("#divTableAndSpacer").outerHeight(true)});
  $("#divTableAndSpacer").css({ 'top': $("#divControlTableRow").offset().top + $("#divControlTableRow").outerHeight(false)});
  controlTable2Pos();
  positionBG();
  
});

$( window ).resize(function() {
	resizeTrackArea();
	resizeWorkSpace();
  scrollPos = $("#divWorkspaceContainer").scrollTop();
  smartScroll(scrollPos); 
  positionBG();
  resizeSelectMenus();
  plotData();
  console.log(window.innerWidth )
})

$('#divTrackContainer').scroll(function(event) {
  customScrollBar(event);      
});
$('#table1ContentScroller').scroll(function(event) {
  customScrollBar(event);      
});
$('#divTable1Container').scroll(function(event) {
  customScrollBar(event);      
});  
$('#divTable2Container').scroll(function(event) {
  customScrollBar(event);      
});   
$('#divWorkspaceContainer').scroll(function(event) {
  customScrollBar(event);      
});  

$('#divTableAndSpacer').on('mousewheel',function(event) {
  wheel = event.originalEvent.wheelDeltaY;
  scrollPos = $("#divWorkspaceContainer").scrollTop()-wheel;
  tableSpaceScroll = true;        
  $('#divWorkspaceContainer').scroll( );
  tableSpaceScroll = false;
});

$('#simButton').on('click',  function() {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'simulate',
    eventLabel: ''
  });
  getSimSettings();
   // loadLapData(); 
});

$('.addPlot').on('click',  function() {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Analysis',
    eventAction: 'Add Plot',
    eventLabel: ''
  });
  plotCount = plotCount +1;
	plotContHTML = createPlotContainer(plotCount);  

	$( plotContHTML ).insertBefore( $(this).parent()).slideDown();
  
  $( ".channelSelector" ).selectmenu();
  
	addListenerToPlots();	
  $(".channelSelector").on('selectmenuchange',  onChannelSelectorChange);  
  plotData();
});

$('#divWorkspaceContainer').on('click', 'div a .removePlot', function() {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Analysis',
    eventAction: 'Remove Plot',
    eventLabel: ''
  });
	$(this).parent().parent().slideUp(400, function() {
		$(this).parent().remove();
	});
	addListenerToPlots();
	//plotCount = plotCount -1;
});


$( ".tableHeader.sortable" ).click(function() { 
  sortAxis = (this.innerHTML);
  ga('send', {
    hitType: 'event',
    eventCategory: 'Analysis',
    eventAction: 'Sort Table',
    eventLabel: sortAxis
  }); 
  if(lastSorted == sortAxis){
    sortDir = sortDirVector[axesVector.indexOf(sortAxis)]*-1;
    sortDirVector = sortDirVector_default.slice(0);
    sortDirVector[axesVector.indexOf(sortAxis)] = sortDir;
  }else{
    sortDirVector = sortDirVector_default.slice(0);
    sortDir = sortDirVector[axesVector.indexOf(sortAxis)];        
  }
  $( ".tableHeader" ).removeClass("sortAsc");
  $( ".tableHeader" ).removeClass("sortDesc");
  if (sortDir == 1){
   $(this).addClass("sortAsc");
  }else{
   $(this).addClass("sortDesc") 
  }
  lastSorted = sortAxis;
  $( ".diamondRow" ).remove();
  
  sortedLapIDs = sortTable1Contents(sortAxis, sortDir);
  fillTable1(sortedLapIDs);
  
});

$('.collapse').on('show.bs.collapse', function(e) { 
  $("#table2").hide();
});
$('.collapse').on('shown.bs.collapse', function(e) { 
  smartScroll($("#divWorkspaceContainer").scrollTop());
  $("#table2").show(); 
});
$('.collapse').on('hide.bs.collapse', function(e) {
  $("#table2").hide(); 
});
$('.collapse').on('hidden.bs.collapse', function(e) {
  smartScroll($("#divWorkspaceContainer").scrollTop());
  $("#table2").show(); 
});

$('#selectTrackGrip').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "Grip"
  }); 
});
$('#selectWingPos').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "Wing Position"
  }); 
});
$('#selectRH_Front').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "RideHeight Front"
  }); 
});
$('#selectRH_Rear').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "RideHeight Rear"
  }); 
});
$('#selectSpringStiff_Front').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "SpringStiffness Front"
  }); 
});
$('#selectSpringStiff_Rear').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "SpringStiffness Rear"
  }); 
});
$('#selectARBStiff_Front').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "ARB Stiffness Front"
  }); 
});
$('#selectARBStiff_Rear').on('selectmenuchange', function() {
   ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Change Setup',
    eventLabel: "ARB Stiffness Rear"
  }); 
});
