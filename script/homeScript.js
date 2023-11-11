/*

Project: Pos System
Author: Nimna Kaveesha Sekara
License: MIT (See the LICENSE file for details)

*/

const loadingScreen = document.querySelector('#Home');
const loadingScreen1 = document.querySelector('#Customer');
const loadingScreen2 = document.querySelector('#Item');
const loadingScreen3 = document.querySelector('#Order');
const loadingScreen4 = document.querySelector('#orderDetails');
const myFunction=function (i){
    let id=['#home_page','#customer_page','#item_page','#order_page','#order_details_page'];
    let loadingScreens=[loadingScreen,loadingScreen1,loadingScreen2,loadingScreen3,loadingScreen4];
    for (let j = 0; j < id.length; j++) {
        if (i===j){
            loadingScreens[j].style.display = 'block';
            $(id[j]).removeClass("gradient-text");
            $(id[j]).addClass("active");
        }else{
            loadingScreens[j].style.display = 'none';
            $(id[j]).removeClass("active");
            $(id[j]).addClass("gradient-text");
        }
    }
}

window.addEventListener('load', ()=>{
    $("#preloader").css("display","none");
    myFunction(0);
});

$(document).ready(function () {
    $('#home_page').on('click',  () => {
        myFunction(0);
    });

    $('#customer_page').on('click', function () {
        myFunction(1);
    });

    $('#item_page').on('click', function () {
        myFunction(2);
    });

    $('#order_page').on('click', function () {
        myFunction(3);
    });

    $('#order_details_page').on('click', function () {
        myFunction(4);
    });
})


/*window.addEventListener("load", () => {
    $("#preloader").css("display","none");
});*/
/*export { myFunction };*/
