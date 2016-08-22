//initialize variables
plotCount = 1;
stdPlotOpcacity = $(".divPlotContainer").css("opacity");
dragPlotOpacity = '0.4';
tableSpaceScroll = false;
jobsFolder = "../static/SimSaaS/data/";
jobFileName = "jobOverview.json";
currEvent = 7;
activeEvents = [7];
// eventList = ['Catalunya', 'Monaco','Spielberg', 'Silverstone', 'Budapest', 'Hockenheim', 'Spa', 'Monza',  'Austin'];
eventList = ['Oschersleben', 'Hockenheim I','Spielberg', 'Lausitzring', 'Norisring', 'Zandvoort','Nürburgring', 'Hockenheim II'];
//numRowsT1 = 0;
lapData = [];
simData = {};


// Plotting:
toBePlotted = [];
plotColors = ['#08c1fe','#FF4826','#FFB400','#00FE56','#FF8300'];
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
var sortDirVector_default = [1,1,1,1,1,1,1,1];
var lastSorted;
// var axesVector = ["Lap-time", "Grip", "Wing Pos.", "RH F", "RH R", "SS F", "SS R", "ARB F", "ARB R"];
var axesVector = ["Lap-time", "Grip", "Wing Pos.", "Fuel Load","RH F", "RH R", "ARB F", "ARB R"];

