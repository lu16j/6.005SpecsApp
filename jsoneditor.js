function Question(text, number, htmlObject) {
    this.text = text;
    this.number = number;
    this.htmlobj = htmlObject;
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
    }
    
}


$(document).ready(function() {
    var numOfOps = 0;
    var questions = []; //array of all the question objects
    var selectBox = $("select");
    
    
    function submit() {
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
        numOfOps++;
        $("#result").append("<p class='unselected' id='" + numOfOps + "'>" + JSONstring + "</p>");
        questions.push(new Question(JSONstring, numOfOps))

        var str = String(questions[numOfOps-1].getNumber());
        var optionEl = "<option>" + str + "</option>";
        questions[numOfOps-1].setObj(optionEl);
        selectBox.append(questions[numOfOps-1].getObj());
        
        $("select option").each(function() {
            $(this).on('click', function() {
                console.log('clicked');
                var questionsNum = $(this).text();
                if ($("#" + questionsNum).hasClass("unselected")) {
                    console.log("here");
                    $("#" + questionsNum).removeClass("unselected");
                    $("#" + questionsNum).addClass("selected");
                }
                else {
                    console.log('sup');
                    $("#" + questionsNum).removeClass("selected");
                    $("#" + questionsNum).addClass("unselected");
                }

            }); 
        });
        
    }
    
    function searchQuestions(qnum) {
        console.log($("p " + qnum));
        $

    }
    
    var counterspec = 1; 
    var counterimple = 1;

    function addSpec() {
        console.log("here");
        counterspec += 1; 
        var spec = $("<div style='margin-right: 5px; margin-top: 15px;' class='spec" + counterspec +  "'><input class='name' style='width:78px; margin-right: 4px;' type='text' placeholder='Spec name...'><input class='intersects' style='width:78px; margin-right: 4px;' type='text' placeholder='Intersections'><input class='contains' style='width:78px' type='text' placeholder='Contains'><br><textarea class='input-xlarge' rows='4' placeholder='Enter spec...'></textarea><button data-spec='" +counterspec + "' class='dec btn btn-info' class='btn btn-primary'>Remove Spec</button></div>");
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
    
    $(".add").on('click', addSpec);
    $(".dec").each(function() {
        $(this).on('click', function() {
            console.log("made it!");
            decSpec($(this).attr("data-spec"));
        })
    });
    
   $(".addi").on('click', addImple);
    $(".deci").each(function() {
        $(this).on('click', function() {
          decImple($(this).attr("data-imple"));  
        });
    });
    $("button[type='submit']").on('click', submit);
    
    
    
        
});