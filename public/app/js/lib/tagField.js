
ulib.addCustomField('tagField', function(field) {

	var html = '<div class="form-group col-xs-{{field.groupSize}}">';
		html += '<label class="control-label col-xs-{{field.labelSize}}" for="{{field.id}}">{{field.label}}</label>';
		html += '<div class="col-xs-{{field.fieldSize}} {{field.type}}-control {{field.class}}">';							
		html += '<tags-input ' +
				' class="form-control" ' +
				' id="{{field.id}}" ' +
				' name="{{field.name}}" ' +
				' ng-model="data[\'' + field.id + '\']" />';
		html += '</div>'; // controls
		html += '</div>'; // control-group

	return html;
});