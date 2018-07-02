document.getElementById('name').focus();
//Get references for inputs and 'activities' heading
let activities = document.querySelectorAll('.activities input');
var activityTitle = document.querySelectorAll(".activities legend");
var inputRefs = document.querySelectorAll("#name, #mail, #cc-num, #zip, #cvv");
let checkedValidation = false;

//Regular expessions for input validation
let nameReg = /^[A-Za-z ]+$/
let emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
let cardReg = /^[0-9]{13,16}$/
let zipReg = /^[0-9]{5}$/
let cvvReg = /^[0-9]{3}$/

//Hide elements that aren't relevant to the opening state of the page
$('#other-title').hide();
$(".credit-card").next().hide();
$(".credit-card").next().next().hide();

//Constructor to contain references for all the input data that will checked and manipulated
function FieldObjects (regex, style, valid, name, invalidText){
 this.regex = regex;
 this.style = style;
 this.valid = valid;
 this.name = name;
 this.invalidText = invalidText;
}

// Create fieldObjects instances and store them all in an array
let nameField = new FieldObjects(nameReg, "invalid", false, "Name: ", "Please enter a name");
let emailField = new FieldObjects(emailReg, "invalid", false, "Email: ", 'Please enter a valid email');
let cardField = new FieldObjects(cardReg, "invalid", false, "Card Number: ", 'Please enter your credit card number');
let zipField = new FieldObjects(zipReg, "invalid", false, "Zip Code: ", 'Zip Code Required');
let cvvField = new FieldObjects(cvvReg, "invalid", false, "CVV: ", 'CVV Required');

let fieldsArr = [nameField, emailField, cardField, zipField, cvvField];

//Hide jobRole text area unless 'other' is selected
function jobRole(){
 if (document.getElementById('title').value === 'other'){
    $('#other-title').fadeIn(500);
 } else {
   $('#other-title').fadeOut(200);
 }
}

/*
 This function firstly hides the 'colors' select unless a design is selected.
 The colors and names share similar information in their names, if a match is found that result is shown.
 Matching colors indexes are pushed into the 'availableColors' from that the first index is used to pick the first color option..
*/
function tShirtInfo(){
  let design = document.getElementById('design').value;
  let colors = document.getElementById('color').options;
  let availableColors = [];

  //Hide options and colors unless a design is selected
  // For exceeds expectations grade
    $(colors).hide();
    if (design == 'Select Theme'){
      $('#colors-js-puns').hide();
    } else {$('#colors-js-puns').show();

//Find matches between color and design text
   for (let i = 0; i < colors.length; i++){
     console.log(design);
        if (colors[i].textContent.includes(design)){
          $(colors[i]).show();
          availableColors.push(i);
         }
      }
   }
   //Display first available option
   colors.selectedIndex = availableColors[0];
}

//vvvvvvvvvvvvvvv Activities Checkboxes  vvvvvvvvvvvvv

$('.activities label').on('change', function(e){
  let total = 0;
  let totalArray = [];
// Show warnings dynamically after first invalid submission attempt
  $(activityTitle).addClass('invalid');
    //Invalid to submit until proven true through testing
      checkedValidation = false;
      // Hide total unless any boxes are checked
      $( ".total" ).remove();
        //loop through all activity checkboxes
        for (let i = 0; i < activities.length; i++){
          //Get a reference to the label of the clicked checkbox to compare text
          let clicked = e.target.parentNode.innerText;
          // String matches are compared to disable other conflicting times
          let am = activities[i].parentNode.textContent.match(/9am/);
          let pm = activities[i].parentNode.textContent.match(/4pm/);

          /* If any of the activities contain the same time as the one clicked, whilst it remains checked, disable
          those activities.
          */

          if( am && clicked.includes('9am') && e.target.checked || pm && clicked.includes('4pm') && e.target.checked  )
          {
              activities[i].disabled = true;
              $(activities[i].parentNode).addClass('booked');
              $(e.target.parentNode).removeClass('booked');
          //Otherwise enable checkboxes
           } else if( am && clicked.includes('9am') && !e.target.checked || pm && clicked.includes('4pm') && !e.target.checked )
            {
               activities[i].disabled = false;
               $(activities[i].parentNode).removeClass('booked');
            }
          };
          //Loop through and find all checked boxes
          for (let i = 0; i < activities.length; i++){
          if( activities[i].checked){
             {
               /* Retrieve the cost of checked boxes from the corresponding label text, convert it to an integer,
               and push these costs into the 'totalArray'.
               */
             var string = activities[i].parentNode.textContent;
             var numbers = parseInt(string.match(/\d{3}/).map(Number));
                totalArray.push(numbers);
                //Field passes submission validation if at least one item is checked
                checkedValidation = true;
                $(activityTitle).removeClass('invalid');
            }
          }
        }
  // Add up all the values in the array, update the price
  total = totalArray.reduce((a, b) => a + b, 0);
         e.target.disabled = false;
         $( ".activities" ).append(`<div class="total"> Total: $${total}</div>`);
       });

//vvvvvvvvvvvvvvv Payment Type  vvvvvvvvvvvvvvvvvvv
$('#payment').on('change', function(){
  //Hide irrelevant informaiton
  $(".credit-card").hide();
  $(".paypal").hide();
  $(".bitcoin").hide();
  //Show information relating to the payment method selected
  let paymentMethod = document.getElementById('payment').value;
  switch (paymentMethod){
      case "credit card":
        $(".credit-card").show();
      break;
      case "paypal":
        $(".paypal").show();
      break;
      case "bitcoin":
        $(".bitcoin").show();
      break;
    }
});

//vvvvvvvvvvvvvvv Submission  vvvvvvvvvvvvvvvvvvv

$('button, input[type="submit"]').on('click', function(e){

  //After failed submission, dynamically validate
  // For exceeds expectations grade
 document.addEventListener('keyup', function(event) {
   validate(inputRefs);
 });

 if(fieldsArr.every(inputsValid) === true && checkedValidation){
      console.log("Valid");
    } else if (fieldsArr.every(inputsValid) === false || !checkedValidation)
      {
        //If any fields are not valid, prevent submission
        e.preventDefault();
      }
    //Run validation when sibmitting form
    validate(inputRefs);
});

//vvvvvvvvvvvvvvv Validation  vvvvvvvvvvvvvvvvvvv

  function validate(inputsArray){
    /*inputsArray holds the DOM selection references for the text inputs, while fieldsArry
      contains the objects used to validate and manipulate content
    */
    //Loop through inputs
      for (let i = 0; i < inputsArray.length; i++){
      // Remove warnings
       inputsArray[i].previousElementSibling.innerText = fieldsArr[i].name;
       $(inputsArray[i].previousElementSibling).removeClass('invalid');
      // Test the inputs. If any fail, add warnings
       if(fieldsArr[i].regex.test(inputsArray[i].value) == false){
           inputsArray[i].previousElementSibling.innerHTML = fieldsArr[i].invalidText;
           $(inputsArray[i].previousElementSibling).addClass('invalid');
           //Store failure in the failed object
           fieldsArr[i].valid = false;

         }
        // Otherwise store success
         else {
             fieldsArr[i].valid = true;

         }

         // If no activities are checked, give warning
         if (!checkedValidation){
            $(activityTitle).addClass('invalid');
          }
          // Some conditional feedback for exceeds expectations grade, if more conditions were needed
          // update constructor to code DRY
          if ( inputsArray[2].value.length == 10 || inputsArray[2].value.length > 16 ){
            inputsArray[2].previousElementSibling.innerHTML = "Credit Card must be between 13 and 16 digits long." + '<br>';
          }

          if( inputsArray[3].value.length >= 6 ){
            inputsArray[3].previousElementSibling.innerText =  "Zip Must be 5 digits long";
          }

          if(inputsArray[4].value.length >= 4 || inputsArray[4].value.length <= 2){
            inputsArray[4].previousElementSibling.innerText =  "CVV Must be 3 digits long";

          }

      }
  };

  // This function distills all tests into a single boolean
  // - only if all the objects 'valid' values are true, it returns 'true'
  function inputsValid(el) {
    return(el.valid);
  }


jobRole();
tShirtInfo();

//
