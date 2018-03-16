<!--
//Code WRITED&OWNED BY ADRENALIN OF WWW.TORRENTS.MD
//2006Y

mandatory_inputs = new Array();
function requested_inputs() {
	var trs, tds;
	trs = _ge('table_upload').getElementsByTagName('tr');
	var i = 0;
	for(i=0;i<trs.length;i++){
		tds = trs[i].getElementsByTagName('td');
		if(tds[0] == null) continue;
		td_html = tds[0].innerHTML;
		if (td_html.indexOf('*') != -1) { //If * is present then in the neighbor td the input are mandatory
			inputs = tds[1].getElementsByTagName('input');
			var y = 0;
			for(y=0;y<inputs.length;y++) {
				if (inputs[y].type == 'text' && inputs[y].className != 'hideit' && inputs[y].className != 'notmandatory') {
					var cur_input = inputs[y];
					mandatory_inputs.push(cur_input);
					_not_this_addEvent(cur_input,'keyup',function(){check_mandatory();} );
				}
			}

			selects = tds[1].getElementsByTagName('select');
			for(y=0;y<selects.length;y++) {
				cur_select = selects[y];
				mandatory_inputs.push(cur_select);
				_not_this_addEvent(cur_select,'change',function(){check_mandatory();} );
			}

			textareas = tds[1].getElementsByTagName('textarea');
			for(y=0;y<textareas.length;y++) {
				cur_textarea = textareas[y];
				mandatory_inputs.push(cur_textarea);
				_not_this_addEvent(cur_textarea,'keyup',function(){check_mandatory();} );
			}
		}
	}
	if (_ge_by_name('descr')) {
		_not_this_addEvent(_ge_by_name('descr'),'change',function(){check_mandatory();} );
	}
}

//On mandatory elements change send event here
once_highlight = false;
function check_mandatory() {
	if (mandatory_inputs.length == 0) return;
	if (_ge('send_button') == null) return; //No button, no sense
	var i = 0;
	var cur_input;
	var flag = false;
	//Args
	mand_args = check_mandatory.arguments;
	var highlight = false;
	//var check = false;
	if (mand_args.length != 0) {
	  if (mand_args[0] == 'highlight') {
	    highlight = true; //Highlight unfiled mandat.
	    once_highlight = true; //That mean what we have one time highlight
	  }
	  //else if(mand_args[0] == 'check') check = true; //Check all fields for normal color
	}
	if (make_preview != null) {
		make_preview();
	} else { default_make_preview(); }

	for (i=0;i<mandatory_inputs.length;i++) {
		cur_elm = mandatory_inputs[i];
		if (cur_elm.type && cur_elm.type == 'text' || cur_elm.type == 'file' || cur_elm.rows > 1) { //<input type="text"> || <textarea ros=10>
			if ( (cur_elm.value == '' || cur_elm.value.length < 1) && eval('window.upload_check_' + cur_elm.name) == null ) {
				flag = true;
				if (highlight) {
				  cur_elm.style.backgroundColor = '#FFFACD';
				  continue;
				}
				break;
			}
			//Custom checkers for
			if (eval('window.upload_check_' + cur_elm.name) != null) {
				//alert(cur_elm.value.replace(/\'|\)|\(/," "));
				global_upload_check = cur_elm.value; //Parm for upload_check_..
				eval('check_return = window.upload_check_' + cur_elm.name + '(global_upload_check);');
				if (check_return == false) {
					flag = true;
				    if (highlight) {
				      cur_elm.style.backgroundColor = '#FFFACD';
				      continue;
				    }
					break;
				}
			}
		} else if (cur_elm.selectedIndex == 0) {
			flag = true;
			if (highlight) {
			  cur_elm.style.backgroundColor = '#FFFACD';
			  continue;
		    }
			break;
		}
		cur_elm.style.backgroundColor = '#FFFFFF';
	}
	if (flag == false) { //Activate the button
		_ge('send_button').disabled=false;
		$('a_highlight_mandatory').className='hideit';
	} else {
		_ge('send_button').disabled=true;
		$('a_highlight_mandatory').className='showiti';
	}
	if(highlight == false && once_highlight == true) check_mandatory('highlight');
}

/*
  Checks for year value
  return True - the value are correct
  return False - the value is out of range
*/
function upload_check_year(value) {
	var years = new Array();

    var highlight = once_highlight; //!!This is a local highlight, not global
	if (value.indexOf('-') != -1) { //years range (with -)
		if (value.length != 9) { //must be xxxx-xxxx
			if (highlight == true) $('year_display').innerHTML = 'Examplu de interval: 2000-2005';
			return false;
		}

		years = value.split('-');
		if (years.length != 2) {
			if (highlight == true) $('year_display').innerHTML = 'Intervalul de ani trebuie sa fie din 2 cifre, ex. 2000-2005';
			return false;
		}
		if (years[0] > years[1]) {
			if (highlight == true) $('year_display').innerHTML = 'Primul an din interval trebuie sa fie mai mic ca a 2-lea, ex. 2000-2005';
			return false;
		}
	}
	else if (value.indexOf(',') != -1) { //enumartion years, validator (separated by ,)
		var years = value.split(',');
		if (years.length < 2) {
			if (highlight == true) {
				$('year_display').innerHTML = 'O enumerare trebuie sa fie compusa minim din 2 ani, exemplu de enumerare: 2001,2002';
			}
			return false;
		}
		//Same years in a enumeration are not allowed
		for (var i=0, ti=years.length; i<ti; i++) {
			var cur_year = years[i];
			for (var y=0; y<ti; y++) {
				if (y != i && cur_year == years[y]) {
					if (highlight == true) $('year_display').innerHTML = 'Anii din enumerare trebuie sa difere';
					return false;
				}
			}
		}
	} else {
		if (value.length != 4) {
			if (highlight == true) $('year_display').innerHTML = 'Un an trebuie sa fie minim din 4 cifre, exemplu: 2006';
			return false;
		}
		years[0] = value;
	}

	//Get current year
	right_now=new Date();
	var max_year = right_now.getFullYear() + 1;

	//Check for years from array, to be not more, and no less..
	for (var i=0, ti=years.length; i<ti; i++) {
		if (years[i] > max_year) {
			if (highlight == true) $('year_display').innerHTML = 'Anul maxim admis este: ' + max_year;
			return false;
		}
		else if (years[i] < 1000) {
			if (highlight == true) $('year_display').innerHTML = 'Anul minim admis este: 1000';
			return false;
		}
	}
	$('year_display').innerHTML = '';
	//Oipledanunah am ajuns aici ? :) Pune cineva bere azi, sau nu ? ;D
	return true;
}

function upload_check_file_torrent(value) {
    last8 = value.substring( value.length - 8, value.length );
    if (last8 == '.torrent') { return true; }
	return false;
}

function upload_check_descr(value) {
	if (value.length >= 15) { return true; }
	return false;
}

function check_value(elm,type) {
	var value = elm.value;
	if (type == 'integer') {
       var reg_integer = new RegExp('^\\d+$');
       if (value.match(reg_integer) == null) {
       	   var clean_integer = new RegExp('[^\\d+]');
       	   elm.value = value.replace(clean_integer,'');
       }
	}
	if (type == 'ranges') { //allow numbers with ranges(chars -,)
       var reg_integer = new RegExp('^[\\d\\-\\,]+$');
       if (value.match(reg_integer) == null) {
       	   //alert('g');
       	   var clean_integer = new RegExp('[^\\d\\-\\,]+');
       	   elm.value = value.replace(clean_integer,'');
       }
	}
	/*if (type == 'version') { //Da mai sunt si beta,rc.. asa ca asta sax
       var reg_integer = new RegExp('^\\d+[.,]\\d+.*$');
       if (value.match(reg_integer) == null) {
       	   var clean_integer = new RegExp('[^\\d+.,]');
       	   elm.value = value.replace(clean_integer,'');
       }
	}*/
}

/*
  Torrent input file name validation
*/
function trnt_file_validate(trnt_input) {
  var tr_tnt_file = $('tr_tnt_file');
  var last8 = trnt_input.value.substring( trnt_input.value.length - 8, trnt_input.value.length );
  if (last8 != '.torrent') {
    tr_tnt_file.style.background='#FF8A90';
    show_it('err_tnt_file');
    disable_input('send_button');
    trnt_input.value='';
    trnt_input.focus();
  } else {
    tr_tnt_file.style.background='';
    hide_it('err_tnt_file');
    enable_input('send_button');
  }
}
/*
  Img input file name validation
*/
function img_file_validate(img_input) {
  var tr_img_file = $('tr_img_file'); //The row id
  var ext = get_ext(img_input.value);
  if (ext != 'jpg' && ext != 'jpeg' && ext != 'png') {
    tr_img_file.style.background='#FF8A90';
    show_it('err_img_file');
    img_input.value='';
    img_input.focus();
  } else {
    tr_img_file.style.background='';
    hide_it('err_img_file');
  }
}

function get_ext(path) {
	var bucatzator = path.split('.');
	var ext = bucatzator[bucatzator.length - 1];
	return ext.toLowerCase();
}

/*
  Change category Handler
*/
function changecat(cat_name,cat_index,cat) {
  mandatory_inputs = new Array(); //Unregister mandatory inputs memory
  make_preview = null; //Unregister make_preview function
  //categ_input_value_preserv(); //Save all INPUT values and SAVE for the inputs of the new category(if need), nii lene ;p
  categ_clear(); //Clean the DIV where must be the new table
  if (cat_index == 0) { //No category, hide all
  	  return;
  }
  categ_loading(); //Show the loading image
  once_highlight = false; //Reset the Once highlight var
  categ_show(cat_name);
}

function categ_show(categ) {
	//_ge('place_for_category_name').innerHTML=categ;
	categ = categ.toLowerCase();
	categ = categ.replace(' ','_');
	var html = './templates/upl_categs/'+categ+'.html?v='+conf_template_ver;
	var js = './templates/upl_categs/'+categ+'.js';
	loadurl(html,function(){take_category_html(js);});
	//We'll load javascript too, but only after load of html, see take_category_html function
}
function categ_loading() {
	 _ge('place_for_upload_table').innerHTML = '<img align="center" src="./pic/loading.gif">';
}
function categ_clear() {
	//_ge('place_for_category_name').innerHTML = '';
	_ge('place_for_upload_table').innerHTML = '';
}

/*
  XMLhttp will send HTML of the category table to this
*/
function take_category_html(js) {
    if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
        _ge('place_for_upload_table').innerHTML = xmlhttp.responseText;
        add_preview_row_to_upload_table();
        add_send_to_end_of_upload_table(); //Will add the send button to the of the upload table
        add_additional_filed_link_to_upload_table(); //Will add the additional field add-link
		requested_inputs(); //Handle mandatory elements
		activate_standart_verifier(); //Put verifiers for standart inputs(like years)
        //Load Javascript only after HTML load
        continue_category_onload=true; //The loaded js should check for this, if true call continue_on_category_html_load
        xLoadScript(js); //check_mandatory Stimulate check of mandatory, for preview and the "higlight unfilled"
        on_category_load();
    }
}
//Thse actions must be taked only after category js was loaded
function continue_on_category_html_load() {
    put_filled_fields(); //Fill with already filled, at edit form
	check_mandatory(); //Check the fields validity, status of the edit button, check mandatory link..
}

/*
  These can be in all categorys, so they are standart, check if present and attach
*/
function activate_standart_verifier() {
	if (_ge_by_name('year') != null) {
      _not_this_addEvent(_ge_by_name('year'),'keyup',function(){check_value(_ge_by_name('year'),'ranges');} );
    }
}
//Added: tre de rescris, de inlocuit cu clonarea, asta-i mazohism
function add_send_to_end_of_upload_table() {
	if (_ge('table_upload')) {
		var _tbody,_tr,_td,_input;
		//Create a input
		_input = document.createElement('input');
		_input.type='submit';
		_input.id='send_button';
		_input.className ='btn';
		_input.disabled=true;
		_input.value='Edit it!';
		//Create a link "Show unfiled mandatory fields"
		_a = document.createElement('a');
		_a.id='a_highlight_mandatory';
		_a.style.cursor='pointer';
		_a.style.marginLeft='5px';
		_a.onclick=function(){check_mandatory('highlight');};
		_show_unfiled = transl_show_mand;
		_a.appendChild(document.createTextNode(_show_unfiled));
		//Create a td
		_td = document.createElement('td');
		_td.colSpan=2;
		_td.align ='center';
		//Create a tr
		_tr = document.createElement('tr');
		//Create a tbody, without tbody IE will not work ;p
		_tbody = document.createElement('tbody');
		//Put input into td, td into tr, tr into tbody, tbody into the end of table_upload table
		_td.appendChild(_input);
		_td.appendChild(_a);
		_tr.appendChild(_td);
		//That's for ie compatibility
		_tbody.appendChild(_tr);
		_ge('table_upload').appendChild(_tbody);
	}
}
/*
  Functie care adauga
                      <tr><td><div>Preview</div></td></tr>
                      <tr><td><div id="preview"></div></td></tr>
               la sfirsitul tabelei upload
*/
//Cream header - Preview
//Added: tre de rescris, de inlocuit cu clonarea, asta-i mazohism
function add_preview_row_to_upload_table() {
	if (_ge('table_upload') == null) { return; } //No table, no sense
	var _div,_td,_tr,_tbody;
	//Create a div
	_div = document.createElement('div');
	_div.className='n';
	_div.style.fontWeight='bold';
	_div.appendChild(document.createTextNode('Preview'));
	//Create a td
	_td = document.createElement('td');
	_td.colSpan=2;
	_td.style.border='0px';
	_td.style.backgroundColor='#F5F4EA';
	//Create tr&tbody
	_tr = document.createElement('tr');
	_tbody = document.createElement('tbody');
	//Acum facem un meeting al elementelor ;)
	_td.appendChild(_div);
	_tr.appendChild(_td);
	_tbody.appendChild(_tr);
	_ge('table_upload').appendChild(_tbody);

	//Acum adaugam si divul Preview
	_div = document.createElement('div');
	_div.id = 'preview';
	_div.style.fontWeight='bold';
	_txtnode = document.createTextNode('');
	_div.appendChild(_txtnode);

	_tr = document.createElement('tr');
	//Left td = Torrent name
	_td = document.createElement('td');
	_td.appendChild(document.createTextNode('Torrent name'));
	_tr.appendChild(_td);
	//Right td = div id=preview
	_td = document.createElement('td');
	_td.appendChild(_div);
	_tr.appendChild(_td);

	_tbody = document.createElement('tbody');
	_tbody.appendChild(_tr);
	_ge('table_upload').appendChild(_tbody);
}

//This function will load dest url and will send the result to handler
function loadurl(dest,handler) {
    xmlhttp = window.XMLHttpRequest?new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = handler;
    xmlhttp.open("GET", dest);
    xmlhttp.send(null);
}



/*
  Adding aditional fields
*/
//cloneNode, elegant? Da, shitul de mai sus cu createElement se poate de inlocuit
function add_additional_filed_link_to_upload_table() {
	if($('tr_lang') == null) return;
    var cloned_tr=$('tr_add_custom').cloneNode(true);
    cloned_tr.id='_tr_add_custom';
    _not_this_addEvent(node_getElementById(cloned_tr,'_add_new_additional'),'click',function() { new_additional(); } );
    $('table_upload_tbody').insertBefore(cloned_tr,$('tr_lang').nextSibling);
}
function new_additional() {
    var cloned_tr=$('tr_additional').cloneNode(true);
    cloned_tr.id='';
    $('table_upload_tbody').insertBefore(cloned_tr,$('_tr_add_custom'));
}
/*
  Default preview maker
*/
default_make_preview = function() {
	if (_ge('preview') == null) return; //No div preview, no sense
	if (_ge_by_name('name') == null || _ge_by_name('year') == null) { return; }
	var name = $F('name') + ' ' + ' [' + $F('year');
	if (_ge_by_name('language') != null) {
		name = name + '/' + $F('language').substring(0,2);
	}
	name = name + ']';
	_ge('preview').innerHTML = name;
}


/*
  Edit Specific functions
*/
function put_filled_fields() {
	additional_filler=new Array();
	/*
	   filed_inputs.push(  new Array('name','asdasd<h2>sadasd</h2>') );
	   filed_inputs.push(  new Array('year','1997') );
	*/
	for(var i=0;i<filed_inputs.length;i++) {
		var filed_input = filed_inputs[i];
		var n = filed_input[0];
		var v = filed_input[1];
		if (_ge_by_name(n)) {
			o = _ge_by_name(n);
			if(o.nodeName.toLowerCase() == 'select') {
				if (o.options[v] && o.options[v].value==v) {
					o.selectedIndex = v;
				}
				else {
					o.selectedIndex = find_selectbox_value_index(o,v);
				}
				continue;
			}
			if (o.type=='checkbox') {
				if (v == 1) o.checked=true;
				if (n == 'serial') { //If the serial checkbox is checked then activate s&episode fields
					enable_input(_ge_by_name('season'));
					enable_input(_ge_by_name('episode'));
				}
				if (n == 'translated_same_original') {
					if (_ge_by_name('movie_translated_name') != null) _ge_by_name('movie_translated_name').setAttribute('readonly',true);
				}
				continue;
			}
			if(o.name=='movie_genres_list_ids') {
				if(typeof(movie_generate_genres_list) == null) return;
				var g = v.split(',');
				movie_genres_list_ids = new Array(); //This is the global var ussed by movie_generate_genres_list and other
				for(y=0;y<g.length;y++) {
					movie_genres_list_ids.push(g[y]);
				}
				movie_generate_genres_list(movie_genres_list_ids);
				continue;
			}
			o.value=v;
			continue;
		}
		if(n=='additional') {
			if(filed_input.length != 3) continue;
			addit_n = filed_input[1];
			addit_v = filed_input[2];
			if(addit_n.length == 0 || addit_v.length == 0) continue;
			new_additional();
			//_ge_by_name('additional_name[]').value='ggg';
			additional_filler.push( new Array(addit_n,addit_v) ); //Additional fields will be filled after
		}
	}
	if(additional_filler.length != 0) {
		addit_names = document.getElementsByName('additional_name[]');
		addit_dscrs = document.getElementsByName('additional_descr[]');
		for(var i=0;i<additional_filler.length;i++) {
			addit_n = additional_filler[i][0];
			addit_v = additional_filler[i][1];
			addit_names[i].value = addit_n;
			addit_dscrs[i].value = addit_v;
		}
	}
}

/*
  Function what traverse a select box to find a specific value and return the index of the value
  @o - select object
  @v - value to find
  return index id
*/
function find_selectbox_value_index(o,v) {
	if (o==null || o.length <= 0) return;
	for(var i=1;i<o.length;i++) {
		if(o.options[i].value==v) {
			return i;
		}
	}
}

function automatic_change_category(category_id) {
	if(typeof(torrent_category) == null || category_id == null) return;
	if(_ge_by_name('type') == null) return;
	var type = _ge_by_name('type');
	var cat_index = find_selectbox_value_index(type,category_id);
	type.selectedIndex = cat_index;
	if(cat_index) {
        var cat = $j(type.options[cat_index]).attr("customcat");
		changecat(cat,cat_index);
	}
}
(function($) {
	$(document).ready(function() {
		// Init
		$('div.tabs div.version_head:first').addClass('selected');
		$('div.version_row:first').show();

		$('div.version_control div.tabs div.version_head').click(function() {
			$('div.version_head').removeClass('selected').addClass('normal');
			$(this).removeClass('normal').addClass('selected');
			$('div.version_row').hide();
			$('div.version_row[rel="'+ $(this).attr('rel') +'"]').show();
		});

		$('.version_row .restore span').click(function() {
			filed_inputs = new Array();

			$(this).parents('div.version_row:first').find('span.rowspan').each(function() {
				if ($(this).hasClass('additional'))
					filed_inputs.push(  new Array('additional',$(this).find('b').text(), $(this).find('span').text()) );
				else
					filed_inputs.push(  new Array($(this).find('b').text(), $(this).find('span').text()) );
			});

			automatic_change_category(torrent_category);
		});
	});
})($j);
//-->