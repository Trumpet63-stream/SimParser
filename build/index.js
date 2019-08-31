/// <reference path="parsing.ts" />
let reader;
let localStartedParse;
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
function clearStartedParse() {
    document.getElementById("finish-parse-section").innerHTML = "";
    localStartedParse = undefined;
}
// noinspection JSUnusedLocalSymbols
function go() {
    let upload = document.getElementById("upload");
    let file = upload.files[0];
    reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener('loadend', onFileLoaded);
}
function onFileLoaded() {
    let file = reader.result;
    startParse(file);
}
function startParse(file) {
    localStartedParse = parseMetaData(file);
    let modeOptions = getModeOptionsForDisplay(localStartedParse);
    showModeOptions(modeOptions);
}
function getModeOptionsForDisplay(metaData) {
    let modes = metaData["NOTES"];
    let modeOptions = [];
    for (let i = 0; i < modes.length; i++) {
        let mode = modes[i];
        modeOptions.push({ type: mode["type"], difficulty: mode["difficulty"], meter: mode["meter"], id: i });
    }
    modeOptions.sort(compareModeOptions);
    return modeOptions;
}
class Mode {
}
function compareModeOptions(a, b) {
    let typeA = a.type.toUpperCase();
    let typeB = b.type.toUpperCase();
    if (typeA != typeB) {
        if (typeA < typeB) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
        let difficultyA = a.difficulty.toUpperCase();
        let difficultyB = b.difficulty.toUpperCase();
        if (difficultyA != difficultyB) {
            return difficultyRank(difficultyA) - difficultyRank(difficultyB);
        }
        else {
            let meterA = parseFloat(a.meter);
            let meterB = parseFloat(b.meter);
            if (meterA != meterB) {
                return meterA - meterB;
            }
        }
    }
    return a.id = b.id;
}
function difficultyRank(difficulty) {
    switch (difficulty) {
        case "BEGINNER":
            return 0;
        case "EASY":
            return 1;
        case "MEDIUM":
            return 2;
        case "HARD":
            return 3;
        case "CHALLENGE":
            return 4;
        case "EDIT":
            return 5;
        default:
            return 6;
    }
}
function showModeOptions(modeOptions) {
    let modeSelect = document.getElementById("finish-parse-section");
    let html = 'Choose a mode: <select id="mode-select">\n' +
        '<option hidden disabled selected value></option>\n';
    for (let i = 0; i < modeOptions.length; i++) {
        let mode = modeOptions[i];
        html += '<option value="' + mode["id"] + '">' +
            mode["type"] + ', ' + mode["difficulty"] + ', ' + mode["meter"] +
            '</option>\n';
    }
    html += '</select><br>\n';
    html += getFinishParseButton();
    modeSelect.innerHTML = html;
}
function getFinishParseButton() {
    return '<input type="button" value="Finish Parse" onclick="finishParse()"><br>';
}
// noinspection JSUnusedLocalSymbols
function finishParse() {
    let selectedMode = document.getElementById("mode-select").value;
    let tracks = getNoteTimesForMode(selectedMode, localStartedParse);
    console.log(tracks);
    //showParseInTextbox(tracks);
    drawParse(tracks);
}
function showParseInTextbox(parse) {
    document.getElementById("result-box-section").innerHTML =
        '<br><!--suppress HtmlUnknownAttribute --><input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value=' +
            JSON.stringify(parse) + '>';
}
function drawParse(tracks) {
    document.getElementById("graphical-display-section").innerHTML =
        '<br><canvas id="canvas"></canvas>';
    prepareDisplay(tracks);
}
//# sourceMappingURL=index.js.map