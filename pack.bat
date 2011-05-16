@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=loader.js --js_output_file=loader-release.js --compilation_level ADVANCED_OPTIMIZATIONS --define DEBUG=false
@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=loader.js --js_output_file=loader-debug.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=true
