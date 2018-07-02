var rigo, msa, both = false

function doRIGO(){
	rigo = true;
	msa = false;
	both = false;
	$('#national-map').html('');
	$('#us_state_div').html('');
	rigo1();
}

function doRIGOState(){
	$('#us_state_div').html('');
	rigo2();
	// load();
}


function doMSA(){
	rigo = false;
	msa = true;
	both = false;
	$('#national-map').html('');
	$('#us_state_div').html('');
	msa1()
}

function doMSAState(){
	$('#us_state_div').html('');
	msa3();
	// load();
}


function load(){
	if (rigo===true){
		rigo1();
	}
	else if (msa===true){
		msa1();
	}
	else if (both===true){

	}
	else{
		rigo1();
	}
}

function loadState(){
	if (rigo===true){
		doRIGOState();
	}
	else if (msa===true){
		doMSAState();
	}
	else if (both===true){

	}
	else{
		doRIGOState();
	}

}
