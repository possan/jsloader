loaderjs - a minimal javascript dependency loader framework

Usage:

1. Load the library:

	<script language="javascript" type="text/javascript" src="/scripts/loader-release.js">
	</script>
				
2. Create a loader instance:

	<script>
		var loader = new Loader({ root: '/scripts/' });
	</script>

3. Request some dependencies and provide a callback that's going to get called when your
	dependencies are loaded:

	<script>
		loader.requires('some-module', function () {
			// use code provided by module
			alert(someModuleMessage());
		});
	</script>

4. Define your modules like this: (eg. "scripts/some-module.js")

	<script>
		module.provides('some-module', function () {
			// ... your module here
			someModuleMessage = function() { return "Hello world from dependency!"; }
		});
	</script>

5. Or if your module has it's own dependencies, you specify them in the same call:

	<script>
		module.requires([
			'another-dependency',
			'yet-another-dependency'
		]).provides('some-module', function () { 
			// ... your module here
		});
	</script>

	
If you want you could also wrap everything in the provided domready-wrapper and preload 
some dependencies using a file with multiple module statements in it:

	<script src="/scripts/ready+loader-release.js"></script>
	<script>
		var loader = new Loader({ root: '/scripts/' });
		ready(function(){
			loader.load('magic-calculator-combined');
		});
		calc = function(){
			loader.require('magic-calculator',function(){
				alert('The result is: ' + magicCalculatorFunction() );
			});
		});
	</script>
	<body>
		<button onclick="calc">Calculate something</button>
	</body>







	