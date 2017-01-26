$(function(){
	$(".tip-toggle").on("click",function(){
		if($(this).find(".fa-eye").length > 0){
			$(this).find(".fa-eye").removeClass('fa-eye').addClass("fa-eye-slash");
			$(".tip").removeClass("hide");
		}
		else {
			$(this).find(".fa-eye-slash").removeClass('fa-eye-slash').addClass("fa-eye");
			$(".tip").addClass("hide");
		}
	});
});
