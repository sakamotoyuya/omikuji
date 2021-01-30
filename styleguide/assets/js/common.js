$('.header-btn').click(function(){
    if($('.header-wrap').hasClass('is-active')){
        $('.header-wrap').removeClass('is-active');
        $('.header-btn').addClass('mr3');
    }else{
        $('.header-wrap').addClass('is-active');
        $('.header-btn').removeClass('mr3');
    }
});

$('.nav-btn,.nav-bg').click(function(){
    if($('.nav-menu').hasClass('is-active')){
        $('.nav-menu').removeClass('is-active');
    }else{
        $('.nav-menu').addClass('is-active');
    }
});