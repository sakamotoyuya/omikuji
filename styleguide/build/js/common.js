$('.nav1-btn,.nav1-bg').on('click',function(){
    if($('.nav1-menu').hasClass('is-active')){
        $('.nav1-menu').removeClass('is-active');
        $('.nav1-btn').removeClass('is-active');
    }else{
        $('.nav1-menu').addClass('is-active');
        $('.nav1-btn').addClass('is-active');
    }
});

$('.nav2-btn,.nav2-bg').on('click',function(){
    if($('.nav2-menu').hasClass('is-active')){
        $('.nav2-menu').removeClass('is-active');
    }else{
        $('.nav2-menu').addClass('is-active');
    }
});
