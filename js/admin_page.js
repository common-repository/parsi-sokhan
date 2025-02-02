jQuery(document).ready(function($) {

	//
	// Function for blur event on file upload field (used for input field AND upload button)
	function blur_file_upload_field() {

		file_upload_url = $('#csv_file').val();
		extension = file_upload_url.substr((file_upload_url.lastIndexOf('.') +1));

		// If the file upload does not contain a valid .csv file extension
		if(extension !== 'csv') {

			// File extension .csv popup error
			$( "#dialog_csv_file" ).dialog({
			  modal: true,
			  buttons: {
				بله: function() {
				  $( this ).dialog( "close" );
				}
			  }
			});
			$('#return_csv_col_count').text('0');
			return;
		}

		// Setup ajax variable
		var data = {
			action: 'csv_parsi_sokhan_get_csv_cols',
			file_upload_url: file_upload_url
		};

		// Run ajax request
		$.post(ajaxurl, data, function(response) {
			//alert(response.column_count);
			$('#return_csv_col_count').text(response.column_count);
			$('#num_cols_csv_file').val(response.column_count);
		});
	}

	//
	// Initiate tabbed content
	$(function() {
		$('#tabs').tabs();
	});

	//
	// Click "Table Preview" button each time page is loaded
	$('#repop_table_ajax').trigger('click');

	//
	// Disable 'disable auto-increment' button until needed
	$('#remove_autoinc_column').prop('disabled', true);

	//
	// Click to hide error/success messages
	$('.error_message, .success_message, .info_message_dismiss').click(function() {
		 $( this ).fadeOut( "slow", function() {
		});
	});

	//
	// Set blur click function on file input field
	$('#csv_file').blur(function() {
		blur_file_upload_field();  // Function to blur file upload field (gets column count from .csv file)
	});

	// *******  Begin WP Media Uploader ******* //
	jQuery('#csv_file_button').click(function(e) {
			e.preventDefault();
			var image = wp.media({
					title: 'Upload',
					// mutiple: true if you want to upload multiple files at once
					multiple: false
			}).open()
			.on('select', function(e){
					// This will return the selected image from the Media Uploader, the result is an object
					var uploaded_image = image.state().get('selection').first();
					// We convert uploaded_image to a JSON object to make accessing it easier
					// Output to the console uploaded_image
					console.log(uploaded_image);
					var image_url = uploaded_image.toJSON().url;
					// Let's assign the url value to the input field
					jQuery('#csv_file').val(image_url);

			});
	});
	// *******  End WP Media Uploader ******* //



	// ******* Begin 'Select Table' dropdown change function ******* //
	$('#table_select').change(function() {  // Get column count and load table

		// Begin ajax loading image
		$('#table_preview').html('<img src="'+csv_parsi_sokhan_pass_js_vars.ajax_image+'" />');

		// Clear 'disable auto_inc' checkbox
		$('#remove_autoinc_column').prop('checked', false);

		// Get new table name from dropdown
		sel_val = $('#table_select').val();

		// Setup ajax variable
		var data = {
			action: 'csv_parsi_sokhan_get_columns',
			sel_val: sel_val
			//disable_autoinc: disable_autoinc
		};

		// Run ajax request
		$.post(csv_parsi_sokhan_pass_js_vars.ajaxurl, data, function(response) {

			// Populate Table Preview HTML from response
			$('#table_preview').html(response.content);

			// Determine if column has an auto_inc value.. and enable/disable the checkbox accordingly
			if(response.enable_auto_inc_option == 'true') {
				$("#remove_autoinc_column").prop('disabled', false);
			}
			if(response.enable_auto_inc_option == 'false') {
				$("#remove_autoinc_column").prop('disabled', true);
			}


			// Get column count from ajax table and populate hidden div for form submission comparison
			var colCount = 0;
			$('#ajax_table tr:nth-child(1) td').each(function () {  // Array of table td elements
				if ($(this).attr('colspan')) {  // If the td element contains a 'colspan' attribute
					colCount += +$(this).attr('colspan');  // Count the 'colspan' attributes
				} else {
					colCount++;  // Else count single columns
				}
			});

			// Populate #num_cols hidden input with number of columns
			$('#num_cols').val(colCount);
		});
	});
	// ******* End 'Select Table' dropdown change function ******* //



	// ******* Begin 'Reload Table Preview' button AND 'Disable auto-increment Column' checkbox click function ******* //
	$('#repop_table_ajax, #remove_autoinc_column').click(function() {  // Reload Table

		// Begin ajax loading image
		$('#table_preview').html('<img src="'+csv_parsi_sokhan_pass_js_vars.ajax_image+'" />');

		// Get value of disable auto-increment column checkbox
		if($('#remove_autoinc_column').is(':checked')){
			disable_autoinc = 'true';
		}else{
			disable_autoinc = 'false';
		}
		// Get new table name from dropdown
		sel_val = $('#table_select').val();

		// Setup ajax variable
		var data = {
			action: 'csv_parsi_sokhan_get_columns',
			sel_val: sel_val,
			disable_autoinc: disable_autoinc
		};

		// Run ajax request
		$.post(csv_parsi_sokhan_pass_js_vars.ajaxurl, data, function(response) {

			// Populate Table Preview HTML from response
			$('#table_preview').html(response.content);

			// Determine if column has an auto_inc value.. and enable/disable the checkbox accordingly
			if(response.enable_auto_inc_option == 'true') {
				$("#remove_autoinc_column").prop('disabled', false);
			}
			if(response.enable_auto_inc_option == 'false') {
				$("#remove_autoinc_column").prop('disabled', true);
			}

			// Get column count from ajax table and populate hidden div for form submission comparison
			var colCount = 0;
			$('#ajax_table tr:nth-child(1) td').each(function () {  // Array of table td elements
				if ($(this).attr('colspan')) {  // If the td element contains a 'colspan' attribute
					colCount += +$(this).attr('colspan');  // Count the 'colspan' attributes
				} else {
					colCount++;  // Else count single columns
				}
			});

			// Populate #num_cols hidden input with number of columns
			$('#num_cols').val(colCount);

			// Re-populate column count value
			remove_auto_col_val = $('#column_count').html('<strong>'+colCount+'</strong>');
		});
	});
	// ******* End 'Reload Table Preview' button AND 'Disable auto-increment Column' checkbox click function ******* //

	//
	// Delete DB Table button

	$('#dialog-confirm').dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		resizable: false,
		buttons: {
			'پاک کردن': function() {
				$('#delete_db_button_hidden').val('true');
				$(this).dialog('close');
				$('#csv_parsi_sokhan_form').submit();
			},
			'انصراف': function() {
				$(this).dialog("close");
			}
		}
	});
	$('#delete_db_button').click(function(e) {
		if($('#table_select').val() === '') {

			// DB table not selected popup error
			$( '#dialog_select_db' ).dialog({
			  modal: true,
			  width: 400,
			  buttons: {
				باشه: function() {
				  $( this ).dialog( 'close' );
				}
			  }
			});

			// Reset .csv column count
			$('#return_csv_col_count').text('0');
			return;
		}
		else {
			$('#dialog-confirm').dialog('open');
		}
	});
});
