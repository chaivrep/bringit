//FIX FOR FOUNDATION TO FORCE LOAD OF JS AFTER PAGE LOAD
Template.template.rendered = function(){
    $(document).foundation();
}