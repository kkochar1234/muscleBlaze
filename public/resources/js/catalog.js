$('.js-load-more').click(function(e){
  e.preventDefault();
  var ele = $(this),
      url = ele.attr('href'),
      pageNo = ele.attr('data-pageno'),
      perPage = ele.attr('data-perpage');

  if(ele.hasClass('disabled')){
    return
  } else {
    ele.addClass('disabled')
  }

  HK.Ajax.customReq({
    url : url+pageNo,
    dataType : 'html',
    success : function(data){
      $('.variants-container').append(data);
      ele.attr('data-pageno',pageNo+1);
      ele.removeClass('disabled');
      if($('.item').length < perPage*(pageNo+1)){
        ele.remove()
      }
    },
    error : function(err){
      ele.removeClass('disabled')
    }

  })
})