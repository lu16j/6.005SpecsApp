$(document).ready(function() {
    
    // save your personal parse.initialize keys here
    Parse.initialize("zCHV9oOD7r1NNnhCT06rIzNw4Ttuq99o6V7mIWWA", "TRv3ykUeIeju9aW2o8s2ZEDUDQpcXae2C4FlMEzG");

    //iniitialize
    var TestQuestions = Parse.Object.extend("TestQuestions");
    var testQuestions = new TestQuestions();
    

    $("button[type='submit']").on('click', function() { 
        
        var jsonStr = $('#result').text();
        testQuestions.set("questions", jsonStr);
        
        testQuestions.save(null, {
            success: function() {},
            error: function(error) {
                alert('failed to create: error code -' + error.description);
            }
        });
        
        
    });

});

