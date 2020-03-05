var walk_id;
var count = 0;
var shirtNum = 0;
var faceShapeNum = 0;
var faceColorNum = 0;
var hairShapeNum = 0;
var hairColorNum = 0;
var accessoryNum = 0;
var avatarischosen = false;
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2 + 20;
var direction;
var directionArray = []; // 0 of empty, 1 for back, 2 for stand still, 3 for forward
var helpIsOpen = true;
var isStepOne = true;
$(document).ready(function () {
    getCourse();
    /** ####################################################################################################
     *  DESCRIPTION:
     *      When a key is pressed, check if it a keyboard shortcut
     *      1: step back
     *      2: stand still
     *      3: step forward
     *      B: previous question
     *      N: next question
     *  PARAMETER(S):
     *      none
     */
    $(document).on("keydown", function (event) {
        if ($("#name").is(":focus")) {
            return;
        } else if (event.keyCode == 72) {
            if (helpIsOpen) {
                closeHelp();
            } else {
                openHelp();
            }
        } else if (!isStepOne) {
            if (event.keyCode == 49) { //1
                if ($("#stepBack").is(":enabled")) {
                    move(-1);
                    $("#stepBack").click();
                }
            } else if (event.keyCode == 50) { //2
                if ($("#standStill").is(":enabled")) {
                    move(0);
                    $("#standStill").click();
                }
            } else if (event.keyCode == 51) { //3
                if ($("#stepForward").is(":enabled")) {
                    move(1);
                    $("#stepForward").click();
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
     *      When 'closeButton' is clicked, close mini modal and re-enable appropriate buttons
     *  PARAMETER(S):
     *      none
     */
    $(".closeButton").on("click", function () {
        // close modal
        $(".input-modal--mini-modal").hide();
        // enable buttons
        $(".choiceButton").prop("disabled", false);
        $("#done").prop("disabled", false);
        $("#name").prop("disabled", false);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When ? is clicked, opens help modal
     *      Step 1: Create avatar
     *      Step 2: Answer statements
     *  PARAMETER(S):
     *      none
     */
    $(".help").on("click", function () {
        openHelp();
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'got it' is clicked, close help modal
     *  PARAMETER(S):
     *      none
     */
    $("#gotIt").on("click", function () {
        closeHelp();
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When face color is selected,select face color and change face shape choices to that color 
     *  PARAMETER(S):
     *      none
     */
    $(".faceColorButton").on("click", function () {
        $(".faceColorButton").removeClass("selectedFaceColor");
        $(this).addClass("selectedFaceColor");
        if ($(this).is("#faceColorButton7") || $(this).is("#faceColorButton8")) {
            $("#faceShapeButton3Img").attr("src", $("#c" + faceColorNum + "face3").attr("src"));
        } else {
            var numberOfHeadShape = 3;
            for (var i = 0; i < numberOfHeadShape; i++) {
                $("#faceShapeButton" + i + "Img").attr("src", $("#c" + faceColorNum + "face" + i).attr("src"));
            }
        }

    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When face shape is selected, select face shape
     *  PARAMETER(S):
     *      none
     */
    $(".faceShapeButton").on("click", function () {
        $(".faceShapeButton").removeClass("selectedFace");
        $(this).addClass("selectedFace");
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When hair color is selected, select hair and change hair shape according to color chosen
     *  PARAMETER(S):
     *      none
     */
    $(".hairColorButton").on("click", function () {
        $(".hairColorButton").removeClass("selectedHairColor");
        $(this).addClass("selectedHairColor");
        var numberOfHairShape = 10;
        for (var i = 1; i < numberOfHairShape; i++) {
            $("#hairShapeButton" + i + "Img").attr("src", $("#c" + hairColorNum + "hair" + i).attr("src"));
        }
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When hair shape is selected, select hair shape
     *  PARAMETER(S):
     *      none
     */
    $(".hairShapeButton").on("click", function () {
        $(".hairShapeButton").removeClass("selectedHair");
        $(this).addClass("selectedHair");
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When shirt is selected, select shirt
     *  PARAMETER(S):
     *      none
     */
    $(".shirtButton").on("click", function () {
        $(".shirtButton").removeClass("selectedShirt");
        $(this).addClass("selectedShirt");
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When accessory is selected, select accessory
     *  PARAMETER(S):
     *      none
     */
    $(".accessoryButton").on("click", function () {
        $(".accessoryButton").removeClass("selectedAccessory");
        $(this).addClass("selectedAccessory");
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When open face modal clicked, opens face modal and disable unused buttons
     *  PARAMETER(S):
     *      none
     */
    $("#openFaceModal").on("click", function () {
        $("#faceModal").show();
        $(".choiceButton").prop("disabled", true);
        $("#done").prop("disabled", true);
        $("#name").prop("disabled", true);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When open hair modal clicked, opens hair modal and disable unused buttons
     *  PARAMETER(S):
     *      none
     */
    $("#openHairModal").on("click", function () {
        $("#hairModal").show();
        $(".choiceButton").prop("disabled", true);
        $("#done").prop("disabled", true);
        $("#name").prop("disabled", true);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When open shirt modal clicked, opens shirt modal and disable unused buttons
     *  PARAMETER(S):
     *      none
     */
    $("#openShirtModal").on("click", function () {
        $("#shirtModal").show();
        $(".choiceButton").prop("disabled", true);
        $("#done").prop("disabled", true);
        $("#name").prop("disabled", true);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When open accessory modal clicked, opens accessory modal and disable unused buttons
     *  PARAMETER(S):
     *      none
     */
    $("#openAccessoryModal").on("click", function () {
        $("#accessoryModal").show();
        $(".choiceButton").prop("disabled", true);
        $("#done").prop("disabled", true);
        $("#name").prop("disabled", true);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When a choice is clicked, clear error message 
     *  PARAMETER(S):
     *      none
     */
    $(".choice").on("click", function () {
        $("#avatarErrorMsg").css("color", "#80000000");
    })

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When name input is focused, change background color of name input to white
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
     *      When done is clicked:
     *      Check for input, error if no input,
     *      Check for name, error if name used
     *      Go to next page if input is valid and clear errors 
     *  PARAMETER(S):
     *      none
     */
    $("#done").on("click", function () {
        if (($("#name").val() == '') || !avatarischosen) {
            if (($("#name").val() == '') && !avatarischosen) {
                $(".required").css("color", "#800000")
            } else if (($("#name").val() == '')) {
                $("#nameErrorMsg").css("color", "#800000")
                $("#avatarErrorMsg").css("color", "#80000000")
            } else {
                $("#avatarErrorMsg").css("color", "#800000")
                $("#nameErrorMsg").css("color", "#80000000")
            };
        } else {
            $(".required").css("color", "#00000000");
            showCurrentUser();
            setUser();
        }
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When step is clicked, set direction and enable 'next' button 
     *  PARAMETER(S):
     *      none
     */
    $(".step").on("click", function () {
        $(".step").removeClass("stepSelected");
        $(this).addClass("stepSelected");
        directionArray[count] = direction + 2;
        // directionArray[count] = 1;
        $("#next").prop("disabled", false);
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      When 'random' is clicked, randomly choose an avatar
     *  PARAMETER(S):
     *      none
     */
    $("#random").on("click", function () {
        // avatar is chosen, set bool to true
        $("#avatarErrorMsg").css("color", "#80000000");
        avatarischosen = true;
        // remove selected
        $(".choice").removeClass("selectedFaceColor").removeClass("selectedFace").removeClass("selectedHairColor").removeClass("selectedHair").removeClass("selectedShirt").removeClass("selectedAccessory");
        // get shirt
        var numberOfShirts = 6;
        shirtNum = Math.floor((Math.random() * (numberOfShirts)) + 0);
        //get face
        var numberOfFaceShape = 5;
        faceShapeNum = Math.floor((Math.random() * (numberOfFaceShape)) + 0);
        if (faceShapeNum < 3) { // if human head
            var numberOfFaceColor = 7;
            var numberOfAccessory = 10;
            var numberOfHairShape = 10;
            var numberOfHairColor = 7;
            $("#skinColorlabel").show();
            $("#humanColors").show();
            $("#alienColors").hide();
            $("#accessoryButton1").prop("disabled", false);
            $("#accessoryButton2").prop("disabled", false);
            $("#accessoryButton3").prop("disabled", false);
            $("#accessoryButton4").prop("disabled", false);
            $("#accessoryButton5").prop("disabled", false);
            faceColorNum = Math.floor((Math.random() * (numberOfFaceColor)) + 0);
            accessoryNum = Math.floor((Math.random() * (numberOfAccessory)) + 0);
            hairShapeNum = Math.floor((Math.random() * (numberOfHairShape)) + 0);
            hairColorNum = Math.floor((Math.random() * (numberOfHairColor)) + 0);
            var numberOfHeadShape = 3;
            for (var i = 0; i < numberOfHeadShape; i++) {
                $("#faceShapeButton" + i + "Img").attr("src", $("#c" + faceColorNum + "face" + i).attr("src"));
            }
        } else {
            var numberOfHairShape = 10;
            var numberOfHairColor = 7;
            $("#accessoryButton1").prop("disabled", true);
            $("#accessoryButton2").prop("disabled", true);
            $("#accessoryButton3").prop("disabled", true);
            $("#accessoryButton4").prop("disabled", true);
            $("#accessoryButton5").prop("disabled", true);
            accessoryNum = Math.floor((Math.random() * 4) + 0) + 6;
            hairShapeNum = Math.floor((Math.random() * (numberOfHairShape)) + 0);
            hairColorNum = Math.floor((Math.random() * (numberOfHairColor)) + 0);
            if (faceShapeNum == 3) { // if alien head
                $("#skinColorlabel").hide();
                $("#humanColors").hide();
                $("#alienColors").show();
                faceColorNum = Math.floor((Math.random() * 2) + 0) + 7;
                $("#faceShapeButton3Img").attr("src", $("#c" + faceColorNum + "face3").attr("src"));
            } else {
                $("#skinColorlabel").hide();
                $("#humanColors").hide();
                $("#alienColors").hide();
                faceColorNum = 9;
            }
        }
        if (accessoryNum == 9 && (hairShapeNum == 1 || hairShapeNum == 5 || hairShapeNum == 9)) {
            hairShapeNum = 4;
        }
        var numberOfHairShape = 10;
        for (var i = 1; i < numberOfHairShape; i++) {
            $("#hairShapeButton" + i + "Img").attr("src", $("#c" + hairColorNum + "hair" + i).attr("src"));
        }
        $("#shirtButton" + shirtNum).addClass("selectedShirt");
        $("#faceShapeButton" + faceShapeNum).addClass("selectedFace");
        $("#faceColorButton" + faceColorNum).addClass("selectedFaceColor");
        $("#hairShapeButton" + hairShapeNum).addClass("selectedHair");
        $("#hairColorButton" + hairColorNum).addClass("selectedHairColor");
        $("#accessoryButton" + accessoryNum).addClass("selectedAccessory");
        updateAvatar();
    });

    /** ####################################################################################################
     *  DESCRIPTION: 
     *     When 'next' is clicked
     *  PARAMETER(S):
     *      none
     */
    $("#next").on("click", function () {
        // if last statement
        if (count == totalQ - 1) {
            setDirection(1);
        }
        // else set direction and go to next statement
        else {
            setDirection(0);
            // next statement
            count++;
            showAstmt();
            $(".step").removeClass("stepSelected");
            // enable back
            $("#back").prop("disabled", false);
            // update question number
            $("#progress").html("<strong>" + (count + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
            // if last question then change ''next' to 'submit'
            if (count == totalQ - 1) {
                $("#next").html("SUBMIT");
            }
            // is answered before
            if (directionArray[count] != 0) {
                // then set the direction to that answer and show select button
                direction = directionArray[count] - 2;
                // highlight the answer choosens
                if (direction == -1) {
                    $("#stepBack").addClass("stepSelected");
                } else if (direction == 0) {
                    $("#standStill").addClass("stepSelected");
                } else if (direction == 1) {
                    $("#stepForward").addClass("stepSelected");
                }
            }
            // else if not answered before
            else {
                //turn off next button
                $("#next").prop("disabled", true);
            }
        }
    });

    /** ####################################################################################################
     *  DESCRIPTION:
     *      back is clicked 
     *  PARAMETER(S):
     *      none
     */
    $("#back").on("click", function () {
        // go to previous statements
        count--;
        showAstmt();
        // set the direction to the answer
        direction = directionArray[count] - 2;
        // highlight the answer choosen 
        $(".step").removeClass("stepSelected");
        if (direction == -1) {
            $("#stepBack").addClass("stepSelected");
        } else if (direction == 0) {
            $("#standStill").addClass("stepSelected");
        } else if (direction == 1) {
            $("#stepForward").addClass("stepSelected");
        }
        // update question number
        $("#progress").html("<strong>" + (count + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
        // if first question then turn off back
        if (count != 0) {
            $("#back").prop("disabled", false);
        } else {
            $("#back").prop("disabled", true);
        }
        // allow user to go to the next question
        $("#next").html("NEXT").prop("disabled", false);
    });
});

/** ####################################################################################################
 *  DESCRIPTION: 
 *      show avatar at the customizing page
 *  PARAMETER(S):
 *      none
 */
function updateAvatar() {
    $('canvas').removeLayers();
    $("canvas").addLayer({
        type: 'image',
        groups: ["myAvatar"],
        source: $("#shirt" + shirtNum).attr("src"),
        x: centerX,
        y: centerY,
        height: 200,
        width: 200,
        fromCenter: true
    }).addLayer({
        type: 'image',
        groups: ["myAvatar"],
        source: $("#c" + faceColorNum + "face" + faceShapeNum).attr("src"),
        x: centerX,
        y: centerY,
        height: 200,
        width: 200,
        fromCenter: true
    });

    if (accessoryNum != 0 && accessoryNum < 9) {
        $("canvas").addLayer({
            type: 'image',
            groups: ["myAvatar"],
            source: $("#accessory" + accessoryNum).attr("src"),
            x: centerX,
            y: centerY,
            height: 200,
            width: 200,
            fromCenter: true
        });
    }
    if (hairShapeNum != 0) {
        $("canvas").addLayer({
            type: 'image',
            groups: ["myAvatar"],
            source: $("#c" + hairColorNum + "hair" + hairShapeNum).attr("src"),
            x: centerX,
            y: centerY,
            height: 200,
            width: 200,
            fromCenter: true
        });
    }
    if (accessoryNum != 0 && accessoryNum == 9) {
        $("canvas").addLayer({
            type: 'image',
            groups: ["myAvatar"],
            source: $("#accessory" + accessoryNum).attr("src"),
            x: centerX,
            y: centerY,
            height: 200,
            width: 200,
            fromCenter: true
        });
    }
    $("canvas").drawLayers();
};

/** ####################################################################################################
 *  DESCRIPTION: 
 *      when an attribute is clicked, set the variable to that attribute number
 *  PARAMETERS: 
 *      attr = attribute being set
 *      x = number attribute is set to
 */
function attrClicked(attr, x) {
    if (!avatarischosen) {
        switch (attr) {
            case "fColor":
                $("#shirtButton0").addClass("selectedShirt");
                $("#faceShapeButton0").addClass("selectedFace");
                $("#hairShapeButton0").addClass("selectedHair");
                $("#hairColorButton0").addClass("selectedHairColor");
                $("#accessoryButton0").addClass("selectedAccessory");
                break;
            case "fShape":
                $("#shirtButton0").addClass("selectedShirt");
                $("#faceColorButton0").addClass("selectedFaceColor");
                $("#hairShapeButton0").addClass("selectedHair");
                $("#hairColorButton0").addClass("selectedHairColor");
                $("#accessoryButton0").addClass("selectedAccessory");
                break;
            case "hColor":
                $("#shirtButton0").addClass("selectedShirt");
                $("#faceShapeButton0").addClass("selectedFace");
                $("#faceColorButton0").addClass("selectedFaceColor");
                $("#hairShapeButton0").addClass("selectedHair");
                $("#accessoryButton0").addClass("selectedAccessory");
                break;
            case "hShape":
                $("#shirtButton0").addClass("selectedShirt");
                $("#faceShapeButton0").addClass("selectedFace");
                $("#faceColorButton0").addClass("selectedFaceColor");
                $("#hairColorButton0").addClass("selectedHairColor");
                $("#accessoryButton0").addClass("selectedAccessory");
                break;
            case "shirt":
                $("#faceShapeButton0").addClass("selectedFace");
                $("#faceColorButton0").addClass("selectedFaceColor");
                $("#hairShapeButton0").addClass("selectedHair");
                $("#hairColorButton0").addClass("selectedHairColor");
                $("#accessoryButton0").addClass("selectedAccessory");
                break;
            case "accessory":
                $("#shirtButton0").addClass("selectedShirt");
                $("#faceShapeButton0").addClass("selectedFace");
                $("#faceColorButton0").addClass("selectedFaceColor");
                $("#hairShapeButton0").addClass("selectedHair");
                $("#hairColorButton0").addClass("selectedHairColor");
                break;
        }
    }
    avatarischosen = true;
    switch (attr) {
        case 'fColor':
            faceColorNum = x;
            break;
        case 'fShape':
            faceShapeNum = x;
            // if human face selected, then show colors first seven colors
            if (faceShapeNum <= 2) {
                if (faceColorNum > 6) {
                    faceColorNum = 0;
                }
                $("#skinColorlabel").show();
                $("#humanColors").show();
                $("#alienColors").hide();
                $("#accessoryButton1").prop("disabled", false);
                $("#accessoryButton2").prop("disabled", false);
                $("#accessoryButton3").prop("disabled", false);
                $("#accessoryButton4").prop("disabled", false);
                $("#accessoryButton5").prop("disabled", false);
            }
            // if alien face selected, then show two colors
            else if (faceShapeNum == 3) {
                if (accessoryNum < 6) {
                    accessoryNum = 0;
                }
                if (faceColorNum != 7 || faceColorNum != 8) {
                    faceColorNum = 7;
                }
                $("#skinColorlabel").show();
                $("#alienColors").show();
                $("#humanColors").hide();
                $("#accessoryButton1").prop("disabled", true);
                $("#accessoryButton2").prop("disabled", true);
                $("#accessoryButton3").prop("disabled", true);
                $("#accessoryButton4").prop("disabled", true);
                $("#accessoryButton5").prop("disabled", true);
            }
            // if robot face selected, then show no colors
            else {
                faceColorNum = 9;
                accessoryNum = 0;
                $("#skinColorlabel").hide();
                $("#humanColors").hide();
                $("#alienColors").hide();
                $("#accessoryButton1").prop("disabled", true);
                $("#accessoryButton2").prop("disabled", true);
                $("#accessoryButton3").prop("disabled", true);
                $("#accessoryButton4").prop("disabled", true);
                $("#accessoryButton5").prop("disabled", true);
            }
            break;
        case 'hColor':
            hairColorNum = x;
            break;
        case 'hShape':
            hairShapeNum = x;
            if (accessoryNum == 9 && (hairShapeNum == 1 || hairShapeNum == 5 || hairShapeNum == 9)) {
                hairShapeNum = 4;
            }
            break;
        case 'shirt':
            shirtNum = x;
            break;
        case 'accessory':
            accessoryNum = x;
            if (accessoryNum == 9 && (hairShapeNum == 1 || hairShapeNum == 5 || hairShapeNum == 9)) {
                hairShapeNum = 4;
            }
            break;
    }

    updateAvatar();
}

/** ####################################################################################################
 *  DESCRIPTION: 
 *      get key from url and return walk_id, go to error page if does not exists
 *  PARAMETER(S):
 *      NONE
 */
function getCourse() {
    var url = location.search;
    url = url.substring(1, url.length);
    url = decodeURIComponent(url);
    var posting = $.post(window.location.pathname + "/../../pwalkwalk.php", {
        msg: 'get',
        hash: url
    });
    posting.done(function (data) {
            var obj = jQuery.parseJSON(data);
            exists = obj.exists
            if (exists == 0) {
                window.location.href = window.location.pathname + "/../../error.html";
            } else {
                walk_id = obj.walk_id;
            }
            getStatements();
        })
        .fail(function (data) {
            console.log("Error: cannot insert course");
        });
}

/** ####################################################################################################
 *  DESCRIPTION:
 *      Checks if statements exist, errors if does not exist
 *      Else parse statements and set progress to 1 out of totalAmtofStmt
 * PARAMETER(S):
 *      NONE
 */
function getStatements() {
    var posting = $.post(window.location.pathname + "/../../pwalkstatement.php", {
        msg: 'get',
        walk_id: walk_id
    });
    posting.done(function (data) {
            if (exists == 0) {
                console.log("no statements found for this course.");
            } else {
                var obj = jQuery.parseJSON(data);
                statementsArr = obj.statements;
                totalQ = statementsArr.length;
                for (var i = 0; i < totalQ; i++) {
                    directionArray[i] = 0;
                }
                $("#progress").html("<strong>" + (count + 1) + "</strong> out of <strong>" + totalQ + "</strong>");
            }
        })
        .fail(function (data) {
            console.log("Error: cannot insert course");
        });
}

/** ####################################################################################################
 *  DESCRIPTION: 
 *      sets user, if user exists, then throws an error, else continues
 *  PARAMETER(S):
 *      none
 */
function setUser() {
    var posting = $.post(window.location.pathname + "/../../pwalkuser.php", {
        msg: 'set',
        name: $("#name").val(),
        walk_id: walk_id,
        avatar_face: faceShapeNum,
        avatar_face_color: faceColorNum,
        avatar_hair: hairShapeNum,
        avatar_hair_color: hairColorNum,
        avatar_shirt: shirtNum,
        avatar_accessory: accessoryNum
    });
    posting.done(function (data) {
        var obj = jQuery.parseJSON(data);
        user_id = obj.user_id;
        var exist = obj.exist;
        if (exist == 0) {
            isStepOne = false;
            $("#input-modal--background").css("z-index", "10000");
            $("#input-modal--background").addClass("animated bounceOutUp").delay(2000).queue(function () {
                $("#input-modal--background").hide();
            });
            $("#statement-modal--background").show();
            showAstmt();
            $("#back").prop("disabled", true);
            $("#next").prop("disabled", true);
            openHelp();
            $("#statement-modal--navigation-container button").prop("disabled", true);
        } else {
            $("#nameErrorMsg").html("Username already taken. Please choose a different name.").css("color", "#800000");
        }
    }).fail(function (data) {
        alert("Error: cannot insert course");
    });
}

/** ####################################################################################################
 *  DESCRIPTION: 
 *      sets direction into database
 *  PARAMETER(S):
 *      is_finished = set to 0 for incomplete and 1 for complete
 */
function setDirection(is_finished) {
    var posting = $.post(window.location.pathname + "/../../pwalkresponse.php", {
        direction: direction,
        user_id: user_id,
        statement_id: count,
        is_finished: is_finished
    });
    posting.done(function (data) {
            if (is_finished == 1) {
                var key = location.search;
                key = key.substring(1, key.length);
                key = encodeURIComponent(key);
                var username = encodeURIComponent($("#name").val());
                var url = window.location.pathname + "/../../response/index.html?" + key + "&" + username;

                $("#done-modal--background").show();
                $("#done-modal--msg-container").append("<p id='showNameAgain'>" + $("#name").val() + "</p><p><a id='linkToNextActivity' target='_blank' href='" + url + "'>CLICK TO REVIEW ANSWERS</a></p>");
                $("#done-modal").addClass("animated bounceInDown");
                $(".step").prop("disabled", true);
                $("#statement-modal--navigation-container button").prop("disabled", true);
            }
        })
        .fail(function (data) {
            alert("Error: cannot insert course");
        });
}

/** ####################################################################################################
 *  DESCRIPTION: 
 *      shows a statement and disables the button which is not used
 *  PARAMETER(S): 
 *      none
 *  NOTE: 
 *      does not increment
 */
function showAstmt() {
    $("#statement").html(statementsArr[count].statement);
    if (statementsArr[count].direction == 1) {
        $("#stepForward").prop("disabled", false);
        $("#stepBack").prop("disabled", true);
    } else {
        $("#stepForward").prop("disabled", true);
        $("#stepBack").prop("disabled", false);
    }
}

/** ####################################################################################################
 *  DESCRIPTION: 
 *      sets the direction
 *  PARAMETER(S):
 *      x = the direction the avatar will move (-1 for back, 0 for stand still, and 1 for forward)
 */
function move(x) {
    direction = x;
}

/** #################################################################################################### 
 *  DESCRIPTION: 
 *      shows the current avatar on the statement page will print shirt, face, accessory(below hair), hair, accessory(over hair), name in that order
 *  PARAMETER(S): 
 *      none
 */
function showCurrentUser() {
    // print shirt 
    var shirt = $("#shirt" + shirtNum).attr("src");
    $("#currentAvatar").html("<img class='shirt' src='" + shirt + "' alt=''>");
    // print face
    var face = $("#c" + faceColorNum + "face" + faceShapeNum).attr("src");
    $("#currentAvatar").append("<img class='face' src='" + face + "' alt=''>");
    // print accessory 
    if (accessoryNum != 0 && accessoryNum != 9) {
        var accessory = $("#accessory" + accessoryNum).attr("src");
        $("#currentAvatar").append("<img class='accessory' src='" + accessory + "' alt=''>");
    }
    // print hair
    if (hairShapeNum != 0) {
        var hair = $("#c" + hairColorNum + "hair" + hairShapeNum).attr("src")
        $("#currentAvatar").append("<img  src='" + hair + "' alt=''>");
    }
    // print accessory
    if (accessoryNum == 9) {
        var accessory = $("#accessory" + accessoryNum).attr("src");
        $("#currentAvatar").append("<img class='accessory' src='" + accessory + "' alt=''>");
    }
    // print name
    $("#currentName").html($("#name").val());
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
        $("#help-modal--container").html("<h3>Step 1: Create an avatar</h3><p>Choose an appropriate name for your avatar and design your avatar in any way you like. You will need to <span class='important'>remember your avatar's name</span> for the next part of this activity. Keep in mind, <span class='important'>your avatar's name will be seen by your peers.</p>");
    }
    // else if second help button
    else {
        $("#help-modal--container").html("<h3>Step 2: Answer statements</h3>" +
            "<p>You will be presented with a number of statements. Read each statement. If you agree with the statement, click on either the <strong>Step Forward</strong> or <strong>Step Back</strong> button. If you don't think the statement applies to you, click on the <strong>Stand Still</strong> button.</p>" +
            "<h3 style='text-align:center;'>Keyboard Shortcuts</h3>" +
            "<table style='margin:auto;'> <col width='50'><tr><th class='center'>Keys</th><th>Action</th></tr> <tr><td class='center'>1</th><td>Step Back</td></tr> <tr><td class='center'>2</td><td>Stand Still</td></tr> <tr><td class='center'>3</td><td>Step Forward</td></tr> <tr><td class='center'>B</td><td>Back Statement</td></tr> <tr><td class='center'>N</td><td>Next Statement</td></tr> <tr><td class='center'>H</td><td>Toggle Help Window</td></table>");
    }
    // disable all background buttons
    $(".choiceButton").prop("disabled", true);
    $("#random").prop("disabled", true);
    $("#done").prop("disabled", true);
    $("#name").prop("disabled", true);
    $(".step").prop("disabled", true);
    $("#statement-modal--navigation-container button").prop("disabled", true);
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
    // enable all background buttons
    $(".choiceButton").prop("disabled", false);
    $("#random").prop("disabled", false);
    $("#done").prop("disabled", false);
    $("#name").prop("disabled", false);
    $(".step").prop("disabled", false);
    // displays a statement
    showAstmt();
    // if not the first question enable back
    if (count != 0) {
        $("#back").prop("disabled", false);
    }
    // else disable back
    else {
        $("#back").prop("disabled", true);
    }
    // if statement is answered then 'next' is enabled
    if (directionArray[count] != 0) {
        $("#next").prop("disabled", false);
    }
    // else 'next' is disabled  
    else {
        $("#next").prop("disabled", true);
    }
}