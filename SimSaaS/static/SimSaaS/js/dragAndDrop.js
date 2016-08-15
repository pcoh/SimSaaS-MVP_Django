function handleDragStart(e) {
	this.style.opacity = dragPlotOpacity; 
	dragSrcEl = this;

  	e.dataTransfer.effectAllowed = 'move';
  	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
	if (dragSrcEl != this) {
		dropZone = "<div class=\"col-sm-12 dropZone\">Drop here</div>";
		$newDropZone = $( dropZone ).insertBefore( $(this));
		return $newDropZone;
	}
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragLeave(e) {
  if (dragSrcEl != this) {
  	$newDropZone.remove();
  }
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  // Don't do anything if dropping the same plot we're dragging.
  if (dragSrcEl != this) {
    $cutPlot = $(dragSrcEl).detach();

    $cutPlot.insertBefore($(this)).fadeTo(1,0,function() {
    	$cutPlot.hide(1,function(){
    		$cutPlot.slideDown(500,function() {
    			$cutPlot.fadeTo(100,stdPlotOpcacity);
    		})
    	});    	
  	})
  }
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
	$newDropZone.remove();
  [].forEach.call(plotContains, function (plCont) {
    plCont.style.opacity = stdPlotOpcacity; 
  });
}

function addListenerToPlots(){
	plotContains = document.querySelectorAll('.row .divPlotContainer');
	[].forEach.call(plotContains, function(plCont) {
		plCont.addEventListener('dragstart', handleDragStart, false);	  	
	  plCont.addEventListener('dragenter', handleDragEnter, false);
	  plCont.addEventListener('dragover', handleDragOver, false);
		plCont.addEventListener('dragleave', handleDragLeave, false);
		plCont.addEventListener('drop', handleDrop, false);
		plCont.addEventListener('dragend', handleDragEnd, false);
	});
}