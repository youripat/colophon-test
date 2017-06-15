

$('document').ready(function () {
    $("#published").click(function() {
        $(".footer-home-drafts").fadeOut("slow");
        $(".footer-home-published").fadeIn("slow");
        $(".active-home-drafts").css("opacity","0.4")
        $(".active-home-drafts").css("border-bottom","white")
        $(".active-home-published").css("opacity","1")
        $(".active-home-published").css("border-bottom","2px solid #5C5CCC")
    });
    $("#drafts").click(function() {
        $(".footer-home-published").fadeOut("slow");
        $(".footer-home-drafts").fadeIn("slow");
        $(".active-home-published").css("opacity","0.4")
        $(".active-home-published").css("border-bottom","white")
        $(".active-home-drafts1").css("opacity","1")
        $(".active-home-drafts").css("border-bottom","2px solid #5C5CCC")
    });
    $(".arrow-down").click(function() {
        $(".arrow-up").show();
        $(".arrow-down").hide();
    });
    $(".arrow-up").click(function() {
        $(".arrow-down").show();
        $(".arrow-up").hide();
    });
    $(".arrow-down").click(function() {
        $(".account-menu").removeClass("toggle");
    })
    $(".arrow-up").click(function() {
        $(".account-menu").addClass("toggle");
    })


});
