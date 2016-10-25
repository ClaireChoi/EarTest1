/**
 * 
 */
$(function(){
	
	var status = false;
	
	$('img#checkbox_leapmotion').on('click',  function(){
		if(!status) {
			$(this).attr('src', 'img/check.png');
			status = true;
			$('div#manual').css('display', 'block');
			$('div#goto_next_pg').css('display', 'block');
		} else {
			$(this).attr('src', 'img/non_check.png');
			status = false;
			$('div#manual').css('display', 'none');
			$('div#goto_next_pg').css('display', 'none');
		}
	});
	
});