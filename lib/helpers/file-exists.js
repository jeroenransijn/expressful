const fs = require('fs');

// http://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
function fileExists (path) {
	try {
		return fs.statSync(path).isFile();
	} catch (e) {

		if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
			return false;
		}

		throw e; // something else went wrong, we don't have rights, ...
	}
}

module.exports = fileExists;
