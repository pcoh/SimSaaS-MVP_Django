function loadLapData(lapID){
	var lapName = jobData_parsed[1][lapID-1];
	var filePath = jobsFolder+(currEvent < 10 ? '0'+currEvent : currEvent)+'/'+lapName+".json";
	// $.getJSON( "../static/SimSaaS/data/"+(currEvent < 10 ? '0'+currEvent : currEvent)+'/'+lapName +".json", lapID, createCallback(lapID));
	// $.getJSON( "../static/SimSaaS/data/"+(currEvent < 10 ? '0'+currEvent : currEvent)+'/'+lapName +".json", lapID, createCallback(lapID));
	 $.getJSON(filePath, lapID, createCallback(lapID));
}

// function loadLapCallback( data ) {
// 	if(!simData.hasOwnProperty(currEvent)){
// 		simData[currEvent]= {};
// 	}
// 	if(!simData[currEvent].hasOwnProperty('lapData')){
// 		simData[currEvent].lapData={};
// 	}
// 	window.simData[currEvent].lapData[lapID-1] = data;
// 	alert('dunzo!');
// }


function createCallback(lapID) {
	
   	return function(data) {
   		console.log("done");
    	if(!simData.hasOwnProperty(currEvent)){
			simData[currEvent]= {};
		}
		if(!simData[currEvent].hasOwnProperty('lapData')){
			simData[currEvent].lapData={};
		}
		window.simData[currEvent].lapData[lapID-1] = data;
		//alert('dunzo!');
      // This reference to the `item` parameter does create a closure on it.
      // However, its scope means that no caller function can change its value.
      // Thus, since we don't change `item` anywhere inside `createCallback`, it
      // will have the value as it was at the time the createCallback function
      // was invoked.
   };
 }
