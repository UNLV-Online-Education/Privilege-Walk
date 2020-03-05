var defaultStatements = [];

var saveTextarea = [];
var saveArrow = [];
var reviewBool = false;
var minStatements = false;
var cancelDeleteTimer = false;
var defaultBool = true;

var x = 0;
var importStatementText = [];
var importStatementDirection = [];

$.getJSON("../assets/data/statement.json", function(data) {
  console.log("export Statements; first");

  for (var i = 0; i < data.statements.length; i++) {
    var k = i + 1;

    var statement = document.createElement("li");
    var input = document.createElement("input");

    var statementLi = "#li" + k;
    var statementCheckbox = "#checkbox_" + k;

    var statementLi2 = "li" + k;
    var statementCheckbox2 = "checkbox_" + k;

    $(input)
      .attr("type", "checkbox")
      .attr("id", statementCheckbox2);

    $(statement)
      .attr("id", statementLi2)
      .append(input);

    $("#import-statements").append(statement);

    defaultStatements[i] = data.statements[i].dir;
    $(statementLi).append(data.statements[i].statement);
    $(statementCheckbox).val(data.statements[i].statement);
  }

  documentReady();
});

function resetFormfieldsAndClearLocalStorage() {
  document.getElementById("statement-form").reset();
  localStorage.removeItem("courseNumber");
  localStorage.removeItem("coursePrefix");
  localStorage.removeItem("courseSection");
  localStorage.removeItem("institution");
  localStorage.removeItem("semester-choice");
  localStorage.removeItem("year");

  $("input").removeClass("InputPlaceHolderColor");
  $("#institution")
    .attr("placeholder", "Institution e.g. UNLV")
    .css("border-color", "#ddd");
  $("#coursePrefix")
    .attr("placeholder", "Prefix e.g. WMST")
    .css("border-color", "#ddd");
  $("#courseNumber")
    .attr("placeholder", "Number e.g. 113")
    .css("border-color", "#ddd");
  $("#courseSection")
    .attr("placeholder", "Section e.g. 1001")
    .css("border-color", "#ddd");
  $("#year")
    .attr("placeholder", "Year")
    .css("border-color", "#ddd");

  $("#institution-veri").removeClass("required");
  $("#course-prefix-number-veri").removeClass("required");
  $("#course-number-veri").removeClass("required");
  $("#course-section-number-veri").removeClass("required");
  $("#semesterChoicesVeri").removeClass("required");
  $("#semesterChoices").css({
    "border-color": "#ddd",
    color: "#888"
  });
  $("#year-veri").removeClass("required");
}

var autoExpand = function(field) {
  field.style.height = "";

  var computed = window.getComputedStyle(field);

  var height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    field.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);
  field.style.height = height + "px";
};

document.addEventListener(
  "input",
  function(event) {
    if (event.target.tagName.toLowerCase() !== "textarea") return;
    autoExpand(event.target);
  },
  false
);

// exportStatements.done($(document).ready(function () {

function documentReady() {
  console.log("document ready; second");

  var institutionStorage = document.getElementById("institution");
  var coursePrefixStorage = document.getElementById("coursePrefix");
  var courseNumberStorage = document.getElementById("courseNumber");
  var courseSectionStorage = document.getElementById("courseSection");
  var yearStorage = document.getElementById("year");
  var institutionStoredVAlue = localStorage.getItem("institution");
  var coursePrefixStoredValue = localStorage.getItem("coursePrefix");
  var courseNumberStoredValue = localStorage.getItem("courseNumber");
  var courseSectionStoredValue = localStorage.getItem("courseSection");
  var yearStoredValue = localStorage.getItem("year");

  if (localStorage.getItem("x") < 10) {
    minStatements = false;
    if (minStatements == false) {
      $("#next").css("pointer-events", "none");
      $("#next").css("opacity", "0.5");
    }
  }
  for (var i = 0; i < localStorage.getItem("x"); i++) {
    var storageToArray = "textareaID_" + i;
    saveTextarea[i] = localStorage.getItem(storageToArray);
    var storageToArrow = "arrow" + i;
    saveArrow[i] = parseInt(localStorage.getItem(storageToArrow));
  }

  $("input").keyup(function() {
    localStorage.setItem("institution", institutionStorage.value);
    localStorage.setItem("coursePrefix", coursePrefixStorage.value);
    localStorage.setItem("courseNumber", courseNumberStorage.value);
    localStorage.setItem("courseSection", courseSectionStorage.value);
    localStorage.setItem("year", yearStorage.value);
  });

  institutionStorage.value = institutionStoredVAlue;
  coursePrefixStorage.value = coursePrefixStoredValue;
  courseNumberStorage.value = courseNumberStoredValue;
  courseSectionStorage.value = courseSectionStoredValue;
  yearStorage.value = yearStoredValue;

  $("nav a#list1").addClass("active");

  $(function() {
    $("#semesterChoices").change(function() {
      localStorage.setItem("semester-choice", this.value);
    });
    if ("semester-choice" in localStorage) {
      $("#semesterChoices").val(localStorage.getItem("semester-choice"));
      $("#semesterChoices").css("opacity", "1");
      $("#semesterChoices").css("color", "#264f23");
    }
  });

  if ("x" in localStorage) {
    defaultBool = false;
    for (var i = 0; i < localStorage.getItem("x"); i++) {
      CreateStatementsList();
      x++;
      if (x >= 1) {
        minStatements = true;
      }
      if (minStatements == true) {
        $("#next").css("pointer-events", "auto");
        $("#next").css("opacity", "1");
      }
    }
    localStorage.setItem("x", x);
  } else {
    for (var i = 0; i < 38; i++) {
      CreateStatementsList();
      x++;
      if (x >= 1) {
        minStatements = true;
      }
      if (minStatements == true) {
        $("#next").css("pointer-events", "auto");
        $("#next").css("opacity", "1");
      }
    }
    localStorage.setItem("x", x);
  }

  $("#import-btn").click(function() {
    if ($("#checkAll").is(":checked")) {
      if (x + 38 < 50) {
        for (var k = 0; k < 38; k++) {
          m = k + 1;
          var checkbox = "#checkbox_" + m;
          if ($(checkbox).is(":checked")) {
            generateStatement();
            var z = x - 1;
            var textareaId = "#textareaID_" + z;
            var textareaId2 = "textareaID_" + z;
            $(textareaId).val($(checkbox).val());
            localStorage.setItem(textareaId2, $(checkbox).val());
            saveTextarea[z] = $(textareaId).val();
            if (defaultStatements[m - 1] == 1) {
              var tmpLightArrowId = "#lightForwardArrow_" + z;
              var tmpDarkArrowId = "#darkForwardArrow_" + z;
              $(tmpDarkArrowId).addClass("showDisplay");
              $(tmpLightArrowId).addClass("hidden");
              saveArrow[z] = 1;
              localStorage.setItem("arrow" + z, "1");
            }
            if (defaultStatements[m - 1] == -1) {
              var tmpLightArrowId2 = "#lightBackwardArrow_" + z;
              var tmpDarkArrowId2 = "#darkBackwardArrow_" + z;
              $(tmpDarkArrowId2).addClass("showDisplay");
              $(tmpLightArrowId2).addClass("hidden");
              saveArrow[z] = -1;
              localStorage.setItem("arrow" + z, "-1");
            }
            $(checkbox).prop("checked", false);
          }
        }
        $("#checkAll").prop("checked", false);
      } else {
        for (var k = 0; k < 39; k++) {
          var checkbox = "#checkbox_" + k;
          $(checkbox).prop("checked", false);
        }
        $("#checkAll").prop("checked", false);
        $("#max-statements").removeClass("invisible");
        $("#max-statements").addClass("visible");

        setTimeout(function() {
          $("#max-statements").removeClass("visible");
          $("#max-statements").addClass("invisible");
        }, 5000);
      }

      $(function() {
        $("textarea").each(function() {
          this.style.height = this.scrollHeight + 2 + "px";
        });
      });
      $("html, body").animate({
        scrollTop: $(document).height()
      });
    } else {
      for (var k = 0; k < 38; k++) {
        m = k + 1;
        var checkbox = "#checkbox_" + m;

        if ($(checkbox).is(":checked")) {
          generateStatement();
          var z = x - 1;
          var textareaId = "#textareaID_" + z;
          var textareaId2 = "textareaID_" + z;

          $(textareaId).val($(checkbox).val());
          localStorage.setItem(textareaId2, $(checkbox).val());
          saveTextarea[z] = $(textareaId).val();

          if (defaultStatements[m - 1] == 1) {
            var tmpLightArrowId = "#lightForwardArrow_" + z;
            var tmpDarkArrowId = "#darkForwardArrow_" + z;
            $(tmpDarkArrowId).addClass("showDisplay");
            $(tmpLightArrowId).addClass("hidden");
            saveArrow[z] = 1;
            localStorage.setItem("arrow" + z, "1");
          }
          if (defaultStatements[m - 1] == -1) {
            var tmpLightArrowId2 = "#lightBackwardArrow_" + z;
            var tmpDarkArrowId2 = "#darkBackwardArrow_" + z;
            $(tmpDarkArrowId2).addClass("showDisplay");
            $(tmpLightArrowId2).addClass("hidden");
            saveArrow[z] = -1;
            localStorage.setItem("arrow" + z, "-1");
          }
          $(checkbox).prop("checked", false);
        }
      }
      $(function() {
        $("textarea").each(function() {
          this.style.height = this.scrollHeight + 2 + "px";
        });
      });
      $("html, body").animate({
        scrollTop: $(document).height()
      });
      $("#checkAll").prop("checked", false);
    }
  });

  var timer;

  $("body").on("click", "button.trashcan", function() {
    $("#add-Statement").css("pointer-events", "none");
    $("#add-Statement").css("opacity", "0.5");
    $(".dropdown").css("pointer-events", "none");
    $(".dropdown").css("opacity", "0.5");
    $(".fa-arrows-alt").css("pointer-events", "none");
    $(".fa-arrows-alt").css("opacity", "0.5");

    clearInterval(timer);
    cancelDeleteTimer = false;

    getId = $(this).prop("id");
    var tmp = getId.split("_")[1];

    var selectedListToDelete = "listID_" + tmp;

    if (localStorage.getItem("tmpUndo") !== null) {
      deleteStatement();
    }

    localStorage.setItem("tmpUndo", selectedListToDelete);

    var hideTheSelectedList = document.getElementById(selectedListToDelete);
    $(hideTheSelectedList).addClass("hidden");

    minStatements = false;

    if (minStatements == false) {
      $("#next").css("pointer-events", "none");
      $("#next").css("opacity", "0.5");
    }

    $("#undo").removeClass("invisible");
    $("#undo").addClass("visible");

    timer = setTimeout(function() {
      if (cancelDeleteTimer == false) {
        $("#undo").removeClass("visible");
        $("#undo").addClass("invisible");
        $(".dropdown").css("pointer-events", "auto");
        $(".dropdown").css("opacity", "1");
        $("#add-Statement").css("pointer-events", "auto");
        $("#add-Statement").css("opacity", "1");
        $(".fa-arrows-alt").css("pointer-events", "auto");
        $(".fa-arrows-alt").css("opacity", "1");

        deleteStatement();
        renameStatement();
        document.getElementById("import").disabled = false;
        if (x >= 1) {
          minStatements = true;
        }
        if (minStatements == true) {
          $("#next").css("pointer-events", "auto");
          $("#next").css("opacity", "1");
        }
      }
    }, 5000);
  });

  $("#undo").click(function() {
    document.getElementById("import").disabled = false;
    $("#undo").removeClass("visible");
    $("#undo").addClass("invisible");
    $(".dropdown").css("pointer-events", "auto");
    $(".dropdown").css("opacity", "1");

    $("#add-Statement").css("pointer-events", "auto");
    $("#add-Statement").css("opacity", "1");

    $(document.getElementById(localStorage.getItem("tmpUndo"))).removeClass(
      "hidden"
    );
    $(document.getElementById(localStorage.getItem("tmpUndo"))).addClass(
      "showDisplay"
    );

    renameStatement();
    cancelDeleteTimer = true;
    localStorage.removeItem("tmpUndo");
    if (x >= 1) {
      minStatements = true;
    }
    if (minStatements == true) {
      $("#next").css("pointer-events", "auto");
      $("#next").css("opacity", "1");
    }
    $(".fa-arrows-alt").css("pointer-events", "auto");
    $(".fa-arrows-alt").css("opacity", "1");
  });

  function deleteStatement() {
    var tmpUndo = document.getElementById(localStorage.getItem("tmpUndo"));
    $(tmpUndo).remove();
    if (x !== 0) x--;
    localStorage.setItem("x", x);

    var tmp_textarea =
      "textareaID_" + localStorage.getItem("tmpUndo").split("_")[1];
    saveTextarea.splice(localStorage.getItem("tmpUndo").split("_")[1], 1);
    localStorage.removeItem(tmp_textarea);

    var tmpArrow = "arrow" + localStorage.getItem("tmpUndo").split("_")[1];
    saveArrow.splice(localStorage.getItem("tmpUndo").split("_")[1], 1);
    localStorage.removeItem(tmpArrow);

    if (minStatements == false) {
      $("#next").css("pointer-events", "none");
      $("#next").css("opacity", "0.5");
    }
    localStorage.removeItem("tmpUndo");
  }

  function renameStatement() {
    var tmpArray = [];
    var orderedList = document.getElementById("sList");
    var items = orderedList.getElementsByTagName("li");

    for (var o = 0; o < items.length; ++o) {
      tmpArray[o] = items[o].id.split("_")[1];
    }

    for (var i = 0; i < x; i++) {
      if (parseInt(tmpArray[i]) !== i) {
        var k = i + 1;
        var labelID_tmp = "labelID_" + tmpArray[i];
        var label_ele = document.getElementById(labelID_tmp);
        label_ele.innerHTML = "Statement " + k + ":";
      }
    }

    for (var i = 0; i < x; i++) {
      var listID_tmp = "listID_" + tmpArray[i];
      var labelID_tmp = "labelID_" + tmpArray[i];
      var paraId_tmp = "paragraphID_" + tmpArray[i];
      var sectionID_tmp = "sectionID_" + tmpArray[i];
      var textareaId_tmp = "textareaID_" + tmpArray[i];
      var right_id_tmp = "rightId_" + tmpArray[i];
      var light_arrow_tmp = "lightBackwardArrow_" + tmpArray[i];
      var dark_arrow_tmp = "darkBackwardArrow_" + tmpArray[i];
      var left_id_tmp = "leftId_" + tmpArray[i];
      var light_arrow_tmp2 = "lightForwardArrow_" + tmpArray[i];
      var dark_arrow_tmp2 = "darkForwardArrow_" + tmpArray[i];
      var trashcanId_tmp = "trashcanID_" + tmpArray[i];
      var errorTextID_tmp = "errorTextID_" + tmpArray[i];

      var list_ele = document.getElementById(listID_tmp);
      var label_ele = document.getElementById(labelID_tmp);
      var para_ele = document.getElementById(paraId_tmp);
      var section_ele = document.getElementById(sectionID_tmp);
      var textareaEle = document.getElementById(textareaId_tmp);
      var right_ele = document.getElementById(right_id_tmp);
      light_arrow_ele = document.getElementById(light_arrow_tmp);
      dark_arrow_ele = document.getElementById(dark_arrow_tmp);
      var left_ele = document.getElementById(left_id_tmp);
      light_arrow_ele2 = document.getElementById(light_arrow_tmp2);
      dark_arrow_ele2 = document.getElementById(dark_arrow_tmp2);
      var trashcan_ele = document.getElementById(trashcanId_tmp);
      var errorTextID_ele = document.getElementById(errorTextID_tmp);

      list_ele.id = "listsID_" + i;
      label_ele.id = "labelsID_" + i;
      para_ele.id = "paragraphsID_" + i;
      section_ele.id = "sectionsID_" + i;
      textareaEle.id = "textareasID_" + i;
      right_ele.id = "rightsId_" + i;
      light_arrow_ele.id = "lightArrowsA2_" + i;
      dark_arrow_ele.id = "darkArrowsB2_" + i;
      left_ele.id = "leftsId_" + i;
      light_arrow_ele2.id = "lightArrowsA_" + i;
      dark_arrow_ele2.id = "darkArrowsB_" + i;
      trashcan_ele.id = "trashcansID_" + i;
      errorTextID_ele.id = "errorTextsID_" + i;
    }

    for (var i = 0; i < x; i++) {
      var listID_tmp = "listsID_" + i;
      var labelID_tmp = "labelsID_" + i;
      var paraId_tmp = "paragraphsID_" + i;
      var sectionID_tmp = "sectionsID_" + i;
      var textareaId_tmp = "textareasID_" + i;
      var right_id_tmp = "rightsId_" + i;
      var light_arrow_tmp = "lightArrowsA2_" + i;
      var dark_arrow_tmp = "darkArrowsB2_" + i;
      var left_id_tmp = "leftsId_" + i;
      var light_arrow_tmp2 = "lightArrowsA_" + i;
      var dark_arrow_tmp2 = "darkArrowsB_" + i;
      var trashcanId_tmp = "trashcansID_" + i;
      var errorTextID_tmp = "errorTextsID_" + i;

      var list_ele = document.getElementById(listID_tmp);
      var label_ele = document.getElementById(labelID_tmp);
      var para_ele = document.getElementById(paraId_tmp);
      var section_ele = document.getElementById(sectionID_tmp);
      var textareaEle = document.getElementById(textareaId_tmp);
      var right_ele = document.getElementById(right_id_tmp);
      var light_arrow_ele = document.getElementById(light_arrow_tmp);
      var dark_arrow_ele = document.getElementById(dark_arrow_tmp);
      var left_ele = document.getElementById(left_id_tmp);
      var light_arrow_ele2 = document.getElementById(light_arrow_tmp2);
      var dark_arrow_ele2 = document.getElementById(dark_arrow_tmp2);
      var trashcan_ele = document.getElementById(trashcanId_tmp);
      var errorTextID_ele = document.getElementById(errorTextID_tmp);

      list_ele.id = "listID_" + i;
      label_ele.id = "labelID_" + i;
      para_ele.id = "paragraphID_" + i;
      section_ele.id = "sectionID_" + i;
      textareaEle.id = "textareaID_" + i;
      right_ele.id = "rightId_" + i;
      light_arrow_ele.id = "lightBackwardArrow_" + i;
      dark_arrow_ele.id = "darkBackwardArrow_" + i;
      left_ele.id = "leftId_" + i;
      light_arrow_ele2.id = "lightForwardArrow_" + i;
      dark_arrow_ele2.id = "darkForwardArrow_" + i;
      trashcan_ele.id = "trashcanID_" + i;
      errorTextID_ele.id = "errorTextID_" + i;
    }

    for (var i = 0; i < x; i++) {
      var renameTextarea = "textareaID_" + i;
      var renameTextareaEle = document.getElementById(renameTextarea);

      localStorage.setItem(renameTextarea, renameTextareaEle.value);
      saveTextarea[i] = renameTextareaEle.value;

      var renameArrow = "arrow" + i;
      if (saveArrow[i] !== null)
        localStorage.setItem(renameArrow, saveArrow[i]);
    }

    var maxStatements = 50;

    for (var j = x; j < maxStatements; j++) {
      var checkifTextarea = "textareaID_" + j;
      if (checkifTextarea in localStorage) {
        localStorage.removeItem(checkifTextarea);
      }
      var checkIfArrow = "arrow" + j;
      if (checkIfArrow in localStorage) {
        localStorage.removeItem(checkIfArrow);
      }
    }
  }

  $("#semesterChoices").change(function() {
    $(this).css("opacity", "1");
    $("#semesterChoices").css("color", "#264f23");
  });

  $("#back").click(function() {
    $("#PW-title").html("Privilege Walk");
    $("#info").addClass("invisible");
    $("#kebab").addClass("invisible");
    $("#part2").toggleClass("visible invisible");
    $("#part1").toggleClass("invisible visible");
    $("nav a#list1").toggleClass("active");
    $("nav a#list2").toggleClass("active");
    $("footer").css("border-radius", "0 0 25px 25px");
  });

  $("#next").click(function() {
    validateTextareasAndArrows();

    if (reviewBool == true) {
      generateReview();
      $("nav a#list2").toggleClass("active");
      $("nav a#list3").toggleClass("active");
    }
  });

  $("#review-back").click(function() {
    $("#PW-title").html("Create Statements");
    $("#info").removeClass("invisible");
    $("#kebab").removeClass("invisible");
    $("footer").css("border-radius", "0");
    $("#part3").toggleClass("visible invisible");
    $("#part2").toggleClass("invisible visible");
    $("nav a#list3").toggleClass("active");
    $("nav a#list2").toggleClass("active");
    reviewBool = false;
    $(function() {
      $("textarea").each(function() {
        this.style.height = this.scrollHeight + 2 + "px";
      });
    });
  });

  $("#review-next").click(function() {
    $("#PW-title").html("Complete");
    $("#print-btn").removeClass("invisible");
    $("header").addClass("no-print");
    $("#part3").toggleClass("visible invisible");
    $("#part4").toggleClass("invisible visible");
    $("nav a#list3").toggleClass("active");
    $("nav a#list4").toggleClass("active");
    generate();
    localStorage.clear();
    $(".content").css("border-radius", "0 0 25px 25px");
    generateLinks();
  });

  $("#form-next").click(function() {
    $(function() {
      $("textarea").each(function() {
        this.style.height = this.scrollHeight + 2 + "px";
      });

      var iModal = document.getElementById("instruction-modal");

      iModal.style.display = "block";
      $("body").addClass("modal-open");
      var detectScroll = document.documentElement;

      if (detectScroll.scrollHeight > detectScroll.clientHeight) {
        $("footer").css("border-radius", "0");
      }
    });
    validateForm();
    storeText();
    generateArrow();
  });

  $(document).scroll(function() {
    if ($(window).scrollTop() > 50) {
      $(".pw-container-title").css("border-radius", "0");
    } else if ($(window).scrollTop() < 50) {
      $(".pw-container-title").css("border-top-right-radius", "25px");
      $(".pw-container-title").css("border-top-left-radius", "25px");
    }

    var detectScroll = document.documentElement;
    if (detectScroll.scrollHeight !== detectScroll.clientHeight) {
      $("footer").css("border-radius", "0");
    }

    var scrollHeight, totalHeight;
    scrollHeight2 = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;

    if (totalHeight >= scrollHeight2) {
      $("footer").css("border-radius", "0 0 25px 25px");
    }
  });

  $("#delete-all").click(function() {
    $(".modal-overlay").removeClass("invisible");
    $(".modal-overlay").addClass("visible");
    $("#delete-veri").removeClass("invisible");
    $("#delete-veri").addClass("visible");
  });

  $("#delete-cancel").click(function() {
    $(".modal-overlay").removeClass("visible");
    $(".modal-overlay").addClass("invisible");
    $("#delete-veri").removeClass("visible");
    $("#delete-veri").addClass("invisible");
  });

  $("#delete-yes").click(function() {
    $(".modal-overlay").removeClass("visible");
    $(".modal-overlay").addClass("invisible");
    $("#delete-veri").removeClass("visible");
    $("#delete-veri").addClass("invisible");

    deleteAll();

    for (var i = 0; i < 1; i++) {
      defaultBool = false;
      CreateStatementsList();
      x++;
    }
    localStorage.setItem("x", x);
  });

  $(".dropdown").click(function() {
    $(".dropdown-content").slideToggle();
  });

  $(document).click(function(e) {
    e.stopPropagation();
    var container = $(".dropdown");

    if (container.has(e.target).length === 0) {
      $(".dropdown-content").hide();
    }
  });

  $("#import-prev").click(function() {
    $("#textarea-key").each(function() {
      this.style.height = this.scrollHeight + 3 + "rem";
    });
    $(".modal-overlay").removeClass("invisible");
    $(".modal-overlay").addClass("visible");
    $("#import-prev-veri").removeClass("invisible");
    $("#import-prev-veri").addClass("visible");
  });

  $("#import-prev-cancel").click(function() {
    $(".modal-overlay").removeClass("visible");
    $(".modal-overlay").addClass("invisible");
    $("#import-prev-veri").removeClass("visible");
    $("#import-prev-veri").addClass("invisible");
  });

  $("#import-prev-confirm").click(function() {
    var veriTextarea = document.getElementById("textarea-key");

    if (veriTextarea.value !== "") {
      $(".modal-overlay").removeClass("visible");
      $(".modal-overlay").addClass("invisible");
      $("#import-prev-veri").removeClass("visible");
      $("#import-prev-veri").addClass("invisible");
      $("#textarea-key").removeClass("InputPlaceHolderColor");
      $("#textarea-key").attr("placeholder", "Enter key here...");
      $("#textarea-key").css("border-color", "");

      // getWalk($("#textarea-key").val());
      getWalk(DOMPurify.sanitize(veriTextarea.value));
    } else {
      $("#textarea-key").css("border-color", "red");
      $("#textarea-key").attr("placeholder", "This field cannot be left empty");
      $("#textarea-key").addClass("InputPlaceHolderColor");
    }
  });

  $("#checkAll").click(function() {
    $("input:checkbox")
      .not(this)
      .prop("checked", this.checked);
    $("#import-modal").animate(
      {
        scrollTop: $("#import-btn").offset().top
      },
      "slow"
    );
  });
}

function getWalk(key) {
  $.post(window.location.pathname + "/../../pwalkwalk.php", {
    msg: "get",
    hash: key
  })
    .done(function(data) {
      var obj = jQuery.parseJSON(data);
      exists = obj.exists;
      if (exists == 0) {
        console.log("no course found");
      } else {
        var id = obj.walk_id;
        getStatement(id);
      }
    })
    .fail(function(data) {
      console.log("Error: cannot insert course");
    });
}

function getStatement(id) {
  var posting = $.post(window.location.pathname + "/../../pwalkstatement.php", {
    msg: "get",
    walk_id: id
  });
  posting
    .done(function(data) {
      var obj = jQuery.parseJSON(data);
      var exists = obj.exists;
      if (exists == 0) {
        console.log("no statements found for this course.");
      } else {
        var statementsArr = obj.statements;
        for (var z = 0; z < statementsArr.length; z++) {
          importStatementText[z] = statementsArr[z].statement;
          importStatementDirection[z] = statementsArr[z].dir;
        }

        deleteAll();
        for (var i = 0; i < importStatementText.length; i++) {
          var importStatement = "textareaID_" + i;
          defaultBool = false;
          CreateStatementsList();
          document.getElementById(importStatement).value =
            importStatementText[i];
          x++;
        }
        generateArrowV2(importStatementDirection);
        for (var i = 0; i < importStatementDirection.length; i++) {
          var importArrow = "arrow" + i;
          saveArrow[i] = importStatementDirection[i];
          localStorage.setItem(importArrow, saveArrow[i]);
        }
        for (var i = 0; i < importStatementText.length; i++) {
          var importStatement = "textareaID_" + i;
          saveTextarea[i] = importStatementText[i];
          localStorage.setItem(importStatement, saveTextarea[i]);
        }
        localStorage.setItem("x", x);
      }
    })
    .fail(function(data) {
      console.log("Error: cannot insert course");
    });
}

function validateForm() {
  var noFieldLeftBehind = false;

  var cleanInstitutionVeri = DOMPurify.sanitize(
    document.forms["sform"]["institution"].value
  );
  var cleanPrefixVeri = DOMPurify.sanitize(
    document.forms["sform"]["coursePrefix"].value
  );
  var cleanNumVeri = DOMPurify.sanitize(
    document.forms["sform"]["courseNumber"].value
  );
  var cleanSectionVeri = DOMPurify.sanitize(
    document.forms["sform"]["courseSection"].value
  );
  var cleanYearVeri = DOMPurify.sanitize(document.forms["sform"]["year"].value);

  var institutionVeri = cleanInstitutionVeri;
  document.getElementById("institution").value = cleanInstitutionVeri;
  var prefixVeri = cleanPrefixVeri;
  document.getElementById("coursePrefix").value = cleanPrefixVeri;
  var numVeri = cleanNumVeri;
  document.getElementById("courseNumber").value = cleanNumVeri;
  var sectionVeri = cleanSectionVeri;
  document.getElementById("courseSection").value = cleanSectionVeri;
  var yearVeri = cleanYearVeri;
  document.getElementById("year").value = cleanYearVeri;

  var seasonVeri = document.getElementById("semesterChoices");

  if (
    institutionVeri == "" ||
    !validator.isAlphanumeric(institutionVeri) ||
    (prefixVeri == "" || !validator.isAlphanumeric(prefixVeri)) ||
    (numVeri == "" || !validator.isAlphanumeric(numVeri)) ||
    (sectionVeri == "" || !validator.isAlphanumeric(sectionVeri)) ||
    (yearVeri == "" || !validator.isAlphanumeric(yearVeri)) ||
    seasonVeri.value == ""
  ) {
    $("#form-validator").addClass("hide");

    if (institutionVeri == "" || !validator.isAlphanumeric(institutionVeri)) {
      $("#institution")
        .css({
          border: "2px solid",
          "border-color": "rgb(148, 1, 21)"
        })
        .attr(
          "placeholder",
          "Field cannot be left empty (Institution e.g. UNLV)"
        )
        .addClass("InputPlaceHolderColor");
      $("#institution-veri").addClass("required");
      if (
        !validator.isAlphanumeric(institutionVeri) &&
        !(institutionVeri == "")
      )
        $("#form-validator").removeClass("hide");
    }
    $("#institution").keyup(function() {
      $("#institution")
        .css("border-color", "#ddd")
        .attr("placeholder", "Prefix e.g. WMST")
        .removeClass("InputPlaceHolderColor");
      $("#institution-veri").removeClass("required");
    });
    if (prefixVeri == "" || !validator.isAlphanumeric(prefixVeri)) {
      $("#coursePrefix")
        .css({
          border: "2px solid",
          "border-color": "rgb(148, 1, 21)"
        })
        .attr("placeholder", "Field cannot be left empty (Prefix e.g. WMST)")
        .addClass("InputPlaceHolderColor");
      $("#course-prefix-number-veri").addClass("required");
      if (!validator.isAlphanumeric(prefixVeri) && !(prefixVeri == ""))
        $("#form-validator").removeClass("hide");
    }
    $("#coursePrefix").keyup(function() {
      $("#coursePrefix")
        .css("border-color", "#ddd")
        .attr("placeholder", "Prefix e.g. WMST")
        .removeClass("InputPlaceHolderColor");
      $("#course-prefix-number-veri").removeClass("required");
    });
    if (numVeri == "" || !validator.isAlphanumeric(numVeri)) {
      $("#courseNumber")
        .css({
          border: "2px solid",
          "border-color": "rgb(148, 1, 21)"
        })
        .attr("placeholder", "Field cannot be left empty (Number e.g. 113)")
        .addClass("InputPlaceHolderColor");
      $("#course-number-veri").addClass("required");
      if (!validator.isAlphanumeric(numVeri) && !(numVeri == ""))
        $("#form-validator").removeClass("hide");
    }
    $("#courseNumber").keyup(function() {
      $("#courseNumber")
        .css("border-color", "#ddd")
        .attr("placeholder", "Number e.g. 113")
        .removeClass("InputPlaceHolderColor");
      $("#course-number-veri").removeClass("required");
    });
    if (sectionVeri == "" || !validator.isAlphanumeric(sectionVeri)) {
      $("#courseSection")
        .css({
          border: "2px solid",
          "border-color": "rgb(148, 1, 21)"
        })
        .attr("placeholder", "Field cannot be left empty (Section e.g. 1001)")
        .addClass("InputPlaceHolderColor");
      $("#course-section-number-veri").addClass("required");
      if (!validator.isAlphanumeric(sectionVeri) && !(sectionVeri == ""))
        $("#form-validator").removeClass("hide");
    }
    $("#courseSection").keyup(function() {
      $("#courseSection")
        .css("border-color", "#ddd")
        .attr("placeholder", "Section e.g. 1001")
        .removeClass("InputPlaceHolderColor");
      $("#course-section-number-veri").removeClass("required");
    });
    if (yearVeri == "" || !validator.isAlphanumeric(yearVeri)) {
      $("#year")
        .css({
          border: "2px solid",
          "border-color": "rgb(148, 1, 21)"
        })
        .attr("placeholder", "Field cannot be left empty (Year e.g. 2019)")
        .addClass("InputPlaceHolderColor");
      $("#year-veri").addClass("required");
      if (!validator.isAlphanumeric(yearVeri) && !(yearVeri == ""))
        $("#form-validator").removeClass("hide");
    }
    $("#year").keyup(function() {
      $("#year")
        .css("border-color", "#ddd")
        .removeClass("InputPlaceHolderColor")
        .attr("placeholder", "Year");
      $("#year-veri").removeClass("required");
    });
    if (seasonVeri.value == "") {
      $("#semesterChoices").css({
        border: "2px solid",
        "border-color": "rgb(148, 1, 21)",
        color: "rgb(148, 1, 21)"
      });
      $("#semesterChoicesVeri").addClass("required");
    }
    $("#semesterChoices").change(function() {
      $("#semesterChoices").css("border-color", "#ddd");
      $("#semesterChoicesVeri").removeClass("required");
    });
  } else {
    $("#form-validator").addClass("hide");
    $("#institution-veri").removeClass("required");
    $("#course-prefix-number-veri").removeClass("required");
    $("#course-number-veri").removeClass("required");
    $("#course-section-number-veri").removeClass("required");

    $("#institution").css("border-color", "#ddd");
    $("#coursePrefix").css("border-color", "#ddd");
    $("#courseNumber").css("border-color", "#ddd");
    $("#courseSection").css("border-color", "#ddd");
    $("#semesterChoices").css("border-color", "#ddd");
    $("#year").css("border-color", "#ddd");
    noFieldLeftBehind = true;
  }
  if (noFieldLeftBehind == true) {
    $("#part1").toggleClass("invisible");
    $("#part2").toggleClass("invisible visible");
    $("nav a#list1").toggleClass("active");
    $("nav a#list2").toggleClass("active");
    $("#PW-title").html("Create Statements");
    $("#info").removeClass("invisible");
    $("#kebab").removeClass("invisible");
  }
}

function validateTextareasAndArrows() {
  var noTextareaLeftBehind = true;
  var noArrowLeftBehind = true;

  for (var i = 0; i < x; i++) {
    var errorTextID = "errorTextID_" + i;
    var errorTextID2 = "#errorTextID_" + i;
    var k = i;
    var textareaScroll = "sectionID_" + k;
    var textareaTmp = "#textareaID_" + i;
    var textareaSani = "textareaID_" + i;

    document.getElementById(textareaSani).value = DOMPurify.sanitize(
      document.getElementById(textareaSani).value
    );

    saveTextarea[i] = DOMPurify.sanitize(
      document.getElementById(textareaSani).value
    );

    localStorage.setItem(
      textareaSani,
      DOMPurify.sanitize(document.getElementById(textareaSani).value)
    );

    if (!$(textareaTmp).val()) {
      $(textareaTmp).css("border-color", "rgb(148, 1, 21)");
      $(textareaTmp).css("background-color", "#FFCCCC");
      document.getElementById(errorTextID).innerHTML =
        "Please, fill in this field or delete it";
      $(errorTextID2)
        .show()
        .css("color", "rgb(148, 1, 21)");
      $(textareaTmp).keyup(function() {
        $(this).css("background-color", "");
        $(this).css("border-color", "");
      });
      noTextareaLeftBehind = false;

      var scrollElmnt = document.getElementById(textareaScroll);
      scrollElmnt.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    } else {
      $(errorTextID2).hide();
    }
    if (saveArrow[i] != -1 && saveArrow[i] != 1) {
      document.getElementById(errorTextID).innerHTML =
        "Please, set the arrow direction";
      $(errorTextID2)
        .show()
        .css("color", "rgb(148, 1, 21)");
      noArrowLeftBehind = false;

      var scrollElmnt = document.getElementById(textareaScroll);
      scrollElmnt.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
    if (!$(textareaTmp).val() && (saveArrow[i] !== -1 && saveArrow[i] !== 1)) {
      document.getElementById(errorTextID).innerHTML =
        "Please, fill in this field or delete it and set the arrow direction";

      var scrollElmnt = document.getElementById(textareaScroll);
      scrollElmnt.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  }
  if (noTextareaLeftBehind == true && noArrowLeftBehind == true) {
    $("#part2").removeClass("visible");
    $("#part2").addClass("invisible");
    $("#part3").removeClass("invisible");
    $("#part3").addClass("visible");
    $("#PW-title").html("Review Statements");
    $("#info").addClass("invisible");
    $("#kebab").addClass("invisible");
    reviewBool = true;
  }
}

function generateReview() {
  var div = document.getElementById("course-review");
  div.style.display = div.style.display == "none" ? "block" : "block";
  var institution = document.getElementById("institution");
  var coursePrefix = document.getElementById("coursePrefix");
  var courseNumber = document.getElementById("courseNumber");
  var courseSection = document.getElementById("courseSection");
  var year = document.getElementById("year");

  var institutionValue = document.getElementById("institution-review");
  $("#institution").val(
    $("#institution")
      .val()
      .toUpperCase()
  );
  institutionValue.innerHTML = institution.value;

  var coursePrefixValue = document.getElementById("coursePrefix-review");
  $("#coursePrefix").val(
    $("#coursePrefix")
      .val()
      .toUpperCase()
  );
  coursePrefixValue.innerHTML = coursePrefix.value;

  var courseNumberValue = document.getElementById("courseNumber-review");
  courseNumberValue.innerHTML = courseNumber.value;

  var courseSectionValue = document.getElementById("courseSection-review");
  courseSectionValue.innerHTML = courseSection.value;

  var yearValue = document.getElementById("year-review");
  yearValue.innerHTML = year.value;

  var semester_choice = document.getElementById("semesterChoices");
  var selectedChoice =
    semester_choice.options[semester_choice.selectedIndex].value;

  var Season = document.getElementById("season-review");
  Season.innerHTML = selectedChoice;

  for (var i = 0; i < x; i++) {
    var reviewList = document.createElement("li");
    var reviewListId = "reviewListId_" + i;
    reviewList.setAttribute("id", reviewListId);
    reviewList.innerHTML = saveTextarea[i];
    var reviewOl = document.getElementById("review-OL");
    reviewOl.appendChild(reviewList);
  }

  var reviewBackBtn = document.getElementById("review-back");

  $(reviewBackBtn).click(function() {
    for (var i = 0; i < x; i++) {
      var reviewListId = "reviewListId_" + i;
      var reviewList = document.getElementById(reviewListId);
      $(reviewList).remove();
    }
  });
}

function generate() {
  var coursePrefix = document.getElementById("coursePrefix");
  var unencoded_coursePrefix = coursePrefix.value;
  coursePrefix.value = encodeURIComponent(unencoded_coursePrefix)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  var courseNumber = document.getElementById("courseNumber");
  var unencoded_courseNumber = courseNumber.value;
  courseNumber.value = encodeURIComponent(unencoded_courseNumber)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  var courseSection = document.getElementById("courseSection");
  var unencoded_courseSection = courseSection.value;
  courseSection.value = encodeURIComponent(unencoded_courseSection)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  var semester_choice = document.getElementById("semesterChoices");
  var selectedChoice =
    semester_choice.options[semester_choice.selectedIndex].value;

  if (selectedChoice == "Spring") var tmpStrmNumberPart2 = 2;

  if (selectedChoice == "Summer") var tmpStrmNumberPart2 = 5;

  if (selectedChoice == "Fall") var tmpStrmNumberPart2 = 8;

  var yearChoice = document.getElementById("year");
  var yearValue = yearChoice.value;
  var tmpYearArray = Array.from(yearValue.toString()).map(Number);
  var indexToRemove = 1;
  var numberToRemove = 1;
  tmpYearArray.splice(indexToRemove, numberToRemove);
  var temp = tmpYearArray.join("");
  var strmCode = temp + tmpStrmNumberPart2;
  var unencodedStrm = strmCode.value;
  strmCode.value = encodeURIComponent(unencodedStrm)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  var institutionSection = document.getElementById("institution");
  var unencoded_institutionSection = institutionSection.value;
  institutionSection.value = encodeURIComponent(unencoded_institutionSection)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  setCourse(
    institutionSection.value,
    coursePrefix.value,
    courseNumber.value,
    courseSection.value,
    strmCode
  );
}

function setCourse(institution, prefix, number, section, semester) {
  $.post(window.location.pathname + "/../../pwalkwalk.php", {
    msg: "set",
    institution: institution,
    prefix: prefix,
    number: number,
    section: section,
    semester: semester
  })
    .done(function(data) {
      var obj = jQuery.parseJSON(data);
      var walk_id = obj.walk_id;
      var hash = obj.hash;
      $(".key").html(encodeURIComponent(hash));
      setStatement(walk_id);
    })
    .fail(function() {
      console.log("Error: cannot insert course");
    });
}

function setStatement(walk_id) {
  $.post(window.location.pathname + "/../../pwalkstatement.php", {
    msg: "set",
    walk_id: walk_id,
    statements: saveTextarea,
    directions: saveArrow
  })
    .done(function() {})
    .fail(function() {
      console.log("Error: cannot insert course");
    });
}

function generateLinks() {
  var pathArray = window.location.pathname.split("/");
  var newPathname = "";

  for (i = 1; i < pathArray.length - 2; i++) {
    newPathname += "/";
    newPathname += pathArray[i];
  }

  questionnairePath = newPathname + "/questionnaire/index.html?";
  responsePath = newPathname + "/response/index.html?";

  var questionnaire =
    window.location.protocol + "//" + window.location.host + questionnairePath;
  var response =
    window.location.protocol + "//" + window.location.host + responsePath;
  var questionnaireCopy = document.getElementById("copy-statement");
  var responseCopy = document.getElementById("copy-playback");

  var createSpanQ = document.createElement("span");
  var createSpanR = document.createElement("span");
  createSpanQ.setAttribute("class", "key");
  createSpanR.setAttribute("class", "key");

  questionnaireCopy.innerHTML = questionnaire;
  questionnaireCopy.appendChild(createSpanQ);

  responseCopy.innerHTML = response;
  responseCopy.appendChild(createSpanR);

  var printQuestionnaire = document.getElementById("print-questionnaire");
  printQuestionnaire.innerHTML = questionnaire;

  var printQuestionnaireResponse = document.getElementById(
    "print-questionnaire-response"
  );
  printQuestionnaireResponse.innerHTML = response;
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
  setTimeout(function() {
    popup.classList.toggle("show");
  }, 1500);
}

function copyToClipboard2(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
  var popup = document.getElementById("myPopup2");
  popup.classList.toggle("show");
  setTimeout(function() {
    popup.classList.toggle("show");
  }, 1500);
}

function storeText() {
  for (var j = 0; j < x; j++) {
    var textareaIdStorage = "textareaID_" + j;
    var textareaStorage = document.getElementById(textareaIdStorage);
    var textareaStoredValue = localStorage.getItem(textareaIdStorage);
    textareaStorage.value = textareaStoredValue;
  }

  $(".textareaClass").keyup(function() {
    var getId = $(this).prop("id");
    var tmp = getId.split("_")[1];

    textareaIdStorage = "textareaID_" + tmp;
    textareaStorage = document.getElementById(textareaIdStorage);
    localStorage.setItem(textareaIdStorage, textareaStorage.value);
  });
}

function storeTextGenerate() {
  var textareaIdStorage;
  var textareaStorage;

  $(".textareaClass").keyup(function() {
    var getId = $(this).prop("id");
    var tmp = getId.split("_")[1];

    textareaIdStorage = "textareaID_" + tmp;
    textareaStorage = document.getElementById(textareaIdStorage);
    localStorage.setItem(textareaIdStorage, textareaStorage.value);
  });
}

function generateArrow() {
  for (var i = 0; i < localStorage.getItem("x"); i++) {
    if (saveArrow[i] == 1) {
      var tmpLightArrowId = "#lightForwardArrow_" + i;
      var tmpDarkArrowId = "#darkForwardArrow_" + i;
      $(tmpDarkArrowId).addClass("showDisplay");
      $(tmpLightArrowId).addClass("hidden");
    }
    if (saveArrow[i] == -1) {
      var tmpLightArrowId2 = "#lightBackwardArrow_" + i;
      var tmpDarkArrowId2 = "#darkBackwardArrow_" + i;
      $(tmpDarkArrowId2).addClass("showDisplay");
      $(tmpLightArrowId2).addClass("hidden");
    }
  }
}

function generateArrowV2(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == 1) {
      var tmpLightArrowId = "#lightForwardArrow_" + i;
      var tmpDarkArrowId = "#darkForwardArrow_" + i;
      $(tmpDarkArrowId).addClass("showDisplay");
      $(tmpLightArrowId).addClass("hidden");
    }
    if (array[i] == -1) {
      var tmpLightArrowId2 = "#lightBackwardArrow_" + i;
      var tmpDarkArrowId2 = "#darkBackwardArrow_" + i;
      $(tmpDarkArrowId2).addClass("showDisplay");
      $(tmpLightArrowId2).addClass("hidden");
    }
  }
}

function deleteAll() {
  for (var i = 0; i < x; i++) {
    var localStorageTextareaRemove = "textareaID_" + i;
    localStorage.removeItem(localStorageTextareaRemove);
    var localStorageArrowRemove = "arrow" + i;
    localStorage.removeItem(localStorageArrowRemove);
    localStorage.removeItem("x");
    var listRemove = "#listID_" + i;
    $(listRemove).remove();
    if (i == x - 1) {
      x = 0;
      saveTextarea = [];
      saveArrow = [];
    }
  }
}

function CreateStatementsList() {
  var section = document.createElement("div");
  var sectionID = "sectionID_" + x;
  $(section)
    .attr("class", "layout")
    .attr("ID", sectionID);

  var list = document.createElement("li");
  var list_id = "listID_" + x;
  $(list)
    .attr("id", list_id)
    .attr("class", "list-statements");

  var para = document.createElement("p");
  var paraId = "paragraphID_" + x;
  $(para)
    .attr("class", "formfield")
    .attr("id", paraId);

  var label = document.createElement("Label");
  var k = x + 1;
  var labelID = "labelID_" + x;
  $(label)
    .text("Statement " + k + ":")
    .attr("id", labelID);

  var textarea = document.createElement("textarea");
  var text = document.createTextNode("");
  var textareaId = "textareaID_" + x;
  $(textarea)
    .attr("id", textareaId)
    .attr("class", "textareaClass")
    .attr("ondrop", "return false")
    .attr("placeholder", "Type statement here...")
    .append(text);

  var errorTextLabel = document.createElement("LABEL");
  var errorMessageText = document.createTextNode(
    "Please fill in or delete this statement."
  );
  var errorTextID = "errorTextID_" + x;
  $(errorTextLabel)
    .attr("id", errorTextID)
    .attr("class", "hidden error-text")
    .append(errorMessageText);

  var forwardDiv = document.createElement("div");
  var createLightForwardArrow = document.createElement("IMG");
  var lightForwardArrow = "lightForwardArrow_" + x;
  $(createLightForwardArrow)
    .attr("src", "../assets/icons/forwardarrowicon.png")
    .attr("class", "forward-lg")
    .attr("id", lightForwardArrow);
  var createDarkForwardArrow = document.createElement("IMG");
  var darkForwardArrow = "darkForwardArrow_" + x;
  $(createDarkForwardArrow)
    .attr("src", "../assets/icons/forwardarrowicon2.png")
    .attr("class", "forward-dg")
    .attr("id", darkForwardArrow);

  var right_id = "rightId_" + x;
  $(forwardDiv)
    .attr("class", "forward-g")
    .attr("id", right_id)
    .append(createLightForwardArrow)
    .append(createDarkForwardArrow);

  var backwardDiv = document.createElement("div");
  var createLightBackwardArrow = document.createElement("IMG");
  var lightBackwardArrow = "lightBackwardArrow_" + x;
  $(createLightBackwardArrow)
    .attr("src", "../assets/icons/backarrowicon.png")
    .attr("class", "backward-lg")
    .attr("id", lightBackwardArrow);

  var createDarkBackwardArrow = document.createElement("IMG");
  var darkBackwardArrow = "darkBackwardArrow_" + x;
  $(createDarkBackwardArrow)
    .attr("src", "../assets/icons/backarrowicon2.png")
    .attr("class", "backward-dg")
    .attr("id", darkBackwardArrow);
  var left_id = "leftId_" + x;
  $(backwardDiv)
    .attr("id", left_id)
    .attr("class", "backward-g")
    .append(createLightBackwardArrow)
    .append(createDarkBackwardArrow);

  var checkForArrow = "arrow" + x;
  if (checkForArrow in localStorage == false) {
    localStorage.setItem(checkForArrow, "empty");
  }

  var trashcan = document.createElement("button");
  var trashcanId = "trashcanID_" + x;
  var trashcanSpan = document.createElement("span");
  $(trashcan)
    .attr("class", "trashcan x-large")
    .attr("id", trashcanId)
    .append(trashcanSpan);
  trashcanSpan.setAttribute("class", "fa fa-trash ");

  var dragArrow = document.createElement("span");
  $(dragArrow).attr("class", "fas fa-arrows-alt x-large");

  var ButtonWrap = document.createElement("div");
  $(ButtonWrap)
    .attr("class", "buttonwrap")
    .append(trashcan);

  var unison = document.getElementById("pw-container-statements");
  var orderedList = document.getElementById("sList");
  unison.appendChild(orderedList);
  orderedList.appendChild(list);
  list.appendChild(section);
  section.appendChild(para);

  var wrapErrorandBtn = document.createElement("div");
  $(wrapErrorandBtn).attr("class", "wrapErrorandBtn");
  $(wrapErrorandBtn)
    .append(errorTextLabel)
    .append(ButtonWrap);
  $(para)
    .append(dragArrow)
    .append(label)
    .append(forwardDiv)
    .append(backwardDiv)
    .append(textarea)
    .append(wrapErrorandBtn);
  $(section)
    .append(document.createElement("br"))
    .append(document.createElement("br"));

  $(createDarkForwardArrow).click(function() {
    var getId = $(this).prop("id");
    var tmp = getId.split("_")[1];

    saveArrow[tmp] = 1;
    arrowStorage = "arrow" + tmp;
    localStorage.setItem(arrowStorage, 1);

    var tmpLightArrowId = "#lightForwardArrow_" + tmp;
    var tmpDarkArrowId = "#darkForwardArrow_" + tmp;

    var tmpLightArrowId2 = "#lightBackwardArrow_" + tmp;
    var tmpDarkArrowId2 = "#darkBackwardArrow_" + tmp;

    $(tmpDarkArrowId).addClass("showDisplay");
    $(tmpLightArrowId).addClass("hidden");

    if ($(tmpDarkArrowId2).hasClass("showDisplay")) {
      $(tmpLightArrowId2).addClass("showDisplay");
      $(tmpLightArrowId2).removeClass("hidden");
      $(tmpDarkArrowId2).removeClass("showDisplay");
    }
  });

  $(createDarkBackwardArrow).click(function() {
    var getId = $(this).prop("id");
    var tmp = getId.split("_")[1];

    saveArrow[tmp] = -1;
    arrowStorage = "arrow" + tmp;
    localStorage.setItem(arrowStorage, -1);

    var tmpLightArrowId = "#lightForwardArrow_" + tmp;
    var tmpDarkArrowId = "#darkForwardArrow_" + tmp;

    var tmpLightArrowId2 = "#lightBackwardArrow_" + tmp;
    var tmpDarkArrowId2 = "#darkBackwardArrow_" + tmp;

    $(tmpDarkArrowId2).addClass("showDisplay");
    $(tmpLightArrowId2).addClass("hidden");

    if ($(tmpDarkArrowId).hasClass("showDisplay")) {
      $(tmpLightArrowId).addClass("showDisplay");
      $(tmpLightArrowId).removeClass("hidden");
      $(tmpDarkArrowId).removeClass("showDisplay");
    }
  });

  var shadow = "Shadow";
  var $cols = $(".layout").click(function(e) {
    $cols.removeClass(shadow);
    $(this).addClass(shadow);
  });

  $(textarea).keyup(function() {
    var getId = $(this).prop("id");
    var tmp = getId.split("_")[1];
    var textareaContent = $(this).val();
    saveTextarea[tmp] = textareaContent;
  });
  if (defaultBool == true) {
    var m = x + 1;
    var checkbox = "#checkbox_" + m;
    var textareaId = "#textareaID_" + x;
    var textareaId2 = "textareaID_" + x;
    var storeArrow = "arrow" + x;

    $(textareaId).val($(checkbox).val());
    localStorage.setItem(textareaId2, $(checkbox).val());
    saveTextarea[x] = $(textareaId).val();

    saveArrow[x] = defaultStatements[x];
    localStorage.setItem(storeArrow, saveArrow[x]);
  }
  SortLiElnts();
}

function generateStatement() {
  if (x < 50) {
    var section = document.createElement("div");
    var sectionID = "sectionID_" + x;
    $(section)
      .attr("class", "layout")
      .attr("ID", sectionID);

    var list = document.createElement("li");
    var list_id = "listID_" + x;
    $(list)
      .attr("id", list_id)
      .attr("class", "list_statements");

    var para = document.createElement("p");
    var paraId = "paragraphID_" + x;
    $(para)
      .attr("class", "formfield")
      .attr("id", paraId);

    var label = document.createElement("Label");
    var k = x + 1;
    var labelID = "labelID_" + x;
    $(label)
      .text("Statement " + k + ":")
      .attr("id", labelID);

    var textarea = document.createElement("textarea");
    var text = document.createTextNode("");
    var textareaId = "textareaID_" + x;
    $(textarea)
      .attr("id", textareaId)
      .attr("ondrop", "return false")
      .attr("class", "textareaClass")
      .attr("placeholder", "Type statement here...")
      .append(text);

    var errorTextLabel = document.createElement("LABEL");
    var errorMessageText = document.createTextNode(
      "Please fill in or delete this statement."
    );
    var errorTextID = "errorTextID_" + x;
    $(errorTextLabel)
      .attr("id", errorTextID)
      .attr("class", "hidden error-text")
      .append(errorMessageText);

    var forwardDiv = document.createElement("div");
    var createLightForwardArrow = document.createElement("IMG");
    var lightForwardArrow = "lightForwardArrow_" + x;
    $(createLightForwardArrow)
      .attr("src", "../assets/icons/forwardarrowicon.png")
      .attr("class", "forward-lg")
      .attr("id", lightForwardArrow);
    var createDarkForwardArrow = document.createElement("IMG");
    var darkForwardArrow = "darkForwardArrow_" + x;
    $(createDarkForwardArrow)
      .attr("src", "../assets/icons/forwardarrowicon2.png")
      .attr("class", "forward-dg")
      .attr("id", darkForwardArrow);
    var right_id = "rightId_" + x;
    $(forwardDiv)
      .attr("class", "forward-g")
      .attr("id", right_id)
      .append(createLightForwardArrow)
      .append(createDarkForwardArrow);

    var backwardDiv = document.createElement("div");
    var createLightBackwardArrow = document.createElement("IMG");
    var lightBackwardArrow = "lightBackwardArrow_" + x;
    $(createLightBackwardArrow)
      .attr("src", "../assets/icons/backarrowicon.png")
      .attr("class", "forward-lg")
      .attr("class", "backward-lg")
      .attr("id", lightBackwardArrow);
    var createDarkBackwardArrow = document.createElement("IMG");
    var darkBackwardArrow = "darkBackwardArrow_" + x;
    $(createDarkBackwardArrow)
      .attr("src", "../assets/icons/backarrowicon2.png")
      .attr("class", "forward-dg")
      .attr("class", "backward-dg")
      .attr("id", darkBackwardArrow);
    var left_id = "leftId_" + x;
    $(backwardDiv)
      .attr("class", "backward-g")
      .attr("id", left_id)
      .append(createLightBackwardArrow)
      .append(createDarkBackwardArrow);

    localStorage.setItem("arrow" + x, "empty");

    var trashcan = document.createElement("button");
    var trashcanId = "trashcanID_" + x;
    var trashcanSpan = document.createElement("span");
    $(trashcan)
      .attr("class", "trashcan x-large")
      .attr("id", trashcanId)
      .append(trashcanSpan);
    trashcanSpan.setAttribute("class", "fa fa-trash");

    var dragArrow = document.createElement("span");
    $(dragArrow).attr("class", "fas fa-arrows-alt x-large");

    var ButtonWrap = document.createElement("div");
    $(ButtonWrap)
      .attr("class", "buttonwrap")
      .append(trashcan);

    var unison = document.getElementById("pw-container-statements");
    var orderedList = document.getElementById("sList");
    unison.appendChild(orderedList);
    orderedList.appendChild(list);
    list.appendChild(section);
    section.appendChild(para);
    var wrapErrorandBtn = document.createElement("div");
    $(wrapErrorandBtn).attr("class", "wrapErrorandBtn");
    $(wrapErrorandBtn)
      .append(errorTextLabel)
      .append(ButtonWrap);
    $(para)
      .append(dragArrow)
      .append(label)
      .append(forwardDiv)
      .append(backwardDiv)
      .append(textarea)
      .append(wrapErrorandBtn);
    $(section)
      .append(document.createElement("br"))
      .append(document.createElement("br"));

    $(createDarkForwardArrow).click(function() {
      var getId = $(this).prop("id");
      var tmp = getId.split("_")[1];
      saveArrow[tmp] = 1;
      arrowStorage = "arrow" + tmp;
      localStorage.setItem(arrowStorage, 1);

      var tmpLightArrowId = "#lightForwardArrow_" + tmp;
      var tmpDarkArrowId = "#darkForwardArrow_" + tmp;

      var tmpLightArrowId2 = "#lightBackwardArrow_" + tmp;
      var tmpDarkArrowId2 = "#darkBackwardArrow_" + tmp;

      $(tmpDarkArrowId).addClass("showDisplay");
      $(tmpLightArrowId).addClass("hidden");

      if ($(tmpDarkArrowId2).hasClass("showDisplay")) {
        $(tmpLightArrowId2).addClass("showDisplay");
        $(tmpLightArrowId2).removeClass("hidden");
        $(tmpDarkArrowId2).removeClass("showDisplay");
      }
    });

    $(createDarkBackwardArrow).click(function() {
      var getId = $(this).prop("id");
      var tmp = getId.split("_")[1];
      saveArrow[tmp] = -1;
      arrowStorage = "arrow" + tmp;
      localStorage.setItem(arrowStorage, -1);

      var tmpLightArrowId = "#lightForwardArrow_" + tmp;
      var tmpDarkArrowId = "#darkForwardArrow_" + tmp;

      var tmpLightArrowId2 = "#lightBackwardArrow_" + tmp;
      var tmpDarkArrowId2 = "#darkBackwardArrow_" + tmp;

      $(tmpDarkArrowId2).addClass("showDisplay");
      $(tmpLightArrowId2).addClass("hidden");

      if ($(tmpDarkArrowId).hasClass("showDisplay")) {
        $(tmpLightArrowId).addClass("showDisplay");
        $(tmpLightArrowId).removeClass("hidden");
        $(tmpDarkArrowId).removeClass("showDisplay");
      }
    });

    var shadow = "Shadow";
    var $cols = $(".layout").click(function(e) {
      $cols.removeClass(shadow);
      $(this).addClass(shadow);
    });

    $(textarea).keyup(function() {
      var getId = $(this).prop("id");
      var tmp = getId.split("_")[1];
      var textareaContent = $(this).val();
      saveTextarea[tmp] = textareaContent;
      storeTextGenerate();
    });
    x++;
    if (x >= 1) {
      minStatements = true;
    }
    if (minStatements == true) {
      $("#next").css("pointer-events", "auto");
      $("#next").css("opacity", "1");
    }
    localStorage.setItem("x", x);
  } else {
    $("#max-statements").removeClass("invisible");
    $("#max-statements").addClass("visible");

    setTimeout(function() {
      $("#max-statements").removeClass("visible");
      $("#max-statements").addClass("invisible");
    }, 5000);
  }
  SortLiElnts();
}

var iModal = document.getElementById("instruction-modal");
var infoBtn = document.getElementById("info");
var iClose = document.getElementById("iModal-close");
var getStarted = document.getElementById("get-started-btn");

infoBtn.onclick = function() {
  iModal.style.display = "block";
  $("body").toggleClass("modal-open");
};

iClose.onclick = function() {
  iModal.style.display = "none";
  $("body").toggleClass("modal-open");
};

getStarted.onclick = function() {
  iModal.style.display = "none";
  $("body").toggleClass("modal-open");
};

iModal.onclick = function(event) {
  if (event.target == iModal) {
    $("body")
      .find(iModal)
      .css("display", "none");
    $("body").toggleClass("modal-open");
  }
};

var importModal = document.getElementById("import-modal");
var importBtn = document.getElementById("import");
var close = document.getElementById("import-close");
var importClose = document.getElementById("import-btn");

importClose.onclick = function() {
  importModal.style.display = "none";
  $("body").toggleClass("modal-open");
};

importBtn.onclick = function() {
  importModal.style.display = "block";
  $("body").toggleClass("modal-open");
};

close.onclick = function() {
  importModal.style.display = "none";
  $("body").toggleClass("modal-open");
};

importModal.onclick = function(event) {
  if (event.target == importModal) {
    $("body")
      .find(importModal)
      .css("display", "none");
    $("body").toggleClass("modal-open");
  }
};

$("#add-Statement").click(function() {
  generateStatement();
  $("html, body").animate(
    {
      scrollTop: $(document).height()
    },
    "slow"
  );
});

function SortLiElnts() {
  var orderedList = document.getElementById("sList");
  $(".fa-arrows-alt").mousedown(function() {
    enableSort();
    $(orderedList).sortable({
      items: "li"
    });

    $(orderedList).sortable({
      stop: function() {
        var tmpArray = [];
        var items = orderedList.getElementsByTagName("li");

        for (var o = 0; o < items.length; ++o) {
          tmpArray[o] = items[o].id.split("_")[1];
        }

        for (var i = 0; i < x; i++) {
          if (parseInt(tmpArray[i]) !== i) {
            var k = i + 1;
            var labelID_tmp = "labelID_" + tmpArray[i];
            var label_ele = document.getElementById(labelID_tmp);
            label_ele.innerHTML = "Statement " + k + ":";
          }
        }

        for (var i = 0; i < x; i++) {
          var listID_tmp = "listID_" + tmpArray[i];
          var labelID_tmp = "labelID_" + tmpArray[i];
          var paraId_tmp = "paragraphID_" + tmpArray[i];
          var sectionID_tmp = "sectionID_" + tmpArray[i];
          var textareaId_tmp = "textareaID_" + tmpArray[i];
          var right_id_tmp = "rightId_" + tmpArray[i];
          var light_arrow_tmp = "lightBackwardArrow_" + tmpArray[i];
          var dark_arrow_tmp = "darkBackwardArrow_" + tmpArray[i];
          var left_id_tmp = "leftId_" + tmpArray[i];
          var light_arrow_tmp2 = "lightForwardArrow_" + tmpArray[i];
          var dark_arrow_tmp2 = "darkForwardArrow_" + tmpArray[i];
          var trashcanId_tmp = "trashcanID_" + tmpArray[i];
          var errorTextID_tmp = "errorTextID_" + tmpArray[i];

          var list_ele = document.getElementById(listID_tmp);
          var label_ele = document.getElementById(labelID_tmp);
          var para_ele = document.getElementById(paraId_tmp);
          var section_ele = document.getElementById(sectionID_tmp);
          var textareaEle = document.getElementById(textareaId_tmp);
          var right_ele = document.getElementById(right_id_tmp);
          light_arrow_ele = document.getElementById(light_arrow_tmp);
          dark_arrow_ele = document.getElementById(dark_arrow_tmp);
          var left_ele = document.getElementById(left_id_tmp);
          light_arrow_ele2 = document.getElementById(light_arrow_tmp2);
          dark_arrow_ele2 = document.getElementById(dark_arrow_tmp2);
          var trashcan_ele = document.getElementById(trashcanId_tmp);
          var errorTextID_ele = document.getElementById(errorTextID_tmp);

          list_ele.id = "listsID_" + i;
          label_ele.id = "labelsID_" + i;
          para_ele.id = "paragraphsID_" + i;
          section_ele.id = "sectionsID_" + i;
          textareaEle.id = "textareasID_" + i;
          right_ele.id = "rightsId_" + i;
          light_arrow_ele.id = "lightArrowsA2_" + i;
          dark_arrow_ele.id = "darkArrowsB2_" + i;
          left_ele.id = "leftsId_" + i;
          light_arrow_ele2.id = "lightArrowsA_" + i;
          dark_arrow_ele2.id = "darkArrowsB_" + i;
          trashcan_ele.id = "trashcansID_" + i;
          errorTextID_ele.id = "errorTextsID_" + i;
        }

        for (var i = 0; i < x; i++) {
          var listID_tmp = "listsID_" + i;
          var labelID_tmp = "labelsID_" + i;
          var paraId_tmp = "paragraphsID_" + i;
          var sectionID_tmp = "sectionsID_" + i;
          var textareaId_tmp = "textareasID_" + i;
          var right_id_tmp = "rightsId_" + i;
          var light_arrow_tmp = "lightArrowsA2_" + i;
          var dark_arrow_tmp = "darkArrowsB2_" + i;
          var left_id_tmp = "leftsId_" + i;
          var light_arrow_tmp2 = "lightArrowsA_" + i;
          var dark_arrow_tmp2 = "darkArrowsB_" + i;
          var trashcanId_tmp = "trashcansID_" + i;
          var errorTextID_tmp = "errorTextsID_" + i;

          var list_ele = document.getElementById(listID_tmp);
          var label_ele = document.getElementById(labelID_tmp);
          var para_ele = document.getElementById(paraId_tmp);
          var section_ele = document.getElementById(sectionID_tmp);
          var textareaEle = document.getElementById(textareaId_tmp);
          var right_ele = document.getElementById(right_id_tmp);
          var light_arrow_ele = document.getElementById(light_arrow_tmp);
          var dark_arrow_ele = document.getElementById(dark_arrow_tmp);
          var left_ele = document.getElementById(left_id_tmp);
          var light_arrow_ele2 = document.getElementById(light_arrow_tmp2);
          var dark_arrow_ele2 = document.getElementById(dark_arrow_tmp2);
          var trashcan_ele = document.getElementById(trashcanId_tmp);
          var errorTextID_ele = document.getElementById(errorTextID_tmp);

          list_ele.id = "listID_" + i;
          label_ele.id = "labelID_" + i;
          para_ele.id = "paragraphID_" + i;
          section_ele.id = "sectionID_" + i;
          textareaEle.id = "textareaID_" + i;
          right_ele.id = "rightId_" + i;
          light_arrow_ele.id = "lightBackwardArrow_" + i;
          dark_arrow_ele.id = "darkBackwardArrow_" + i;
          left_ele.id = "leftId_" + i;
          light_arrow_ele2.id = "lightForwardArrow_" + i;
          dark_arrow_ele2.id = "darkForwardArrow_" + i;
          trashcan_ele.id = "trashcanID_" + i;
          errorTextID_ele.id = "errorTextID_" + i;
        }

        for (var i = 0; i < x; i++) {
          var arrow_sort = "arrow" + i;
          var textareaID_tmp = "#textareaID_" + i;
          saveTextarea[i] = $(textareaID_tmp).val();

          var dark_arrow_tmp = "#darkBackwardArrow_" + i;

          if ($(dark_arrow_tmp).hasClass("showDisplay")) {
            saveArrow[i] = -1;
            localStorage.setItem(arrow_sort, -1);
          }

          var dark_arrow_tmp2 = "#darkForwardArrow_" + i;

          if ($(dark_arrow_tmp2).hasClass("showDisplay")) {
            saveArrow[i] = 1;
            localStorage.setItem(arrow_sort, 1);
          }
          if (
            $(dark_arrow_tmp2).hasClass("showDisplay") == false &&
            $(dark_arrow_tmp).hasClass("showDisplay") == false
          ) {
            saveArrow[i] = "";
            localStorage.setItem(arrow_sort, "");
          }
        }

        for (var i = 0; i < x; i++) {
          var tmp_textarea = "textareaID_" + i;
          var tmp_textareaEle = document.getElementById(tmp_textarea);
          var tmp_storage = "tmp" + i;

          localStorage.setItem(tmp_storage, tmp_textareaEle.value);
          localStorage.setItem(tmp_textarea, localStorage.getItem(tmp_storage));
          localStorage.removeItem(tmp_storage);
        }
        disableSort();
      }
    });
  });

  function enableSort() {
    $(orderedList).sortable();
    $(orderedList).sortable("enable");
  }

  function disableSort() {
    $(orderedList).sortable("disable");
  }
}
