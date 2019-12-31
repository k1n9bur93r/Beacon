var SubbedEvents = false;// variable that keeps track if a user is currently subbed to an event
var ActiveStore; //variable that stores the ID of the current store page a user is on
var currentColor = 0; //variable that holds the color code of a current store
var isAnimating = false; //used to keep the snackbar's animation from being reset while animating, as this tends to break the snackbar
var LastClickedStore;

//snack bar logic 
function DisplaySnackBar(msgtext, state) {
    // reset the snackbar for the next message, add the text, show the bar
    $("div#snackbar").removeClass();
    $("div#snackbar").text(msgtext);
    $("div#snackbar").addClass('show');
    var classname;
    classname = 'temp';
    //depending on the state passed in, color the snack bar accordingly 
    switch (state)
    {
        case 0:
            {
        $("div#snackbar").addClass('SuccessStatus');
        classname = 'SuccessStatus';
                break;
            }
        case 1:
            {
        $("div#snackbar").addClass('InfoStatus');
        classname = 'InfoStatus';
                break;
            }
        case 2:
            {
        $("div#snackbar").addClass('WarningStatus');
        classname = 'WarningStatus';
                break;
            }
        case 3:
            {
        $("div#snackbar").addClass('ErrorStatus');
        classname = 'ErrorStatus';
                break;
            }
    }
    //if the snackbar is not currently visible, start the animation agian
    if (isAnimating == false) {
        isAnimating = true;
        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            // $("div#snackbar").addClass('show');
            $("div#snackbar").removeClass('show');
            $("div#snackbar").removeClass(classname);
            isAnimating = false;
        }, 3000);
    }
}
