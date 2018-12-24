/**
 * @file Library to ease file I/O using promises.
 */

//import FileSystem from 'react-native-filesystem';
const DocumentsPath = "Documents/";
const Log = require("../dedjs/Log");

/**
 * Gets the string of the file at filePath and returns a promise with the content.
 * @param {string} filePath - the path to the file
 * @returns {Promise} - a promise that gets resolved once the content of the file has been read
 */
function getStringOf(filePath) {
    if (typeof filePath !== "string") {
        throw new Error("filePath must be of type string");
    }
    return FileSystem.readFile(DocumentsPath + filePath);
}

/**
 * Writes the parameter string to the file at filePath. This method overwrites the file completely.
 * @param {string} filePath - the path to the file
 * @param {string} string - the string to write
 * @returns {Promise} - a promise that gets resolved once the content has been written to the file
 */
function writeStringTo(filePath, string) {
    if (typeof filePath !== "string") {
        throw new Error("filePath must be of type string");
    }
    if (typeof string !== "string") {
        throw new Error("string must be of type string");
    }
    console.log("writing to: " + filePath);
    return FileSystem.writeToFile(DocumentsPath+filePath,string);
}

/**
 * Execute a given function on each element of a folder.
 * @param {string} folder - the path to the folder
 * @param {function} closure - the function that will be exeuted on each element. It has to be of type
 * function (elementName: string)
 */
function forEachFolderElement(folder, closure) {
    if (typeof folder !== "string") {
        throw new Error("folder must be of type string");
    }

    if (typeof closure !== "function") {
        throw new Error("closure must be of type function");
    }

    //TODO BROKEN - port from NativeScript not functional
    /*Documents.getFolder(folder).eachEntity(function (entity) {
        closure(entity);
        // continue until the last file
        return true;
    })*/
    throw {name : "NotImplementedError", message : "Port from NativeScript not functional for this function."};
}

/**
 * Remove the specified fodler
 * @param {string} folder
 * @retuns {Promise} - a promise that gets resolved once the folder has been deleted
 */
function removeFolder(folder) {
    if (typeof folder !== "string") {
        throw new Error("folder must be of type string");
    }

    //TODO BROKEN - port from NativeScript not functional
    /*return Documents.getFolder(folder).remove().catch((error) => {
        console.log("REMOVING ERROR :");
        console.log(error);
        console.dir(error);
        console.trace();
    });*/
    throw {name : "NotImplementedError", message : "Port from NativeScript not functional for this function."};
}

/**
 * Removes the directory recursively, but only files directly inside and the directory itself. If there
 * are subdirectories, this will fail.
 * @param dir
 * @returns {Promise<void>}
 */
function rmrf(dir) {
    /* TODO BROKEN - port from NativeScript not functional
    return Documents.getFolder(dir).clear();
    */
    throw {name : "NotImplementedError", message : "Port from NativeScript not functional for this function."};
}

function lslr(dir, rec) {
    /* TODO BROKEN - port from NativeScript not functional
    if (rec === undefined) {
        dir = FileSystem.path.join(Documents.path, dir);
    }
    let folders = [];
    let files = [];
    FileSystem.Folder.fromPath(dir).getEntities()
        .then((entities) => {
            // entities is array with the document's files and folders.
            entities.forEach((entity) => {
                const fullPath = entity.path;
                // const fullPath = FileSystem.path.join(entity.path, entity.name);
                const isFolder = FileSystem.Folder.exists(fullPath);
                const e = {
                    name: entity.name,
                    path: entity.path,
                }
                if (isFolder) {
                    folders.push(e);
                } else {
                    files.push(e);
                }
            });
            console.log("");
            console.log("Directory:", dir);
            folders.forEach(folder => {
                console.log("d ", folder.name);
            });
            files.forEach(file => {
                console.log("f ", file.name);
            });
            folders.forEach(folder => {
                lslr(folder.path, true);
            });
        }).catch((err) => {
        // Failed to obtain folder's contents.
        console.log(err.stack);
    });*/
    throw {name : "NotImplementedError", message : "Port from NativeScript not functional for this function."};
}

function folderExists(path) {
    return FileSystem.directoryExists(DocumentsPath + path);
}

function fileExists(path) {
    return FileSystem.fileExists(DocumentsPath + path);
}

function join(path1,path2) {
    return path1 + '/' + path2;
}

module.exports.getStringOf = getStringOf;
module.exports.writeStringTo = writeStringTo;
module.exports.forEachFolderElement = forEachFolderElement;
module.exports.removeFolder = removeFolder;
module.exports.join = join;
module.exports.fileExists = fileExists;
module.exports.folderExists = folderExists;
module.exports.rmrf = rmrf;
module.exports.lslr = lslr;
