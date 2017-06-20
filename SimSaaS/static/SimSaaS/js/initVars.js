//initialize variables
plotCount = 1;
// firstLapSim = [true,true,true,true,true,true,true,true];
stdPlotOpcacity = $(".divPlotContainer").css("opacity");
dragPlotOpacity = '0.4';
tableSpaceScroll = false;
// jobsFolder = "../static/SimSaaS/data/"; //Development
// jobsFolder = "../../static/data/";	//Production 
// jobFileName = "jobOverview.json";
currEvent = 8;
activeEvents = [7,8];

//numRowsT1 = 0;
lapData = [];
simData = {};
dlStatus = [];


// Plotting:
toBePlotted = [];
plotColors = ['#08c1fe','#FF4826','#FFB400','#00FE56','#ff6c00', '#ff00ff', '#186f2a', '#0000ff', '#be9262', '#eb1350'];
colorOccupation = [0,0,0,0,0,0,0,0,0,0];
axisColor = '#FFF';
tickMarkColor = '#FFF'
acceptableTickInts = [0.001, 0.005, 0.01, 0.05,0.1,0.25,0.5,1,2,5,10,25,50,100,250,500,1000,2500,5000];
tickLength = 8;
tickLabelFont="12px Arial";
tickLabelColor = '#FFF'
cursorLabelFont="14px Arial";


// Sorting:
var sortAxis = 'Lap-time';
var sortDir = 1;
var initialSort = 1;
// var sortDirVector_default = [1,1,1,1,1,1,1,1,1];
var sortDirVector_default = [1,1,1,1,1,1,1,1,1,1];
var lastSorted;
var axesVector = ["Lap-time", "Grip", "Wing Pos.", "Fuel Load","RH F", "RH R", "ARB F", "ARB R","Press F","Press R"];

