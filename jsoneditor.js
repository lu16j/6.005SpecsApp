/*
Question Object
*/
function Question(text, number, htmlObject, htmlForm) {
    this.text = text;
    this.number = number;
    this.htmlobj = htmlObject;
    this.htmlForm = htmlForm;
}

Question.prototype = {
    constructor: Question,
    getText: function() {
        return this.text;
    },
    setText: function(t) {
        this.text = t;
    },
    getNumber: function() {
        return this.number;
    },
    setNumber: function(n) {
        this.number = n;
    },
    getObj: function() {
        return this.htmlobj;
    },
    setObj: function(obj) {
        this.htmlobj = obj;
    },
    getForm: function() {
        return this.htmlForm;
    },
    setForm: function(obj) {
        this.htmlForm = obj;
    }
}


$(document).ready(function() {
    var numOfOps = 0;               //keeps track of the options in the selection box
    var questions = [];             //array of all the question objects
    var selectBox = $("select");    //selection box
    var editMode = false;           
    
    /*
    Takes values from the inputs and text areas and places the json string into the results
    div as a question. Initiates a Question object from the inputs
    */
    function submit() {
        var JSONstring = JSONify();  //grabs json string
        editMode = false; //changes mode back
        
        numOfOps++;
        $("#result").append("<pre id='p" + numOfOps + "'>" + JSONstring + ", </pre>");
        questions.push(new Question(JSONstring, numOfOps))

        var str = String(questions[numOfOps-1].getNumber()); //get question number
        var optionEl = $("<option></option>");
        var formState = $('.editableSpecImpl').html(); //saves all inputs for the question
        
        questions[numOfOps-1].setForm(formState);
        questions[numOfOps-1].setObj(optionEl.html(str));
       
        selectBox.append(questions[numOfOps-1].getObj());  
        resetForm(); //clears form
    }
    
    /*
    Updates input for a question that already has been submited. 
    Also updates the Question object being edited.
    @param num - a positive integer representing the index of the question being edited
    */
    function save(num) {
        var formState = $('.editableSpecImpl').html(); //grabs new formstate
        var updatedStr = JSONify(); 
        questions[num].setForm(formState);
        questions[num].setText(updatedStr);
        $("#p" + (parseInt(num)+1)).html(questions[num].getText() +', ');
        editMode = false; //reset mode
        bind(); //rebind all the events for the buttons
        resetForm();
    }
    
    /*
    Clears all inputs and textareas
    */
    function resetForm() {
        $('input').each(function() {
            $(this).val("");
        });
        $('textarea').each(function() {
            $(this).val("");
        });
    }
    
    /*
    Formats the user's inputs
    @return JSON string
    */
    function JSONify() {
        var colors = {
            "pink":"rgba(255,192,203,1)",
            "magenta":"rgba(255,0,255,1)",
            "red":"rgba(255,0,0,1)",
            "darkorange":"rgba(255,140,0,1)",
            "yellow":"rgba(255,255,0,1)",
            "lime":"rgba(0,255,0,1)",
            "darkgreen":"rgba(0,100,0,1)",
            "olive":"rgba(128,128,0,1)",
            "aqua":"rgba(0,255,255,1)",
            "darkcyan":"rgba(0,139,139,1)",
            "darkblue":"rgba(0,0,139,1)",
            "purple":"rgba(128,0,128,1)",
            "maroon":"rgba(128,0,0,1)",
            "darkgrey":"rgba(169,169,169,1)",
        };
        
        //gives specs and impls their colors 
        function randomColor(opacity) {
            var result;
            var count = 0;
            for (var prop in colors)
                if (Math.random() < 1/++count)
                   result = prop;
            var output = colors[result].replace('1)',opacity+')');
            delete colors[result];
            return output;
        }
        
        //grabs inputs from forms and places them into dict to be formatted
        var jsonThing = {};
        jsonThing['specs'] = {}
        $('.specs div').each(function () {
            var name = $(this).find('.name').val();
            if(name !== "") {
                jsonThing['specs'][name] = {};
                
                if ($(this).find('.contains').val() !== "") {
                    jsonThing['specs'][name]['contains'] = $(this).find('.contains').val().split(/[\s,]+/);
                }
                else {
                    jsonThing['specs'][name]['contains'] = [];
                }
                
                if ($(this).find('.intersects').val() !== "") {
                    jsonThing['specs'][name]['intersects'] = $(this).find('.intersects').val().split(/[\s,]+/);
                }
                else {
                    jsonThing['specs'][name]['intersects'] = [];
                }
                
                jsonThing['specs'][name]['text'] = $(this).find('textarea').val();
                jsonThing['specs'][name]['color'] = randomColor(0.3);
            }
        });
        
        jsonThing['imples'] = {};
        $('.imple div').each(function() {
            var name = $(this).find('.name').val();
            if(name !== "") {
                jsonThing['imples'][name] = {};
                jsonThing['imples'][name]['text'] = $(this).find('textarea').val();
                jsonThing['imples'][name]['color'] = randomColor(1);
            }
        });
        
        var JSONstring = JSON.stringify(jsonThing);  
        return JSONstring;
    }
    
    
    var counterspec = 1; 
    var counterimple = 1;

    /*
    Adds a spec form to the Specs div
    */
    function addSpec() {
        counterspec += 1; 
        var spec = $("<div style='margin-right: 20px; margin-bottom: 15px;' class='spec" + counterspec +  "'>\
                    <input class='name' style='width:104px; font-family: monospace' type='text' placeholder='Spec name...'>\
                    <input class='intersects' style='width:104px; font-family: monospace' type='text' placeholder='Intersections'>\
                    <input class='contains' style='width:104px; font-family: monospace' type='text' placeholder='Contains'><br>\
                    <textarea style='font-family: monospace; width: 350px' class='input-xlarge' rows='4' placeholder='Enter spec...'></textarea>\
                    <button data-spec='" +counterspec + "' class='dec btn btn-info' class='btn btn-primary'>Remove Spec</button></div>");
        spec.find("button").on('click', function() {
            decSpec($(this).attr("data-spec"));
        });
        $(".specs").append(spec);
    }
    
    /*
    Removes a spec form to the Specs div
    */    
    function decSpec(specNum) {
        $(".spec" + specNum).remove();

        
        
    }
    
    /*
    Adds an impl form to the Imples div
    */
    function addImple() {
        counterimple += 1;
        var imple = $('<div style="margin-bottom:15px; margin-right: 10px" class="imple' + counterimple + '">' +
                    '<input class="name span4" style="width: 350px; font-family: monospace" type="text" placeholder="Implementation name..."><br>' +
                    '<textarea class="span4" style="width: 350px; height: 200px; margin-right: 15px; font-family: monospace" placeholder="Enter implementation"></textarea><br>' +
                    '<button data-imple="' + counterimple + '" class="deci btn btn-info" class="btn btn-primary">Remove Implementation</button>' +
                    '</div>');
        imple.find("button").on('click', function() {
           decImple($(this).attr("data-imple")); 
        });
        $(".imple").append(imple);     
    }
    
    /*
    Removes an impl form to the Ipmles div
    */
    function decImple(impleNum) {
        $(".imple" + impleNum).remove();
    }
    
    /*
    Connects all the event listeners to their objects
    */
    function bind(num) {
        $(".add").off();
        $(".add").on('click', addSpec);
        
        $(".dec").each(function() {
            $(this).off();
            $(this).on('click', function() {
                decSpec($(this).attr("data-spec"));
            })
        });
        
        $(".addi").off();
        $(".addi").on('click', addImple);
        $(".deci").each(function() {
            $(this).off();
            $(this).on('click', function() {
              decImple($(this).attr("data-imple"));  
            });
        });
        
        $("button[type='submit']").off();
        if (editMode == false) {
            $("button[type='submit']").text('Submit');
            
            $("button[type='submit']").on('click', submit);
        }
        else {
            $("button[type='submit']").text('Save');
            
            $("button[type='submit']").on('click', function() {
                save(num);
            });
        }
        
        
        $('textarea').on('keyup', function() {
            $(this).html($(this).val());
        });
        
        $('input').on('keyup', function() {
            $(this).attr('value', $(this).val());
        });
    }
    
    bind();
    
    /*
    Highlights the selected paragraph element
    */
    function highlight(num) {
        var n = num;
        var pObj = $('#p' + n);
        var allPObj = $('#result pre');
        allPObj.removeClass('highlight');
        pObj.toggleClass('highlight');
    }
    
    $('#selectionBox').on('click', function() {
        var e = document.getElementById('selectionBox');
        var strOp = e.options[e.selectedIndex].text;
        highlight(strOp);
        var disabledButtons = $('.opButtons button');
        var editbutton = $('#edit');
        var deletebutton = $('#delete');
        disabledButtons.removeClass('disabled');
        
        editbutton.off('click');
        editbutton.on('click', function() {
            editMode = true; //turns on edit mode
            editSpec(parseInt(strOp-1));
        });
        
        deletebutton.off('click');
        deletebutton.on('click', function() {
            deleteSpec(parseInt(strOp)-1);
        });
        
    });
    
    
    
    /*
    Deletes the question from the selection box and updates all views and objects accordingly
    */
    function deleteSpec(qnum) {
        if (numOfOps != 0) {
            numOfOps -= 1;
        }
        
        
        var pObj = $('#p'+(qnum+1));
        pObj.remove();
        
        if (qnum == 0) {
            questions.splice(0, 1);
            for (q in questions) {
                var num = questions[q].getNumber();
                questions[q].setNumber(num-1);
                questions[q].setObj($("<option>" + questions[q].getNumber + "</option>"));
            }
        }
        else if ((qnum > 0) && (qnum < questions.length)) {
            questions.splice(qnum, 1)
            for (q in questions) {
                var num = questions[q].getNumber();
                questions[q].setObj($("<option>" + num + "</option>"));
            }
            
            
        }
        
        var e = document.getElementById('selectionBox');
        var strOp = e.options[e.selectedIndex].remove();
        $("#selectionBox option").each(function() {
                if ($(this).val() > qnum) {
                    var n = $(this).val();
                    $('#p' + n).attr('id', 'p'+String(n-1));
                    $(this).html(String(n-1));
                }
        });
        $('.opButtons button').addClass('disabled');
        
        if ($('select').empty()) {
            editMode = false;
        }
        bind();
    }
    
    /*
    Grabs the saved form and places it in the view to be saved 
    */
    function editSpec(qnum) {
        var form = questions[qnum].getForm();
        var specImplDiv = $('.editableSpecImpl');
        var container = $('.container');
        specImplDiv.detach();
        specImplDiv = $('<div class="editableSpecImpl"></div>');
        specImplDiv.append(form);
        container.prepend(specImplDiv);
        bind(qnum);
    }

        
});


//I will format it into the MVC model. But today is not the da