Handlebars.registerHelper('each_with_index', function(cursor, options) {
  var out = '';
  cursor.forEach(function(member, i) {
    var key = 'Branch-'+i;
    out = out + Spark.labelBranch(key, function() { 
    	return options.fn({data: member, index: i+1});
	});
  });
  return out;
});	

Handlebars.registerHelper('render_members', function(cursor, options) {
	var out = '';
	cursor.forEach(function(member, i) {
		if (!(i % 2)) out += '<div class="row-fluid">';
	    var key = 'Branch-'+i;
	    out += Spark.labelBranch(key, function() { 
	    	return options.fn({member: member, index: i});
		});
		if (i % 2) out += '</div>';
	});	  
	return out;
});