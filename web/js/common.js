$('.nav1-btn,.nav1-bg').on('click',function(){
    if($('.nav1-menu').hasClass('is-active')){
        $('.nav1-menu').removeClass('is-active');
        $('.nav1-btn').removeClass('is-active');
    }else{
        $('.nav1-menu').addClass('is-active');
        $('.nav1-btn').addClass('is-active');
    }
});

$('.nav-btn,.nav-bg').on('click',function(){
    if($('.nav-menu').hasClass('is-active')){
        $('.nav-menu').removeClass('is-active');
    }else{
        $('.nav-menu').addClass('is-active');
    }
});
