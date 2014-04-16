var window;

function DateInput(input) {
    this.state = 0;
    input.value = this.parts.join('');

    this.input = input;

    this.register_handlers();
}

DateInput.prototype.separator = '/';

DateInput.prototype.parts = [
    {
        length: 4,
        fill: 'yyyy',
        name: 'year',
        toString: function() {
            return this.fill;
        }
    },
    '/',
    {
        length: 2,
        fill: 'mm',
        name: 'month',
        toString: function() {
            return this.fill;
        }
    },
    '/',
    {
        length: 2,
        fill: 'dd',
        name: 'day',
        toString: function() {
            return this.fill;
        }
    }
];

DateInput.prototype.selectField = function() {
    if (this.state < 0 || this.state >= this.parts.length) {
        // State out of bounds.
    }

    var start = 0;
    for (var i = 0; i < this.state; i++) {
        start += this.parts[i].length;
    }

    console.log(start);
    console.log();

    console.log(this.state);
    console.log(this.parts);

    var end = start + this.parts[this.state].length;
    console.log(end);

    this.input.setSelectionRange(start, end);

};

DateInput.prototype._get_current_field = function() {
    var string = this.input.value.substr(this.input.selectionStart, this.input.selectionEnd);

    for (var i; i < this.parts.length; i++) {

    }

    return;
};

DateInput.prototype.nextField = function() {
    console.log('NEXT!');
    if (this.state < (this.parts.length - 1)) {
        this.state++;
    }

    if (typeof this.parts[this.state] === 'string') {
        this.state++;
    }

    this.selectField();
};

DateInput.prototype.prevField = function() {
    if (this.state > 0) {
        this.state--;
    }

    if (typeof this.parts[this.state] === 'string') {
        this.state--;
    }

    this.selectField();
};

DateInput.prototype.register_handlers = function() {
    var instance = this;

    this.input.addEventListener('keydown', function(e) {
        this.state = 0;

        console.log('Keydown', e);
        var value;
        var output;

        console.log(e.keyCode);
        console.log(String.fromCharCode(e.which));

        if (e.keyCode == 37) {
            // Left
            instance.prevField();

            //this.setSelectionRange(0, 2);
        } else if (e.keyCode == 39) {
            // Right
            instance.nextField();

            //this.setSelectionRange(6, 10);
        }

        /* Day */
        if (this.selectionStart === 3) {
            instance.handleDay(e);
        }

        /* Month */
        if (this.selectionStart === 0) {
            instance.handleMonth(e);
        }

        /* Year */
        if (this.selectionStart === 6) {
            instance.handleYear(e);
        }

        e.preventDefault();
        e.stopImmediatePropagation();

    });

    this.input.addEventListener('focus', function(e) {
        console.log('Focus', e);
        instance.state = 0;
        instance.selectField();
        e.preventDefault();
        e.stopImmediatePropagation();
    });

    this.input.addEventListener('mousedown', function(e) {
        this.focus();
        e.preventDefault();
        e.stopImmediatePropagation();
    });

};

DateInput.prototype.days_in_months = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
    mm: 31
};

DateInput.prototype.handleMonth = function(e) {
    if (e.keyCode == 38) {
        // Up
        value++;
        if (value <= 12 && value >= 1) {
            output = value < 10 ? '0' + value.toString() : value.toString();

            this.setRangeText(output, 0, 2);
        }
    } else if (e.keyCode == 40) {
        // Down
        value--;
        if (value <= 12 && value >= 1) {
            output = value < 10 ? '0' + value.toString() : value.toString();

            this.setRangeText(output, 0, 2);
        }
    }
};

DateInput.prototype.handleDay = function(e) {
    if (e.keyCode == 38) {
        // Up
        value++;
        if (value <= 31 && value >= 1) {
            output = value < 10 ? '0' + value.toString() : value.toString();

            this.setRangeText(output, 3, 5);
        }
    } else if (e.keyCode == 40) {
        value--;
        if (value <= 31 && value >= 1) {
            output = value < 10 ? '0' + value.toString() : value.toString();

            this.setRangeText(output, 3, 5);
        }
    }
};

DateInput.prototype.handleYear = function(e) {
    if (e.keyCode == 38) {
        // Up
    } else if (e.keyCode == 40) {
        // Down
    }
};

DateInput.prototype.is_valid_day = function(day, month, year) {
    var leapday;

    int_day = parseInt(day);

    // If the day is less than 1, return the smallest allowed value.
    if (int_day < 1) {
        return '01';
    }

    // If it is February, AND we haven't set a year, or it is a leap year
    if (month === '02' && (year == 'yyyy' || is_leap_year(year))) {
        leapday = 1;
    } else {
        leapday = 0;
    }

    // If the day is greater than it is allowed to be, return the largest
    // allowed value.
    if (int_day > (days_in_months[month] + leapday)) {
        return (days_in_months[month] + leapday).toString();
    }

    if (int_day < 10) {
        return '0' + int_day.toString();
    } else {
        return int_day.toString();
    }

};

DateInput.prototype.is_leap_year = function(year) {
    if (year % 4 !== 0) {
        return false;
    } else if (year % 100 !== 0) {
        return true;
    } else if (year % 400 === 0) {
        return true;
    } else {
        return false;
    }
};

/*
input.onclick = function(e) {
    console.log('Click', e);
    e.preventDefault();
    e.stopImmediatePropagation();
};

input.onblur = function(e) {
    console.log('Blur', e);
    e.preventDefault();
};

input.onkeypress = function(e) {
    console.log('KeyPress', e);
    var c = e.which || e.keyCode;

    e.preventDefault();

    var selected = this.value.substr(this.selectionStart, this.selectionEnd);

    if (this.selectionStart === 0) {
        // Day logic
        if (selected == 'mm') {
            if (c == 48 || c == 49) {
                this.setRangeText('0' + String.fromCharCode(c), 0, 2);
                this.setSelectionRange(0, 2);
            } else {
                this.setRangeText('0' + String.fromCharCode(c), 0, 2);
                this.setSelectionRange(3, 5);
                e.preventDefault();
            }
        } else if (selected == '00') {
            if (c == 48 || c == 49) {
                this.setRangeText('01', 0, 2);
                this.setSelectionRange(3, 5);
            }
        } else if (selected == '01') {
            this.setRangeText(
                '1' + String.fromCharCode(
                    Math.min(50, Math.max(48, c))
                )
            );
            this.setSelectionRange(3, 5);
        }

    } else if (this.selectionStart === 3) {
        // Month logic
        if (selected == 'mm') {
        } else if (selected[0] !== 'm') {
            if (c == 48 || c ==49) {
            }
        }
    } else if (this.selectionStart === 6) {
        // Year logic
    }

};
*/

/*
input.onselect = function(e) {
    console.log('Select', e, this);
    e.preventDefault();
    e.stopImmediatePropagation();
};

input.ondragstart = function(e) {
    console.log('DragStart', e, this);
    e.preventDefault();
    e.stopImmediatePropagation();
};

input.onmousedown = function(e) {
    console.log('MouseDown', e, this);
    this.focus();
    e.preventDefault();
    e.stopImmediatePropagation();
};
*/

window.addEventListener("DOMContentLoaded", function() {
    var input = document.getElementById('text');
    dt = new DateInput(input);
}, true);
