$(document).ready(function () {
    console.log(0);
    $('.admin-sidebar').mouseenter(function () {
        $(this).addClass('sidebar-show');
    })
    $('.admin-sidebar').mouseleave(function () {
        $(this).removeClass('sidebar-show');
    })
});