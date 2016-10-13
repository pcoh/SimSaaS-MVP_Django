$(function() {
    $( "#selectTrackGrip" ).selectmenu();
    $( "#selectWingPos" ).selectmenu();
    $( "#selectFuelLoad" ).selectmenu();    
    $( "#selectRH_Front" ).selectmenu();
    $( "#selectRH_Rear" ).selectmenu();
    // $( "#selectSpringStiff_Front" ).selectmenu();
    // $( "#selectSpringStiff_Rear" ).selectmenu();
    $( "#selectARBStiff_Front" ).selectmenu();
    $( "#selectARBStiff_Rear" ).selectmenu();
    $( "#selectTyrePress_Front" ).selectmenu();
    $( "#selectTyrePress_Rear" ).selectmenu();
    
    $( ".channelSelector" ).selectmenu(
      {height: 255});
    $( "button" )
      .button()
      .click(function( event ) {
        event.preventDefault();
      });
})

function resizeTrackArea() {
  $("#divTrackContainer").height($( window ).height());
}

function resizeWorkSpace() {
	var WSheight = $( window ).height()-$("#divEventBanner").outerHeight(true)*$("#divEventBanner").is(':visible')-$("#navTrackNavBar").outerHeight(false);
	$("#divWorkspaceContainer").outerHeight(WSheight);
  	$("#divTableAndSpacer").width($("#divControlTableRow").width()); 	
}

function positionBG(){
	$('#divWorkspaceContainer').css({'background-position-y': $("#divTableAndSpacer").outerHeight(true)});
}

function resizeSelectMenus(){

    $.each($('select'), function () {
        $(this).selectmenu({ width : $(this).attr("width")})
    })
}

// function setDDOptions(uniqueGrip,uniqueWingPos,uniqueRH_F,uniqueRH_R,uniqueSS_F,uniqueSS_R,uniqueARB_F,uniqueARB_R){
function setDDOptions(uniqueGrip,uniqueWingPos,uniqueFuelLoad, uniqueRH_F,uniqueRH_R,uniqueARB_F,uniqueARB_R,uniqueTyrePres_F,uniqueTyrePres_R){
  // var controlNames = ["selectTrackGrip", "selectWingPos", "selectRH_Front", "selectRH_Rear", "selectSpringStiff_Front","selectSpringStiff_Rear", "selectARBStiff_Front","selectARBStiff_Rear"];
  var controlNames = ["selectTrackGrip", "selectWingPos", "selectFuelLoad", "selectRH_Front", "selectRH_Rear", "selectARBStiff_Front","selectARBStiff_Rear","selectTyrePress_Front","selectTyrePress_Rear"];
  var controlUnits = ["%", "deg","kg","mm","mm", "N/mm", "N/mm", "bar", "bar"];
  for(var j = 0; j<arguments.length; j++){
    var optionsAsString = "";
    uniqueValues = arguments[j];
    for(var i = 0; i < uniqueValues.length; i++) {
      optionsAsString += "<option value='" + i + "'>" + uniqueValues[i] + controlUnits[j]+"</option>";
    }
    $( "#"+controlNames[j]).html( optionsAsString );
    $("#"+controlNames[j]).val(0);
    $("#"+controlNames[j]).selectmenu("refresh");
  }
}

function getAvailChannels(){
  var firstPos = findFirstNull(simData[currEvent].lapData)
  var availChannels = Object.keys(simData[currEvent].lapData[firstPos]);
  return availChannels;
}

function cleanAndSortChannelNames(availChannels){
  var channelOptions = availChannels.slice(0); //slice is necessary to create a copy and not just a new referene to the same array;
  var channelCaptions = [];
  for (var i=0; i<channelOptions.length; i++){
    if (channelOptions[i].indexOf(" ") != -1){
      spaceIndex = channelOptions[i].indexOf(" ");
      channelCaptions[i] = channelOptions[i].substr(0, spaceIndex);
    }else{
      channelCaptions[i] = channelOptions[i];
    }
  }
  
  if(channelCaptions.indexOf("Time") != -1){
    var index = channelCaptions.indexOf("Time");
  }else{
    var index = channelCaptions.indexOf("Lap_Time");
  }
  channelCaptions.splice(index, 1);
  

  if(channelCaptions.indexOf("TRK_Distance") != -1){
    var index = channelCaptions.indexOf("TRK_Distance");
  }else{
    var index = channelCaptions.indexOf("Distance");
  }
  channelCaptions.splice(index, 1);
  
  channelCaptions = channelCaptions.sort();
  return channelCaptions;
}

function assemblePlotSelectOptions(plotCount){
  var openingTags = "<select id=\"selectChannel_"+plotCount+"\" class=\"channelSelector\">";
  var closingTags = "</select>";
  var optionTags = "";
  var availChannels = getAvailChannels();
  var channelOptions = cleanAndSortChannelNames(availChannels);
  for (var i = 1; i< channelOptions.length; i++){
    optionTags = optionTags + "<option>" + channelOptions[i] +"</option>";
  }  
  var plotSelectOptions = openingTags+optionTags+closingTags;

  return plotSelectOptions;
}

function createPlotContainer(plotCount){
  plotSelectOptions = assemblePlotSelectOptions(plotCount);  

	plotContHTML = "<div class=\"col-sm-12 divPlotContainer\" draggable=\"true\"><div class=\"plot\" id=\"plot"+plotCount+"\">"+
	"<div class=\"channelSelectContainer\">"+plotSelectOptions +
    "</div><a href=\"#\"><span class=\"removePlot\"></span></a><div class=\"canvasContainer\">"+
    "<canvas class=\"plotCanvas\" id=\"canvas"+plotCount+"\"></canvas>"+
    "<canvas class=\"cursorCanvas\" id=\"cursorCanvas"+plotCount+"\"></canvas></div></div></div>";

	return plotContHTML;
}

function populatePlot1DD(){
  plotSelectOptions = assemblePlotSelectOptions(plotCount);  
  $("#channelSelectContainer1").html(plotSelectOptions);
  $(".channelSelector" ).selectmenu();
  $('#selectChannel_1').val('CHA_Speed');
  // $('#selectChannel_'+ plotCount).val('Velocity');
  $('#selectChannel_1').selectmenu('refresh');
  $(".channelSelector").on('selectmenuchange',  onChannelSelectorChange);
}

function onChannelSelectorChange(){
  plotData();
}
function smartScroll(scrollPos){
  if ($( window ).innerWidth() >= 1200){
		scrollThresh = $("#divControlTableRow").outerHeight(false)+10;
  }else{
    scrollThresh = $("#divControlTableRow").outerHeight(false)+17;
  }
   		if(scrollPos >= scrollThresh){
   			$("#divTableAndSpacer").addClass('noSeeThrough');
   			if (tableSpaceScroll === false){
	   			var topTarget = $("#divEventBanner").position().top +$("#divEventBanner").outerHeight(true)*$("#divEventBanner").is(':visible')+$(".navbar-header").outerHeight(true)*$(".navbar-header").is(':visible');
	   			$("#divTableAndSpacer").css({ 'top': topTarget});
	   		  	$("#divWorkspaceContainer").scrollTop(scrollPos);
   		   }
   		}else{
		   	$("#divTableAndSpacer").removeClass('noSeeThrough');
			var topTarget = $("#divControlTableRow").offset().top + $("#divControlTableRow").outerHeight(false);
			$("#divTableAndSpacer").css({ 'top': topTarget});
			$("#divWorkspaceContainer").scrollTop(scrollPos);
   		}  		
}

function controlTable2Pos() {	
	$("#divWorkspaceContainer").bind('scroll', function() {
		if (tableSpaceScroll === false){
			scrollPos = $("#divWorkspaceContainer").scrollTop();
		}
		smartScroll(scrollPos);	
	}); 
}

function customScrollBar($event){
  $( ".channelSelector" ).selectmenu( "close" );
  var delay = 1000;
  var timeout = null;
  var targetElement = event.target;      
  $(targetElement).addClass('scrolling');
  clearTimeout(timeout);
  timeout = setTimeout(function(){
    $(targetElement).removeClass('scrolling');
  },delay);
}
