// GLOBAL VARIABLES
var statementsArr;
var totalQ;
var count = 0;
var origin;
var tOut;
var middle = 0;
var studentsPosition = [];
var speedMode = 0;
var isStepOne = true;
var autoplayIsOn = false;
var helpIsOpen = true;

$(document).ready(function () {
    getCourse();
    /** ####################################################################################################
     *  DESCRIPTION:
     *      When a key is pressed, check if it a keyboard shortcut
     *  PARAMETER(S):
     *      none
     */
    $(document).on("keydown", function (event) {
        if ($("#name").is(":focus")) {
            return
        } else if (event.keyCode == 72) {
            if (helpIsOpen) {
                closeHelp();
            } else {
                openHelp();
            }
        }
        if (!isStepOne) {
            if (event.keyCode == 65) { //a
                if (autoplayIsOn) {
                    autoplayOff();
                } else {
                    autoplayOn();
                }
            } else if (event.keyCode == 83) { //s
                speedMode++;
                if (speedMode == 3) {
                    speedMode = 0;
                }
                if (speedMode == 0) {
                    $("#speed2").prop("checked", true)
                } else if (speedMode == 1) {
                    $("#speed3").prop("checked", true)
                } else {
                    $("#speed1").prop("checked", true)
                }
            } else if (event.keyCode == 66) { //b
                if ($("#back").is(":enabled")) {
                    $("#back").click();
                }
            } else if (event.keyCode == 78) { //n
                if ($("#next").is(":enabled")) {
                    $("#next").click();
                }
            }
        }
    });
    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'closeButton' is clicked, close done modal
     *  PARAMETER(S):
     *      none
     */
    $(".closeButton").on("click", function () {
        $("#done-modal--background").hide();
        $("#back").prop("disabled", false);
    });
    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'find me' is clicked
     *  PARAMETER(S):
     *      none
     */
    // $("#findMe").click(function () {

    // });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When '?' is clicked, open help modal
     *  PARAMETER(S):
     *      none
     */
    $(".help").click(function () {
        openHelp();
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'GOT IT' is clicked, close help modal
     *  PARAMETER(S):
     *      none
     */
    $("#gotIt").on("click", function () {
        closeHelp();
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'auto' is clicked if checked then auto play on, else turn autoplay off.
     *  PARAMETER(S):
     *      none
     */
    $("#autoplay").on("click", function () {
        if (autoplayIsOn) {
            autoplayOff();
            // clearTimeout(tOut);
            // tOut = setTimeout(goToNext, $("input[name='speed']:checked").val() * 1000);
        } else {
            autoplayOn();
            // clearTimeout(tOut);
        }
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'name' is focused
     *  PARAMETER(S):
     *      none
     */
    $("#name").keypress(function () {
        $('#name').css("background-color", "#fff");
        if (event.keyCode == 13 || event.which == 13) {
            $('#done').click();
            event.preventDefault();
        }
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'done' is clicked check for input. 
     *      Error if no input, else get class infomation
     *  PARAMETER(S):
     *      none
     */
    $("#done").on('click', function () {
        if ($("#name").val() == '') {
            $("#nameErrorMsg").html("* Please enter your avatar name");
            $("#nameErrorMsg").css("color", "#800000");
        } else {
            isStepOne = false;
            $("#nameErrorMsg").css("color", "#80000000");
            getClass();
        }
    });
    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'next' is clicked turn off autoplay and enable back button. 
     *      Move all characters based on their answers. 
     *      Show done message and disable 'next' when completed.
     *      Display next statement.
     *  PARAMETER(S):
     *      none
     */
    $("#next").on('click', function () {
        autoplayIsOn = false;
        $("#autoplay").html("AUTO: OFF").css("color", "#800000");
        $("#back").prop("disabled", false);
        next();
        clearTimeout(tOut);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'back' is clicked turn off autoplay and enable next button. 
     *      Move avatar to previous state.
     *      Show previous statement.
     *      Disable 'back' if first question.
     *  PARAMETER(S):
     *      none
     */
    $("#back").on('click', function () {
        autoplayIsOn = false;
        $("#autoplay").html("AUTO: OFF").css("color", "#800000");
        clearTimeout(tOut);
        $("#next").prop("disabled", false);
        count--;
        if (count % 2 != 0) {
            count--;
        }
        $("#progress").html("<strong>" + (Math.floor(count / 2) + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
        for (var i = 0; i < studentArr.length; i++) {
            studentsPosition[i] -= studentArr[i].response[Math.floor(count / 2)];
            var aStudent = $(".student" + i);
            TweenLite.to(aStudent, 1, {
                x: studentsPosition[i] * 40
            });
        }
        $("#status").hide();
        $("#statement").html(statementsArr[Math.floor(count / 2)].statement);
        if (Math.floor(count / 2) == 0) {
            $("#back").prop("disabled", true);
        }

    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'replay' is clicked disable 'back' and enable 'next'.
     *      Hide replay button. 
     *      Move all avatars to the start.
     *      Show first statement.
     *      NOTE: autoplay is still on
     *  PARAMETER(S):
     *      none
     */
    // $("#replay").on("click", function () {
    //     $("#autoplay").prop('checked', true);
    //     $("#back").prop("disabled", true);
    //     $("#next").prop("disabled", false);
    //     $("#replay").hide();
    //     $("#status").hide();
    //     for (var i = 0; i < studentArr.length; i++) {
    //         studentsPosition[i] = 0;
    //         var aStudent = $(".student" + i);
    //         TweenLite.to(aStudent, 1, {
    //             x: 0
    //         });
    //     }
    //     count = 0;
    //     $("#progress").html("<strong>" + (count + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
    //     $("#statement").html(statementsArr[count].statement);
    //     clearTimeout(tOut);
    //     tOut = setTimeout(goToNext, $("input[name='speed']:checked").val() * 1000);
    // });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'speed' is clicked change to value picked and turn autoplay on
     *  PARAMETER(S):
     *      none
     */
    $("input:radio[name='speed']").on("change", function () {
        autoplayOn();
        clearTimeout(tOut);
        tOut = setTimeout(goToNext, $("input[name='speed']:checked").val() * 1000);
        $("#autoplay").prop('checked', true);
    });
});
/** ####################################################################################################
 *  DESCRIPTION:
 *      Get course information from the url.
 *      If no course information found then go to error page.
 *  PARAMETER(S):
 *      none
 */
var key;
var username;

function getCourse() {
    var url = location.search;
    url = url.substring(1, url.length);
    url = decodeURIComponent(url);
    var urlPart = url.split('&');
    key = urlPart[0];
    username = urlPart[1];
    $("#name").val(username);
    $.post(window.location.pathname + "/../../pwalkwalk.php", {
        msg: 'get',
        hash: key
    }).done(function (data) {
        var obj = jQuery.parseJSON(data);
        exists = obj.exists
        if (exists == 0) {
            window.location.href = window.location.pathname + "/../../error.html";
        } else {
            walk_id = obj.walk_id;
        }
    }).fail(function (data) {
        console.log("Error: cannot insert course");
    });
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Get statement for this course.
 *      Error if no statements found.
 *      Else counts number of back moves to place the origin.
 *      Disable 'back'.
 *  PARAMETER(S):
 *      none
 */
function getStatements() {
    $.post(window.location.pathname + "/../../pwalkstatement.php", {
        msg: 'get',
        walk_id: walk_id
    }).done(function (data) {
        var obj = jQuery.parseJSON(data);
        var exists = obj.exists;
        if (exists == 0) {
            console.log("no statements found for this course.");
        } else {
            statementsArr = obj.statements;
            totalQ = statementsArr.length;
            for (var i = 0; i < totalQ; i++) {
                studentsPosition[i] = 0;
                if (statementsArr[i].direction == -1) {
                    middle++;
                }
            }
            origin = (middle + 1) * 40;
            $("#canvas").append("<div id='origin'></div>");
            $("#origin").css("position", "absolute").css("width", "10px").css("height", studentArr.length * 40 + 5).css("min-height", "100%").css("background-color", "#222").css("left", origin);
            $("#statement").html(statementsArr[count].statement);
            $("#playback-modal--background").show();
            $("#progress").html("<strong>" + (count + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
            $("#back").prop("disabled", true);
            printAvatar();
        }
    }).fail(function (data) {
        console.log("Error: cannot insert course");
    });
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Get class and class response for this course.
 *      Error if no class and response.
 *      Else go to next step ans show statement.
 *  PARAMETER(S):
 *      none
 */
function getClass() {
    $.post(window.location.pathname + "/../../pwalkuser.php", {
        msg: 'get',
        walk_id: walk_id,
        name: $("#name").val()
    }).done(function (data) {
        var obj = jQuery.parseJSON(data);
        studentArr = obj.students;
        if (obj.exist == 0) {
            $("#nameErrorMsg").html("* No avatar found. Please enter avatar name.");
            $("#nameErrorMsg").css("color", "#800000");
        } else {
            $("#nameErrorMsg").html("");
            $("#nameErrorMsg").css("color", "#80000000");
            $("#input-modal--background").addClass("animated bounceOutUp");
            canvas.height = 40 * studentArr.length;
            getStatements();
        }
    }).fail(function (data) {
        console.log("Error: cannot insert course");
    });
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Print out all avatars in the class
 *  PARAMETER(S):
 *      none
 */
function printAvatar() {
    $("#canvas").append("<img id='morePrivilege' class='privilegeText' src='' alt=''>");
    $("#canvas").append("<img id='lessPrivilege' class='privilegeText' src='' alt=''>");
    $("#morePrivilege").css("left", (statementsArr.length + 5) * 40);
    $("#lessPrivilege").css("left", "0");
    $("#canvas").scrollLeft(origin - ($("#playback-modal").width() / 2));
    for (var i = 0; i < studentArr.length; i++) {
        $("#canvas").append("<div class='student student" + i + "'></div>");
        var shirt = $("#shirt" + studentArr[i].avatar_shirt).attr("src");
        $(".student" + i).html("<img class='shirt' src='" + shirt + "' alt=''>");
        var face = $("#c" + studentArr[i].avatar_face_color + "face" + studentArr[i].avatar_face).attr("src");
        $(".student" + i).append("<img class='face' src='" + face + "' alt=''>");
        if (studentArr[i].avatar_accessory != 0 && studentArr[i].avatar_accessory != 9) {
            var accessory = $("#accessory" + studentArr[i].avatar_accessory).attr("src");
            $(".student" + i).append("<img class='accessory' src='" + accessory + "' alt=''>");
        }
        if (studentArr[i].avatar_hair != 0) {
            var hair = $("#c" + studentArr[i].avatar_hair_color + "hair" + studentArr[i].avatar_hair).attr("src")
            $(".student" + i).append("<img  src='" + hair + "' alt=''>");
        }
        $(".student" + i).append("<p class='name'>" + studentArr[i].name + "</p>");
        if (studentArr[i].name == $("#name").val()) {
            $(".student" + i + " .name").css("color", "#000000");
        } else {
            $(".student" + i + " .name").css("color", "#00000033");
        }
        if (studentArr[i].avatar_accessory == 9) {
            var accessory = $("#accessory" + studentArr[i].avatar_accessory).attr("src");
            $(".student" + i).append("<img class='accessory' src='" + accessory + "' alt=''>");
        }
        $(".student" + i).css("top", i * 40);
    }
    $(".student").css("left", origin - 15);

}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Goes to next statement
 *      Moves avatars according to previous response
 *  PARAMETER(S):
 *      none
 */
function next() {
    count++;
    if (count % 2 == 0) {
        // even
        if (count / 2 >= totalQ) {
            $("#next").prop("disabled", true);
            // $("#statement").html("You've completed this assignment!");
            $("#done-modal--background").show();
            $("#back").prop("disabled", true);
            // TO DO: REPLAY button
            //$("#replay").show();
        } else {
            $("#next").html("SHOW");
            $("#status").hide();
            $("#statement").html(statementsArr[count / 2].statement);
            $("#progress").html("<strong>" + (count / 2 + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
        }
    } else {
        $("#next").html("NEXT");
        var studentsMoved = 0;
        for (var i = 0; i < studentArr.length; i++) {
            if (studentArr[i].response[Math.floor(count / 2)] == -1 || studentArr[i].response[Math.floor(count / 2)] == 1) {
                studentsMoved++;
            }
            studentsPosition[i] += studentArr[i].response[Math.floor(count / 2)];
            var aStudent = $(".student" + i);
            TweenLite.to(aStudent, 1, {
                x: studentsPosition[i] * 40
            });
        }
        var moveMsg;
        if (statementsArr[Math.floor(count / 2)].direction == -1) {
            moveMsg = "backward";
        } else {
            moveMsg = "forward";
        }
        $("#status").show();
        $("#status").html(studentsMoved + " out of " + studentArr.length + " or " + (Math.max(Math.round((studentsMoved / studentArr.length) * 100).toFixed(2))) + "% moved " + moveMsg);
    }
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      FOR AUTOPLAY.
 *      Goes to next statement automatically.
 *      Move avatars automatically.
 *      Disable and enables button appropriately.
 *  PARAMETER(S):
 *      none
 */
function goToNext() {
    if (count / 2 < totalQ) {
        next();
        clearTimeout(tOut);
        tOut = setTimeout(goToNext, $("input[name='speed']:checked").val() * 1000);
    }
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Closes help modal and re-enables appropriate buttons
 *  PARAMETER(S):
 *      none
 */
function closeHelp() {
    helpIsOpen = false;
    $("#help-modal--background").hide();
    $("#done").prop("disabled", false);
    $("#name").prop("disabled", false);
    $(".help").prop("disabled", false);
    if (count == 0 || count == 1) {
        $("#next").prop("disabled", false);
    } else if (count / 2 >= totalQ) {
        $("#back").prop("disabled", false);
    }
}
/** ####################################################################################################
 *  DESCRIPTION:
 *      Opens help modal and disables appropriate buttons
 *  PARAMETER(S):
 *      none
 */
function openHelp() {
    helpIsOpen = true;
    // show help modal
    $("#help-modal--background").show();
    //if first help button
    if (isStepOne) {
        // then display step 1 instruction
        $("#help-modal--container").html("<h3>Step 1: Input name</h3><p>Type in the name you've chosen for you avatar in the first part of this activity.</p>");
    }
    // else if second help button
    else {
        // then display step 2 instruction
        $("#help-modal--container").html("<h3>Step 2: Reviewing statements</h3>" + "<p>Click on  the <strong>NEXT</strong> button to see how you and your peers have answered the statements from the previous activity. Click on <strong>AUTO: ON</strong> or <strong>AUTO: OFF</strong> to toggle the autoplay. You can also choose to change the speed of the autoplay by selecting <strong>Slow</strong>, <strong>Normal</strong>, or <strong>Fast</strong>.</p>" + "<h3 style='text-align:center;'>Keyboard Shortcuts</h3>" + "<table style='margin:auto;'> <col width='50'><col width='150'><tr><th class='center'>Keys</th><th>Action</th></tr> </tr><tr><td class='center'>B</td><td>Back Statement</td></tr> <tr><td class='center'>N</td><td>Next Statement</td></tr><tr><td class='center'>A</td><td>Toggle AutoPlay</td></tr><td class='center'>S</td><td>Toggle Speed</td><tr><td class='center'>H</td><td>Toggle Help Window</td></table>")
    }
    // disable all background buttons
    $("#done").prop("disabled", true);
    $("#name").prop("disabled", true);
    $("#back").prop("disabled", true);
    $("#next").prop("disabled", true);
    $(".help").prop("disabled", true);

}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Turns autoplay on
 *  PARAMETER(S):
 *      none
 */
function autoplayOn() {
    autoplayIsOn = true;
    $("#autoplay").html("AUTO: ON").css("color", "#000080");
    clearTimeout(tOut);
    tOut = setTimeout(goToNext, $("input[name='speed']:checked").val() * 1000);
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Turns autoplay off
 *  PARAMETER(S):
 *      none
 */
function autoplayOff() {
    autoplayIsOn = false;
    $("#autoplay").html("AUTO: OFF").css("color", "#800000");
    clearTimeout(tOut);
}