(function () {
    // 普通文本框
    function editInput(e, callback) {
        var target = e.target, value = target.innerText;
        var width = '80px';
        target.innerHTML = "<input type='text' id='_editable' style='width:"+width+";background:transparent;font-size:13px;color:red;text-align:left'>";
        var input = document.getElementById('_editable');
        input.value = value;
        input.focus();
        var len = input.value.length;
        if (document.selection) {
            var sel = input.createTextRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        } else if (typeof input.selectionStart == 'number' && typeof input.selectionEnd == 'number') {
            input.selectionStart = input.selectionEnd = len;
        }

        var action = function () {
            if (value != this.value && this.value != '') {
                target.innerHTML = this.value;
                callback(this.value)
            } else {
                target.innerHTML = value;
            }
            input.removeEventListener("blur", action, false);
        };
        input.addEventListener("blur", action, false);
    }

    // 下拉框
    function editSelect(e, options, callback) {
        var target = e.target, value = target.innerText;
        // target.innerHTML = "<input type='text' value='" + value + "' id='_editable' style='width:100%;box-sizing:border-box;background:transparent;font-size:13px;color:red;text-align:center'>";
        var selectHTML = '';
        selectHTML += "<select id='_editable'>";
        for (var i in options) {
            if (value == options[i]) {
                selectHTML += "<option value='" + options[i] + "' selected='selected'>" + options[i] + "</option>";
            } else {
                selectHTML += "<option value='" + options[i] + "'>" + options[i] + "</option>";
            }
        }
        selectHTML += "</select>";

        target.innerHTML = selectHTML;
        var input = document.getElementById('_editable');
        input.focus();
        var len = input.value.length;
        if (document.selection) {
            var sel = input.createTextRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        } else if (typeof input.selectionStart == 'number' && typeof input.selectionEnd == 'number') {
            input.selectionStart = input.selectionEnd = len;
        }

        var action = function () {
            if (value != this.value && this.value != '') {
                target.innerHTML = this.value;
                callback(this.value)
            } else {
                target.innerHTML = value;
            }
            input.removeEventListener("blur", action, false);
        };
        input.addEventListener("blur", action, false);
    }


    const Models = {
        editInput: editInput,
        editSelect: editSelect
    };

    module.exports = Models;

})();
