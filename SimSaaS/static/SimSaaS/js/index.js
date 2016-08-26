//Utils:
function unique(list) {
  var result = [];
  $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
}
function secondsTimeSpanToHMSH(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    var H = Math.floor(s%1 *100);
    s = Math.floor(s);
    if (h==0){
      return m +":"+(s < 10 ? '0'+s : s)+"."+(H < 10 ? '0'+H : H);
    }else{
      return h+":" +(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s)+"."+(H < 10 ? '0'+H : H);
    }
}

function findFirstNull(obj) {
    // var len = Object.keys(obj).length;
    var jobLen = jobData_parsed[0].length;
    for (var i=0; i<jobLen; i++) {
        if (obj[i] !== null && obj[i] !== undefined) {
            return i;
        }
    }
    return null;
}


function arrayDiff(a, b) {
  return a.filter( 
    function(el) {
      return b.indexOf(el) < 0;
    }
  );
}
//----------------------------------------------------------

function buildEventControls(){
  for (var i=0; i<eventList.length; i++){
    var eventHTML = "<div class=\"eventSelector\" id=\"event"+(i+1)+"\">Round "+(i+1)+"<div class=\"divtrackName hidden-sm \">"+eventList[i]+"</div></div>"
    $("#divTrackContainer").append(eventHTML);
    var eventMenuHTML = "<li class=\"liEventSelector\" id=\"liEvent"+(i+1)+"\"><a href=\"#\">Round "+ (i+1)+" - "+eventList[i]+"</a></li>";
    $("#ulEventsList").append(eventMenuHTML);
  }
  $('.eventSelector').on('click', eventSelectorClick );
  $('.liEventSelector').on('click', eventSelectorClick );
}

function eventSelectorClick(){
  if ($(this).hasClass("liEventSelector")){
    var clickedEvent = parseInt($(this).attr("id").replace("liEvent",""));
    $(".navbar-collapse").collapse('hide');
    $(".navbar-header").children("button").click();
  }else{
    var clickedEvent = parseInt($(this).attr("id").replace("event",""));
  }
  if($.inArray(clickedEvent, activeEvents) != -1){ 
    $(".navbar-collapse").collapse('hide');
    $('#simButton').button('disable');
    $('.eventSelector').removeClass('activeEvent')
    if($(this).attr("class")=='eventSelector'){    
      currEvent = parseInt($(this).attr("id").replace("event",""));
    }else if($(this).attr("class")=='liEventSelector'){
      currEvent = parseInt($(this).attr("id").replace("liEvent",""));
      // $(".navbar-header").children("button").click();
    }
    $('#event'+currEvent).addClass('activeEvent');
    ga('send', {
      hitType: 'event',
      eventCategory: 'Simulation',
      eventAction: 'Select Event',
      eventLabel: currEvent
    }); 
    
    var jobPath = jobsFolder+(currEvent < 10 ? '0'+currEvent : currEvent)+'/'+jobFileName;
    readJobData(jobPath);
    sortedLapIDs = sortTable1Contents(sortAxis, sortDir);
    fillTable1(sortedLapIDs);
    getLapsToBePlotted();
    fillTable2();
    plotData();

    $('#eventHeadline').html(currEvent + ' - '+ eventList[currEvent-1]);
    $('#navBarEventHeadline ').html(currEvent + ' - '+ eventList[currEvent-1]);
  }else{
    
    $( "#eventNotAvail" )
      .html("<p>"+eventList[clickedEvent-1]+" is currently inactive. It will become available closer to the date of the race.</p>")
      .dialog({modal: true});
  }
}

function readJobData(jobPath){
    $.getJSON(jobPath, getJasonCallback);
}

function getJasonCallback(data){
  var jobData = data;
  var size = Object.keys(jobData).length;
  var jobLapNum = [], jobLapNames = [], jobGrips = [], jobWingPositions = [], jobFuelLoads = [], jobRideHeights_F = [], jobRideHeights_R = [], jobSpringStiffnesses_F = [], jobSpringStiffnesses_R = [], jobARBStiffnesses_F = [], jobARBStiffnesses_R = [];
  
  for (var i=0; i<size; i++){
    jobLapNum[i] = [i+1];
    jobLapNames[i] = jobData[i+1].FileName;
    jobGrips[i] = jobData[i+1]["General_Parameters.Overall_Grip_[%]"];
    jobWingPositions[i] = jobData[i+1]["General_Parameters.Rear_Wing_Position_[deg]"];
    jobFuelLoads[i] = jobData[i+1]["Initialization.FuelLoad_[kg]"];
    jobRideHeights_F[i] = jobData[i+1]["Initialization.Ride_Height.RideHeight_FL_Garage_[mm]"];
    jobRideHeights_R[i] = jobData[i+1]["Initialization.Ride_Height.RideHeight_RR_Garage_[mm]"];
    // jobSpringStiffnesses_F[i] = jobData[i+1]["Spring.FL.Spring_Force_Gradient_[N/mm]"];
    // jobSpringStiffnesses_R[i] = jobData[i+1]["Spring.RL.Spring_Force_Gradient_[N/mm]"];
    jobARBStiffnesses_F[i] = jobData[i+1]["Anti_Roll_Bar.Front.Characteristics_Linear.ARB_Stiffness_[N/mm]"];
    jobARBStiffnesses_R[i] = jobData[i+1]["Anti_Roll_Bar.Rear.Chararcteristics_Linear.ARB_Stiffness_[N/mm]"];
  }
  // extractVarParams(jobGrips,jobWingPositions, jobRideHeights_F,jobRideHeights_R,jobSpringStiffnesses_F,jobSpringStiffnesses_R,jobARBStiffnesses_F,jobARBStiffnesses_R); 
  extractVarParams(jobGrips,jobWingPositions, jobFuelLoads,jobRideHeights_F,jobRideHeights_R,jobARBStiffnesses_F,jobARBStiffnesses_R); 
 
  // window.jobData_parsed = [jobLapNum,jobLapNames, jobGrips,jobWingPositions,jobRideHeights_F,jobRideHeights_R,jobSpringStiffnesses_F,jobSpringStiffnesses_R,jobARBStiffnesses_F,jobARBStiffnesses_R];
  window.jobData_parsed = [jobLapNum,jobLapNames, jobGrips,jobWingPositions,jobFuelLoads, jobRideHeights_F,jobRideHeights_R,jobARBStiffnesses_F,jobARBStiffnesses_R];
  $('#simButton').button('enable');
}

// function extractVarParams(jobGrips,jobWingPositions, jobRideHeights_F,jobRideHeights_R,jobSpringStiffnesses_F,jobSpringStiffnesses_R,jobARBStiffnesses_F,jobARBStiffnesses_R){
  function extractVarParams(jobGrips,jobWingPositions, jobFuelLoads,jobRideHeights_F,jobRideHeights_R,jobARBStiffnesses_F,jobARBStiffnesses_R){
  window.uniqueGrip = unique( jobGrips );
  window.uniqueWingPos = unique( jobWingPositions );
  window.uniqueFuelLoad = unique( jobFuelLoads );
  window.uniqueRH_F = unique( jobRideHeights_F );
  window.uniqueRH_R = unique( jobRideHeights_R );
  // window.uniqueSS_F = unique( jobSpringStiffnesses_F );
  // window.uniqueSS_R = unique( jobSpringStiffnesses_R );
  window.uniqueARB_F = unique( jobARBStiffnesses_F );
  window.uniqueARB_R = unique( jobARBStiffnesses_R );
  // setDDOptions(uniqueGrip,uniqueWingPos,uniqueRH_F,uniqueRH_R,uniqueSS_F,uniqueSS_R,uniqueARB_F,uniqueARB_R);
  setDDOptions(uniqueGrip,uniqueWingPos,uniqueFuelLoad, uniqueRH_F,uniqueRH_R,uniqueARB_F,uniqueARB_R);
};

function getSimSettings(){
  var demTrackGrip = uniqueGrip[$( "#selectTrackGrip").val()];
  var demWingPos = uniqueWingPos[$( "#selectWingPos").val()];
  var demRH_F = uniqueRH_F[$( "#selectRH_Front").val()];
  var demRH_R = uniqueRH_R[$( "#selectRH_Rear").val()];
  var demFuelLoad = uniqueFuelLoad[$( "#selectFuelLoad").val()];
  // var demSS_F = uniqueSS_F[$( "#selectSpringStiff_Front").val()];
  // var demSS_R = uniqueSS_R[$( "#selectSpringStiff_Rear").val()];
  var demARBStiff_F = uniqueARB_F[$( "#selectARBStiff_Front").val()];
  var demARBStiff_R = uniqueARB_R[$( "#selectARBStiff_Rear").val()];

  // var demandSettings = [demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R];
  var demandSettings = [demTrackGrip, demWingPos, demFuelLoad, demRH_F, demRH_R, demARBStiff_F, demARBStiff_R];

  // getLapID(demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R);
  getLapID(demTrackGrip, demWingPos, demFuelLoad, demRH_F, demRH_R, demARBStiff_F, demARBStiff_R);
}

// getLapID = function(demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R){
getLapID = function(demTrackGrip, demWingPos, demFuelLoad, demRH_F, demRH_R, demARBStiff_F, demARBStiff_R){  
  //lapID = [];
  for(var i=0;i<jobData_parsed[0].length;i++){
    // currTrackGrip = jobData_parsed[2][i];
    // currWingPos = jobData_parsed[3][i];
    // currRH_F = jobData_parsed[4][i];
    // currRH_R = jobData_parsed[5][i];
    // currSS_F = jobData_parsed[6][i];
    // currSS_R = jobData_parsed[7][i];
    // currARB_F = jobData_parsed[8][i];
    // currARB_R = jobData_parsed[9][i];

    currTrackGrip = jobData_parsed[2][i];
    currWingPos = jobData_parsed[3][i];
    currFuelLoad = jobData_parsed[4][i];
    currRH_F = jobData_parsed[5][i];
    currRH_R = jobData_parsed[6][i];
    currARB_F = jobData_parsed[7][i];
    currARB_R = jobData_parsed[8][i];


    // if( currTrackGrip == demTrackGrip &&  currWingPos == demWingPos && currRH_F == demRH_F && currRH_R == demRH_R && currSS_F == demSS_F && currSS_R == demSS_R && currARB_F == demARBStiff_F && currARB_R == demARBStiff_R){   
    //   lapID = jobData_parsed[0][i][0];
    // }
   
    if( currTrackGrip == demTrackGrip &&  currWingPos == demWingPos && currFuelLoad == demFuelLoad && currRH_F == demRH_F && currRH_R == demRH_R && currARB_F == demARBStiff_F && currARB_R == demARBStiff_R){   
      lapID = jobData_parsed[0][i][0];
    }
     
  }
  
  //addLapToTable1(lapID,demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R);
  sortedLapIDs = sortTable1Contents(sortAxis, sortDir);
  if(!simData.hasOwnProperty(currEvent)){
    simData[currEvent]= {};
  }
  if(!simData[currEvent].hasOwnProperty('table1Object')){
    simData[currEvent].table1Object=[];
  }
  if(!simData[currEvent].table1Object.hasOwnProperty(lapID)){
    simData[currEvent].table1Object[lapID] = {};
  }
  
  if(simData[currEvent].hasOwnProperty('lapData')){
    if(simData[currEvent].lapData.hasOwnProperty(lapID-1)){
      $( "#alreadySimulated" )
        .html("<p>A lap with these settings has already been simulated.</p>")
        .dialog({modal: true});
    }else{
      // sortedLapIDs = addLapToTable1Object(sortedLapIDs,lapID,demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R);
      sortedLapIDs = addLapToTable1Object(sortedLapIDs,lapID,demTrackGrip, demWingPos, demFuelLoad, demRH_F, demRH_R, demARBStiff_F, demARBStiff_R);
      fillTable1(sortedLapIDs);
      calcProgress(lapID); 
      loadLapData(lapID);  
    }
  }else{
    // sortedLapIDs = addLapToTable1Object(sortedLapIDs,lapID,demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R);
    sortedLapIDs = addLapToTable1Object(sortedLapIDs,lapID,demTrackGrip, demWingPos, demFuelLoad, demRH_F, demRH_R, demARBStiff_F, demARBStiff_R);
    fillTable1(sortedLapIDs);
    calcProgress(lapID); 
    loadLapData(lapID);  
  }
}

// function addLapToTable1Object(sortedLapIDs,lapID,demTrackGrip, demWingPos, demRH_F, demRH_R, demSS_F, demSS_R, demARBStiff_F, demARBStiff_R){
function addLapToTable1Object(sortedLapIDs,lapID,demTrackGrip, demWingPos, demFuelLoad, demRH_F, demRH_R, demARBStiff_F, demARBStiff_R){  

  simData[currEvent].table1Object[lapID].lapID = lapID;
  simData[currEvent].table1Object[lapID].demTrackGrip = demTrackGrip;
  simData[currEvent].table1Object[lapID].demWingPos = demWingPos;
  simData[currEvent].table1Object[lapID].demFuelLoad = demFuelLoad;
  simData[currEvent].table1Object[lapID].demRH_F = demRH_F;
  simData[currEvent].table1Object[lapID].demRH_R = demRH_R;
  // simData[currEvent].table1Object[lapID].demSS_F = demSS_F;
  // simData[currEvent].table1Object[lapID].demSS_R = demSS_R;
  simData[currEvent].table1Object[lapID].demARBStiff_F = demARBStiff_F;
  simData[currEvent].table1Object[lapID].demARBStiff_R = demARBStiff_R;
  simData[currEvent].table1Object[lapID].plotted = false;
  
  sortedLapIDs.push(lapID);

  return sortedLapIDs;
}

function sortTable1Contents(sortAxis, sortDir){
  var sortedLapIDs = [];
  if(simData.hasOwnProperty(currEvent)){
    if(simData[currEvent].hasOwnProperty('table1Object')){
      var sortVector = [];
      for(var i=0;i<Object.keys(simData[currEvent].table1Object).length;i++){
        sortVector.push(i);
      }
      
      var sortedArray = simData[currEvent].table1Object.slice();      
      switch(sortAxis){
        case "Lap-time":        
        sortedArray.sort(function (a, b) {
            a = parseFloat(a.lapTime_s),
            b = parseFloat(b.lapTime_s);          
            return a - b;
          });

          break;
        case "Grip":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demTrackGrip),
            b = parseFloat(b.demTrackGrip);          
            return a - b;
          });
        break;
        case "Wing Pos.":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demWingPos),
            b = parseFloat(b.demWingPos);          
            return a - b;
          });
          break;
        case "Fuel Load":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demFuelLoad),
            b = parseFloat(b.demFuelLoad );          
            return a - b;
          });
          break;
        case "RH F":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demRH_F),
            b = parseFloat(b.demRH_F);          
            return a - b;
          });
          break;
        case "RH R":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demRH_R),
            b = parseFloat(b.demRH_R);          
            return a - b;
          });
          break;
        // case "SS F":
        //   sortedArray.sort(function (a, b) {
        //     a = parseFloat(a.demSS_F),
        //     b = parseFloat(b.demSS_F);          
        //     return a - b;
        //   });
        //   break;
        // case "SS R": 
        //   sortedArray.sort(function (a, b) {
        //     a = parseFloat(a.demSS_R),
        //     b = parseFloat(b.demSS_R);          
        //     return a - b;
        //   });
        //   break;
        case "ARB F":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demARBStiff_F),
            b = parseFloat(b.demARBStiff_F);          
            return a - b;
          });
          break;
        case "ARB R":
          sortedArray.sort(function (a, b) {
            a = parseFloat(a.demARBStiff_R),
            b = parseFloat(b.demARBStiff_R);          
            return a - b;
          });
          break;        
      }

      if(sortDir == -1){
        sortedArray.reverse();
      }
      
      for (var i=0; i<sortedArray.length; i++){
        if (sortedArray[i] != null){
          sortedLapIDs.push(sortedArray[i].lapID); 
        }
      }
      
    }    
  }
  return sortedLapIDs;
}

function fillTable1(sortedLapIDs){
  $("#rowContainer1").html("");
  if(simData.hasOwnProperty(currEvent)){
    if(simData[currEvent].hasOwnProperty('table1Object')){
      for(var i=0;i<sortedLapIDs.length;i++){
        var currLapID =  sortedLapIDs[i];  
        if (i %2 !=0){
          var rowType = "evenRow";
        }else{
          var rowType = "oddRow"
        }
        // var lapHTML = "<div id=\"lapRow"+currLapID+ "\" class=\"lapRow " +rowType + "\"><span class=\"cell setCell\"></span><span id=\"plotCell"+currLapID+ "\" class=\"cell plotCell loading\"></span><span class=\"cell lapTimeCell\"><div class=\"progressBG\"><div class=\"progressVal\" id=\"progress"+currLapID+"\"></div></div></span>"+
        //               "<span class=\"cell trackGripCell\">"+simData[currEvent].table1Object[currLapID].demTrackGrip+"%</span><span class=\"cell wingPosCell\">"+simData[currEvent].table1Object[currLapID].demWingPos+"</span><span class=\"cell RHF_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_F+"mm</span><span class=\"cell RHR_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_R+"mm</span>" +
        //               "<span class=\"cell SSF_Cell\">"+simData[currEvent].table1Object[currLapID].demSS_F+"N/mm</span><span class=\"cell SSR_Cell\">"+simData[currEvent].table1Object[currLapID].demSS_R+"N/mm</span><span class=\"cell ARBF_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_F+"N/mm</span><span class=\"cell ARBR_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_R+"N/mm</span>" +
        //               "<span class=\"cell downloadCell\"></span><span class=\"cell deleteCell loading rightMost\"></span></div>";

        var lapHTML = "<div id=\"lapRow"+currLapID+ "\" class=\"lapRow " +rowType + "\"><span class=\"cell setCell\"></span><span id=\"plotCell"+currLapID+ "\" class=\"cell plotCell loading\"></span><span class=\"cell lapTimeCell\"><div class=\"progressBG\"><div class=\"progressVal\" id=\"progress"+currLapID+"\"></div></div></span>"+
                      "<span class=\"cell trackGripCell\">"+simData[currEvent].table1Object[currLapID].demTrackGrip+"%</span><span class=\"cell wingPosCell\">"+simData[currEvent].table1Object[currLapID].demWingPos+"deg</span></span><span class=\"cell fuelLoadCell\">"+simData[currEvent].table1Object[currLapID].demFuelLoad+"kg</span><span class=\"cell RHF_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_F+"mm</span><span class=\"cell RHR_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_R+"mm</span>" +
                      "<span class=\"cell ARBF_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_F+"N/mm</span><span class=\"cell ARBR_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_R+"N/mm</span>" +
                      "<span class=\"cell downloadCell loading\"></span><span class=\"cell deleteCell loading rightMost\"></span></div>";

        $("#rowContainer1").append(lapHTML); 

        if(simData[currEvent].table1Object[currLapID].hasOwnProperty('lapTime')){
          $("#lapRow"+currLapID).children('.lapTimeCell').html(simData[currEvent].table1Object[currLapID].lapTime);
          $("#lapRow"+currLapID).children(".plotCell").removeClass("loading").on('click',  clickPlotButton);
          $("#lapRow"+currLapID).children(".deleteCell").removeClass("loading").on('click',  clickDeleteButton);
          $("#lapRow"+currLapID).children(".setCell").on('click',  clickSetButton);
          $("#lapRow"+currLapID).children(".downloadCell").removeClass("loading").on('click', clickDownloadButton);
        }
        if(simData[currEvent].table1Object[currLapID].plotted == true){
          $("#plotCell"+currLapID).addClass('plotted');
        }        
      }
    }
  }
}

function fillTable2(){
  $("#rowContainer2").html("");
  if(simData.hasOwnProperty(currEvent)){
    if(simData[currEvent].hasOwnProperty('table1Object')){
      var u = 0;
      for(var i=0;i<Object.keys(simData[currEvent].table1Object).length;i++){
        var currLapID =  Object.keys(simData[currEvent].table1Object)[i]; 
        if(simData[currEvent].table1Object[currLapID].plotted == true){
          if (u %2 !=0){
            var rowType = "evenRow";
          }else{
            var rowType = "oddRow"
          }
          // var lapHTML = "<div id=\"plotRow"+currLapID+ "\" class=\"plotRow " +rowType + "\"><span id=\"removeCell"+currLapID+ "\" class=\"cell removeCell\"></span><span class=\"cell lapTimeCell\">"+simData[currEvent].table1Object[currLapID].lapTime+"</span>"+
          //               "<span class=\"cell trackGripCell\">"+simData[currEvent].table1Object[currLapID].demTrackGrip+"%</span><span class=\"cell wingPosCell\">"+simData[currEvent].table1Object[currLapID].demWingPos+"</span><span class=\"cell RHF_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_F+"mm</span><span class=\"cell RHR_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_R+"mm</span>" +
          //               "<span class=\"cell SSF_Cell\">"+simData[currEvent].table1Object[currLapID].demSS_F+"N/mm</span><span class=\"cell SSR_Cell\">"+simData[currEvent].table1Object[currLapID].demSS_R+"N/mm</span><span class=\"cell ARBF_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_F+"N/mm</span><span class=\"cell ARBR_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_R+"N/mm</span>" +
          //               "<span class=\"cell colorCell rightMost\"><div class=\"colorSample\"></div></span></div>";

          var lapHTML = "<div id=\"plotRow"+currLapID+ "\" class=\"plotRow " +rowType + "\"><span id=\"removeCell"+currLapID+ "\" class=\"cell removeCell\"></span><span class=\"cell lapTimeCell\">"+simData[currEvent].table1Object[currLapID].lapTime+"</span>"+
                        "<span class=\"cell trackGripCell\">"+simData[currEvent].table1Object[currLapID].demTrackGrip+"%</span><span class=\"cell wingPosCell\">"+simData[currEvent].table1Object[currLapID].demWingPos+"deg</span><span class=\"cell fuelLoadCell\">"+simData[currEvent].table1Object[currLapID].demFuelLoad+"kg</span><span class=\"cell RHF_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_F+"mm</span><span class=\"cell RHR_Cell\">"+simData[currEvent].table1Object[currLapID].demRH_R+"mm</span>" +
                        "<span class=\"cell ARBF_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_F+"N/mm</span><span class=\"cell ARBR_Cell\">"+simData[currEvent].table1Object[currLapID].demARBStiff_R+"N/mm</span>" +
                        "<span class=\"cell colorCell rightMost\"><div class=\"colorSample\"></div></span></div>";
          $("#rowContainer2").append(lapHTML); 
          $("#plotRow"+currLapID).children(".removeCell").on('click',  clickPlotButton);
          plotColor = simData[currEvent].table1Object[currLapID].plotColor;
          $("#plotRow"+currLapID).children(".colorCell").children(".colorSample").css({'background-color': plotColors[u]});
          u++;
        }
      }
      reStyleRows('#rowContainer2','.plotRow');
    }
  }
}

calcProgress = function(lapID){
  var simDur = 500;
  var endTime = $.now()+simDur; 
  updateProgress(endTime,simDur,lapID);
}
function updateProgress(endTime,simDur,lapID) {
  remainTime = endTime - $.now();
  var progress = Math.min(100,(simDur - remainTime)/simDur *100);
  $("#progress"+lapID).width(progress +"%");
  if (remainTime >0 || dlStatus[lapID] != 1){      
    setTimeout(function () {
      //recall the parent function to create a recursive loop.
      updateProgress(endTime,simDur,lapID);
  }, 500);
  }else{
    // $("#lapRow"+lapID).children(".plotCell").removeClass("loading").on('click',  clickPlotButton);
    // $("#lapRow"+lapID).children(".deleteCell").removeClass("loading").on('click',  clickDeleteButton);
    $("#lapRow"+lapID).children(".setCell").on('click',  clickSetButton);
    

    // var currLT = simData[currEvent].lapData[lapID-1].FIELD1[simData[currEvent].lapData[lapID-1].FIELD1.length-1];
    var currLT = simData[currEvent].lapData[lapID-1]["Time [s]"][simData[currEvent].lapData[lapID-1]["Time [s]"].length-1];

    var LT_HMSH = secondsTimeSpanToHMSH(currLT);
    simData[currEvent].table1Object[lapID].lapTime_s = currLT;
    simData[currEvent].table1Object[lapID].lapTime = LT_HMSH;

    sortedLapIDs = sortTable1Contents(sortAxis, sortDir);
    fillTable1(sortedLapIDs);
    populatePlot1DD(); 
    $("#lapRow"+lapID).addClass('movedRow').delay(2000).queue(function(next){
      $(this).removeClass('movedRow');
      next();
    });
    $("#lapRow"+lapID).children(".lapTimeCell").html(LT_HMSH);
    return;
  }
} 

function clickSetButton(){
  ga('send', {
    hitType: 'event',
    eventCategory: 'Simulation',
    eventAction: 'Set Current Setup',
    eventLabel: ''
  });
  var activeTrackGrip = $(this).parent().children(".trackGripCell").html().match(/\d+/);  
  var activeWingPos = $(this).parent().children(".wingPosCell").html().match(/\d+/);
  var activeFuelLoad = $(this).parent().children(".fuelLoadCell").html().match(/\d+/);
  var activeRH_F = $(this).parent().children(".RHF_Cell").html().match(/\d+/);
  var activeRH_R = $(this).parent().children(".RHR_Cell").html().match(/\d+/);
  // var activeSS_F = $(this).parent().children(".SSF_Cell").html().match(/\d+/);
  // var activeSS_R = $(this).parent().children(".SSR_Cell").html().match(/\d+/);
  var activeARB_F = $(this).parent().children(".ARBF_Cell").html().match(/\d+/);
  var activeARB_R = $(this).parent().children(".ARBR_Cell").html().match(/\d+/);

  var highLightDuration = 500;

  var optionIndex = uniqueGrip.indexOf(parseInt(activeTrackGrip));
  $('#selectTrackGrip').val(optionIndex).selectmenu("refresh");
  $("#selectTrackGrip-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

  var optionIndex = uniqueWingPos.indexOf(parseInt(activeWingPos));
  $('#selectWingPos').val(optionIndex).selectmenu("refresh");
  $("#selectWingPos-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

  var optionIndex = uniqueFuelLoad.indexOf(parseInt(activeFuelLoad));
  $('#selectFuelLoad').val(optionIndex).selectmenu("refresh");
  $("#selectFuelLoad-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

  var optionIndex = uniqueRH_F.indexOf(parseInt(activeRH_F));
  $('#selectRH_Front').val(optionIndex).selectmenu("refresh");
  $("#selectRH_Front-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

  var optionIndex = uniqueRH_R.indexOf(parseInt(activeRH_R));
  $('#selectRH_Rear').val(optionIndex).selectmenu("refresh");
  $("#selectRH_Rear-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

  // var optionIndex = uniqueSS_F.indexOf(parseInt(activeSS_F));
  // $('#selectSpringStiff_Front').val(optionIndex).selectmenu("refresh");
  // $("#selectSpringStiff_Front-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
  //   $(this).removeClass("autoChange");
  //   next();
  // });

  // var optionIndex = uniqueSS_R.indexOf(parseInt(activeSS_R));
  // $('#selectSpringStiff_Rear').val(optionIndex).selectmenu("refresh");
  // $("#selectSpringStiff_Rear-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
  //   $(this).removeClass("autoChange");
  //   next();
  // });

  var optionIndex = uniqueARB_F.indexOf(parseInt(activeARB_F));
  $('#selectARBStiff_Front').val(optionIndex).selectmenu("refresh");
  $("#selectARBStiff_Front-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

  var optionIndex = uniqueARB_R.indexOf(parseInt(activeARB_R));
  $('#selectARBStiff_Rear').val(optionIndex).selectmenu("refresh");
  $("#selectARBStiff_Rear-button").addClass("autoChange").delay(highLightDuration).queue(function(next){
    $(this).removeClass("autoChange");
    next();
  });

}

function clickDeleteButton(){  
  ga('send', {
    hitType: 'event',
    eventCategory: 'Analysis',
    eventAction: 'Delete Lap',
    eventLabel: ''
  });
  // delete lapID from toBePlotted
  var lapID = parseInt($(this).parent().attr("id").replace("lapRow",""));

  //if ($.inArray(lapID, toBePlotted) != -1){
  delete simData[currEvent].table1Object[lapID];
  delete simData[currEvent].lapData[lapID -1];
  getLapsToBePlotted();
  fillTable2();
  $(this).parent().remove();
  plotData();
  reStyleRows('#rowContainer1','.lapRow');
  //}  
}

function clickRemoveButton(){  
  ga('send', {
    hitType: 'event',
    eventCategory: 'Analysis',
    eventAction: 'Remove Lap',
    eventLabel: ''
  });
  var lapID = parseInt($(this).parent().attr("id").replace("lapRow",""));
  
  $("#plotCell"+lapID).click();
}
function clickDownloadButton(){
  var lapID = parseInt($(this).parent().attr("id").replace("lapRow",""))
  var dlData = simData[currEvent].lapData[lapID-1];

  var header = []
  for (var i=0; i<Object.keys(dlData).length; i++){
    header[i] = Object.keys(dlData)[i];
  }
  var header = ["\""+header.join("\",\"")+"\"\n"];
  var data = [header];
  
  for (var i=0;i<dlData[Object.keys(dlData)[0]].length; i++){
    dataRow =[];
    for (var j=0; j<Object.keys(dlData).length; j++){
      dataRow[j] = dlData[Object.keys(dlData)[j]][i];
    }
    dataRow = ["\""+dataRow.join("\",\"")+"\"\n"];
    data.push(dataRow);
  }

  
  var suggestName = "SimResults_"+eventList[currEvent-1]+".csv";

  // var file = new File( data, suggestName, {type: "text/plain;charset=utf-8"});
  var file = new File( data, suggestName, {type: "text/csv;charset=windows-1252;"});
  saveAs(file);
}



function countTableRows(containerSelector, rowSelector){
  numRows  = $(containerSelector).children(rowSelector).length;
  return numRows;
}


function reStyleRows(containerSelector, rowSelector){
  var numRows = countTableRows(containerSelector, rowSelector);
  for (var i=0;i<numRows; i++){
    var currRow = $(containerSelector).children(rowSelector)[i];
    $(currRow).removeClass("evenRow");
    $(currRow).removeClass("oddRow");
    if (i%2 == 0){
      $(currRow).addClass("oddRow");
    }else{
      $(currRow).addClass("evenRow");
    }
  }
  if (rowSelector == '.plotRow'){
    for (var i = 0; i<toBePlotted.length; i++){
      var plotColor = simData[currEvent].table1Object[toBePlotted[i]].plotColor;
      $("#plotRow"+toBePlotted[i]).children(".colorCell").children(".colorSample").css({'background-color': plotColor});    
    }
  }

}
  
