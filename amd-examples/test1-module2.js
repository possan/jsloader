define(
	['dep1', 'dep2'],
	function (dep1,dep2) {
		return { value: dep1.value + '+' + dep2.value };
	}
);