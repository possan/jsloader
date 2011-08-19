@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=loader.js --js_output_file=loader-release.js --compilation_level ADVANCED_OPTIMIZATIONS --define DEBUG=false
@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=loader.js --js_output_file=loader-debug.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=true
rem @"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=loader.js --js_output_file=loader-release-pp.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=false

@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=old-loader.js --js_output_file=old-loader-release.js --compilation_level ADVANCED_OPTIMIZATIONS --define DEBUG=false
@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=old-loader.js --js_output_file=old-loader-debug.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=true
rem @"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=old-loader.js --js_output_file=old-loader-release-pp.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=false

@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=ready.js --js_output_file=ready-release.js --compilation_level ADVANCED_OPTIMIZATIONS --define DEBUG=false
@"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=ready.js --js_output_file=ready-debug.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=true
rem rem @"c:\program files (x86)\java\jre6\bin\java" -jar "..\compiler.jar" --js=ready.js --js_output_file=ready-release-pp.js --compilation_level ADVANCED_OPTIMIZATIONS --formatting PRETTY_PRINT --define DEBUG=false

type ready-release.js > "ready+loader-release.js"
type loader-release.js >> "ready+loader-release.js"

type ready-release.js > "ready+old-loader-release.js"
type old-loader-release.js >> "ready+old-loader-release.js"

type ready-debug.js > "ready+loader-debug.js"
type loader-debug.js >> "ready+loader-debug.js"

type ready-debug.js > "ready+old-loader-debug.js"
type old-loader-debug.js >> "ready+old-loader-debug.js"

dir /a *.js