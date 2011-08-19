define(
	[ 'dep1'], 
	function ( dep1 ) {
		return { value : 'mod1value ' + dep1.value } 
	}
);