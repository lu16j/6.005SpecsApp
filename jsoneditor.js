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
    var numOfOps = 0;
    var questions = []; //array of all the question objects
    var selectBox = $("select");
    var editMode = false;
    
    
    function submit() {
        var JSONstring = JSONify();
        editMode = false;
        console.log("current mode: ", editMode);
        
        numOfOps++;
        $("#result").append("<p id='p" + numOfOps + "'>" + JSONstring + "</p>");
        questions.push(new Question(JSONstring, numOfOps))

        console.log('numOfOps after shit: ',numOfOps);
        console.log('question(submit): ', questions);
        var str = String(questions[numOfOps-1].getNumber());
        var optionEl = $("<option></option>");
        var formState = $('.editableSpecImpl').html();
        questions[numOfOps-1].setForm(formState);
        questions[numOfOps-1].setObj(optionEl.html(str));
       
        selectBox.append(questions[numOfOps-1].getObj());  
        resetForm();
    }
    
    function save(num) {
        var formState = $('.editableSpecImpl').html();
        var updatedStr = JSONify();
        questions[num].setForm(formState);
        questions[num].setText(updatedStr);
        $("#p" + (parseInt(num)+1)).html(questions[num].getText());
        console.log("updating p", num+1);
        console.log("new form text: ", JSONify());
        editMode = false;
        bind();
        resetForm();
    }
    
    function resetForm() {
        $('input').each(function() {
            $(this).val("");
        });
        $('textarea').each(function() {
            $(this).html("");
        });
    }
    
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

    function addSpec() {
        counterspec += 1; 
        var spec = $("<div style='margin-right: 5px; margin-top: 15px;' class='spec" + counterspec +  "'>\
                    <input class='name' style='width:78px' type='text' placeholder='Spec name...'>\
                    <input class='intersects' style='width:78px' type='text' placeholder='Intersections'>\
                    <input class='contains' style='width:78px' type='text' placeholder='Contains'><br>\
                    <textarea class='input-xlarge' rows='4' placeholder='Enter spec...'></textarea>\
                    <button data-spec='" +counterspec + "' class='dec btn btn-info' class='btn btn-primary'>Remove Spec</button></div>");
        spec.find("button").on('click', function() {
            decSpec($(this).attr("data-spec"));
        });
        $(".specs").append(spec);
    }
    
        
    function decSpec(specNum) {
        $(".spec" + specNum).remove();

        
        
    }
    
    function addImple() {
        counterimple += 1;
        var imple = $('<div style="margin-bottom:15px; padding: 5px 25px" class="imple' + counterimple + '">' +
                    '<input class="name span4" type="text" placeholder="Implementation name..."><br>' +
                    '<textarea class="span4" style="height: 200px" placeholder="Enter implementation"></textarea><br>' +
                    '<button data-imple="' + counterimple + '" class="deci btn btn-info" class="btn btn-primary">Remove Implementation</button>' +
                    '</div>');
        imple.find("button").on('click', function() {
           decImple($(this).attr("data-imple")); 
        });
        $(".imple").append(imple);     
    }
    
    function decImple(impleNum) {
        $(".imple" + impleNum).remove();
    }
    
    //add bind again if messes up
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
    
    function highlight(num) {
        var n = num;
        var pObj = $('#p' + n);
        var allPObj = $('#result p');
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
            editMode = true;
            editSpec(parseInt(strOp-1));
        });
        
        deletebutton.off('click');
        deletebutton.on('click', function() {
            deleteSpec(parseInt(strOp)-1);
        });
        
    });
    
    
    
    
    function deleteSpec(qnum) {
        /*when I delete I want to remove the paragraph in the results box, 
        the option in the select box
        the question object from the array
        i must also decrement the numbers of the rest of the questions in the array if random question was deleted
        */

        if (numOfOps != 0) {
            numOfOps -= 1;
        }
        
        
        var pObj = $('#p'+(qnum+1));
        pObj.remove();
        
        if (qnum == 0) {
            questions.splice(0, 1);
            console.log(questions);
            for (q in questions) {
                var num = questions[q].getNumber();
                questions[q].setNumber(num-1);
                questions[q].setObj($("<option>" + questions[q].getNumber + "</option>"));
            }
        }
        else if ((qnum > 0) && (qnum < questions.length)) {
            console.log('middle: ', qnum);
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
                    console.log('option el: ', n);
                    $('#p' + n).attr('id', 'p'+String(n-1));
                    $(this).html(String(n-1));
                }
        });
        $('.opButtons button').addClass('disabled');
        console.log('questions: ',questions);
        //update id on paragraph element!
        
    }
    
    function editSpec(qnum) {
        var form = questions[qnum].getForm();
        console.log('form length: ', form.length);
        var specImplDiv = $('.editableSpecImpl');
        var container = $('.container');
        specImplDiv.detach();
        specImplDiv = $('<div class="editableSpecImpl"></div>');
        specImplDiv.append(form);
        container.prepend(specImplDiv);
        bind(qnum);
    }

        
});
