function typeAhead(Obj){
	this.URL = Obj.URL;
	this.charLength = Obj.charLength;
	this.el_id = Obj.el_id;
	this.container = Obj.listContainer;
};
typeAhead.prototype = {
	init : function(){
		this.addEventListeners();
	},
	data : [],
	sayHello : function(){
		console('Hello World !')
	},
	addEventListeners : function(){
		var self = this;
		$(self.el_id).keyup(function(event){
			event.preventDefault();
			var x = $(self.el_id).val().split(';')
			if(x[x.length-1].length >= self.charLength){
				self.callData(x[x.length-1]);
			}else{
				self.listEmpty();
			}		
		});
	},
	listEmpty : function(){
		$(this.container).empty();
	},
	callData : function(param){
		var self = this;
		var dataString = 'param='+ param;
		$.ajax({  
			type: "POST",  
			url: self.URL,
			data: dataString,  
			success: function(response) {
				var arr = JSON.parse(response)
				self.createHTMLNodes();
				self.populateList(arr)
			} ,
			error : function(response){
				alert('ajax problem')
			}
		}); 
	},
	createHTMLNodes : function(){
		$(this.container).append("<div class=\"list\"><ul></ul></div>");
	},
	populateList : function(res){
		this.listEmpty();
		this.data = [];
		this.createHTMLNodes();
		for(i=0; i<res.length;i++){
			/*if(res[i].clinic != ""){				
				if(this.checkItemIntoList(res[i].clinic) == false){
					$(this.container).find(".list ul").append("<li class=\"list-item hospital\">"+res[i].clinic+"<input type=\"hidden\" value=\"" + res[i].clinic + "\" /></li>");
					this.data.push(res[i].clinic);
				}
			}else{
				if(this.checkItemIntoList(res[i].email) == false){
					$(this.container).find(".list ul").append("<li class=\"list-item email\">"+res[i].email+" <span>&lt;"+res[i].fname+ " "+res[i].lname+"&gt;</span><input type=\"hidden\" value=\"" + res[i].email + "\" /></li>");
					this.data.push(res[i].email);
				}
			}*/
			if(this.checkItemIntoList(res[i]) == false){
				$(this.container).find(".list ul").append("<li class=\"list-item location\">"+res[i]+" <span>&lt;"+res[i]+ "&gt;</span><input type=\"hidden\" value=\"" + res[i] + "\" /></li>");
				this.data.push(res[i]);
			}
			
		}
		this.addClickEvent();
	},
	checkItemIntoList : function(val){
		var flag = false;
		if(this.data.length == 0){
			return false
		}else{
			for(var i=0;i<this.data.length;i++){
				if(this.data[i] == val){
					flag = true;
				}
			}
		}
		return flag;
	},
	addClickEvent : function(){
		var self = this;
		$(".list-item").click(function(event){
			event.preventDefault();
			self.putValue($(this).find('input[type=hidden]').val());
		});
	},
	putValue : function(val){
		var st = "";
		var x = $(this.el_id).val().split(';')
		for(var i=0;i<x.length-1;i++){
			st = st + x[i] + "; ";
		}
		st = st + val;
		$(this.el_id).val(st);
		this.listEmpty();
	}
}