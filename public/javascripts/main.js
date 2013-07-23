function socket_party(username) {
	var socket = io.connect("http://localhost:3000");
	
	socket.on("connect", function() {
		socket.emit("add user", username);
		$('#login').fadeOut("slow", function() {
			$('#chatRoom').fadeIn("slow");
		});
	});

	socket.on("send message", function(username, data) {
		$('#window').append("<b style='color:gray;text-decoration: italic;'>"+username+":</b> "+data+"<br/>");
	});

	socket.on("update users", function(data) {
		$('#users').empty();
		$.each(data, function(key, value) {
			$('#users').append("<div>"+key+"</div>");
		});
	});

	$('#sendMsg').click(function() {
		var message = $('#msg').val();
		$('#msg').val('');
		socket.emit('send message', message);
	});
}

$(function() {
	$('#btnConnect').click(function() {
		var username = $('#txtName').val();
		if(username == "") {
			alert('enter username');
		}else {
			socket_party(username);
		}
	});

	$('#msg').keypress(function(e) {
		if(e.which == 13) {
			$('#sendMsg').click();
		}
	});
});
