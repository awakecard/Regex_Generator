// Version 0.0.1 alpha

$("documet").ready(function(){

    //inital setup
    var has_original_string = false;
    var original_string = "";
    var working_string = "";
    var needs_escaping = true
    var count_match = 0;
    var count_not_match = 0;
    var total_tests = 0;
    var matched_data = [];
    var not_matched_data = [];
    var flags = "i";
    var working_history = [];

    $("#working_box_area").toggle();
    $("#results").hide();
    $("#selected_suggestion").hide();
    $("#history_section").hide();
    
    //debug_setup - adds test data
    debug_setup()

    //This is all dealing with changes to the sample_box, which should be allowed to change via, change events, enter key, or click or the escape button.
    $("#sample_box").change(function(){
        run_escape();
    });
    //https://www.techiedelight.com/trigger-button-click-on-enter-key-javascript/#:~:text=1.%20Using%20jQuery.%20The%20idea%20is%20to%20bind,submit%20button%20when%20the%20Enter%20key%20is%20detected.
    $("#sample_box").keyup(function(event){
        if(event.which == 13){
            run_escape();
        }
    });
    $("#escape").click(function(){
        run_escape();
    }); //end of the escape button being clicked

    function run_escape(){
        //Get the original String
        original_string = $("#sample_box").val();
        //hide original string
        $("#sample_box").toggle();
        $("#escape").toggle();

        //unhide working string
        $("##working_box_area").toggle();
        //escape the workging string.
        //used a real escape function ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        working_string = original_string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        needs_escaping = false
        has_original_string = true
        $("#working_box").val(working_string);
        update_history();
        debug("#escape on click"); //for sanity sake
    }


    //this is to determin when to update everything based from a user change
    $("#working_box").change(function(){
        change_working_box();
    });//end of working box change
    //https://www.techiedelight.com/trigger-button-click-on-enter-key-javascript/#:~:text=1.%20Using%20jQuery.%20The%20idea%20is%20to%20bind,submit%20button%20when%20the%20Enter%20key%20is%20detected.
    $("#working_box").keyup(function(event){
        if(event.which == 13){
            change_working_box();
        }
    });
    $("#go").click(function(){
        change_working_box();
    });

    function change_working_box(){
        update_history();
        run_regex_loop();
        update_boxes();
        debug("#working_box on change");
    };

    //to allow for regex suggestions
    //https://stackoverflow.com/questions/36215191/detect-if-text-is-highlighted-on-mouse-up-jquery
    //https://ourcodeworld.com/articles/read/282/how-to-get-the-current-cursor-position-and-selection-within-a-text-input-or-textarea-in-javascript
    $("#working_box").mouseup(function(){
        $("#recommendations").show();

        var highlightedText = "";
        var startPosition = -1;
        var endPosition = -1;

        if (window.getSelection) {
            highlightedText = window.getSelection().toString();
            var myElement = document.getElementById('working_box');
            var startPosition = myElement.selectionStart;
            var endPosition = myElement.selectionEnd;
            console.log(startPosition)
            console.log(endPosition);
        } 
        else if (document.selection && document.selection.type != "Control") {
            highlightedText = document.selection.createRange().text;
        }
        if(highlightedText != ""){
            console.log(`text highlighted. is: ${highlightedText}`);
            $("#selection").html(`you have selected: "${highlightedText}"`)
            var recomendations = find_recommendations(highlightedText);
            if (recomendations.length >0){
                
                var htext = "<table class=\"table table-hover\"><thead><td>Name</td><td>Description</td><td>Pattern</td></thead><tbody>";
                recomendations.forEach( r =>{
                    htext += "<tr class=\"replace\" data-start=\""+startPosition+"\" data-end=\""+endPosition+"\" data-pattern=\""+r["pattern"]+"\">"
                    htext += "<td >" + r["name"] +"</td>"
                    htext += "<td >" + r["desc"] +"</td>"
                    htext += "<td >" + r["pattern"] +"</td>"
                    htext += "</tr>"
                });
                htext += "</tbody></table>"
                $("#recommendations").html(htext);
                $(".replace").mouseup(function(){
                    $("#selected_suggestion").show()
                    var start = $(this).attr("data-start");
                    var end = $(this).attr("data-end");
                    var p = $(this).attr("data-pattern");

                    console.log(`data-start   :${start}`)
                    console.log(`data-end   :${end}`)
                    console.log(`data-pattern   :${p}`)

                    old_working = working_string
                    part_1 = working_string.substr(0, start)
                    part_2 = p
                    part_3 = working_string.substr(end, working_string.length)
                    new_working = part_1 + part_2 + part_3 

                    $("#old_working").html(old_working);
                    $("#new_working").html(new_working);

                    $("#confirm_change").click(function(){
                        working_string = new_working;
                        $("#working_box").val(working_string);
                        update_history();
                        run_regex_loop();
                        update_boxes();
                    });
                });//end of replace.click

            }else{
                $("#recommendations").html("Could not locate recommendations")
            }
        }
    });

    function run_regex_loop(){
        //set up the parameters of the regex
        working_string = $("#working_box").val()
        pattern = working_string;
        

        //get the test data
        var test_data = $("#all_test_strings").val()
        test_data = test_data.split("\n")
        total_tests = test_data.length

        //used to output the details into what has been matched and what has not been matched
        matched_data = [];
        not_matched_data = [];
        count_match = 0;
        count_not_match = 0;

        //regex loop
        test_data.forEach( td => {
            var re = new RegExp(pattern, flags)
            var matches = td.search(re)
            console.log(`string: ${td}, pattern: ${pattern}, count: ${matches}`);
            if(matches >= 0){ //search from char 0 would = 0 -1 is the error code
                matched_data.push(td);
                count_match += 1;
            }else{
                not_matched_data.push(td);
                count_not_match += 1;
            }
        });
    }
    
    //this will return a list of the appliable pattens based from the selection
    //returns [ { name:"", desc:"", patten:"" }, {....}]
    function find_recommendations(str_text){
        var patten_matches = []
        PATTERNS.forEach(p => {
            var re = new RegExp(p["pattern"], flags)
            var m = str_text.search(re)
            if (m>=0){
                patten_matches.push(p)
            }
        });
        return patten_matches
    }

    //UI Function to update based from matched strings
    function update_boxes(){
        $("#init_test_data").hide();
        $("#results").show();
        var str = "";
        matched_data.forEach( md => {
            str += md + "\n"
        });
        $("#matched_strings").val(str);

        str = "";
        not_matched_data.forEach( nmd => {
            str += nmd + "\n"
        });
        $("#non_matched_strings").val(str);

        $("#match_summary").html(`From ${total_tests}, we have found ${count_match} matches`);
        $("#non_match_summary").html(`From ${total_tests}, we have found ${count_not_match} filed matches`);
        
        $("#recommendations").hide();
        $("#selected_suggestion").hide();

    }; //end of update boxes 


    $("#history").click(function(){
        $("#history_section").show();

        var htext = "<ul class=\"list-unstyled\">"
        working_history.forEach(wh => {
            htext += "<li class=\"history-revert text-info\" data=\""+wh+"\">" + wh + "</li>"
        });
        htext += "</ul>"

        $("#history_content").html(htext);
        $(".history-revert").click(function(){
            var h = $(this).attr("data")
            $("#working_box").val(h);
            $("#history_section").hide();
            run_regex_loop();
            update_boxes();
        });
    });


    // this will update the working history upto 20 places, so you can revert mistakes in reverse chronlogical order
    function update_history(){
        var new_item = $("#working_box").val()
        var h = []
        h.push(new_item);
        var run = -1
        if(working_history.length < 19){
            run = working_history.length
        }else{
            run = 19;
        }
        for(var index = 0; index < run; index++){
            h.push(working_history[index]);
        }
        working_history = h;
    }

    
    $("#hide_history").click(function(){
        $("#history_section").hide();
    });

    //DEBUG FUNCTIONS
    //debug, think of this as a toString function where the currnet state is spat out
    function debug(caller=""){
        if(caller != ""){
            console.log("DEBUG FUNCTION: caller is ", caller);
        }
        else{
            console.log("DEBUG FUNCTION");
        }
        
        console.log("--------------");
        console.log("Original String is: ", original_string);
        console.log("Working String is: ", working_string);
        console.log("Has original String is: ", has_original_string);
        console.log("Needs Escape is: ", needs_escaping);
        console.log("Total_samples: ", total_tests);
        console.log("# Matches: ", count_match);
        console.log("# Not Mathced: ", count_not_match);

        console.log("Matched Data")
        console.log("-----------------")
        matched_data.forEach(md => {
            console.log("    ", md)
        });

        console.log("Not Matched Data")
        console.log("---------------------")
        console.log(not_matched_data)
        not_matched_data.forEach(nmd => {
            console.log("    ", nmd)
        });

    }; //end of debug function

    //debug helper function to provide sample data to speed up tests
    function debug_setup(){
        $("#sample_box").val("C:\\users\\awakecard\\docs\\1.txt")

        var test_data = [
            "C:\\users\\awakecard\\docs\\1.txt",
            "C:\\users\\awakecard\\docs\\2.txt",
            "C:\\users\\awakecard\\docs\\3.txt",
            "C:\\users\\awakecard\\docs\\4.txt",
            "C:\\users\\awakecard\\docs\\5.txt",
            "C:\\users\\awakecard\\docs\\6.txt",
            "C:\\users\\awakecard\\docs\\7.txt",
            "C:\\users\\awakecard\\docs\\8.txt",
            "C:\\users\\awakecard\\docs\\9.txt",
            "C:\\users\\awakecard\\docs\\10.txt",
            "C:\\users\\awakecard\\docs\\10.21.3.45.txt",
        ]

        test_data.forEach(td => {
            var ctd = $("#all_test_strings").val()
            ctd += td + "\n"
            $("#all_test_strings").val(ctd)
        });
    };



}); //end of document.ready