var window;

function MaskedInput(input, parts) {
    this.input = input;
    this.parts = parts;

    this.data = {};

    for (var i = 0; i < this.parts.length; i++) {
        if (typeof this.parts[i] === 'string') {
            continue;
        }

        this.data[this.parts[i].name] = null;
    }

    this.updateView();
    this._register_handlers();
}

MaskedInput.prototype.state = 0;

MaskedInput.prototype.selectField = function(e) {
    var instance = this;

    if (this.state < 0 || this.state >= this.parts.length) {
        console.log('Out of bounds.');
        this.state = 0;
    }

    var start = 0;
    for (var i = 0; i < this.state; i++) {
        start += this.parts[i].length;
    }

    var end = start + this.parts[this.state].length;

    setTimeout((function() {
        instance.input.setSelectionRange(start, end);
    }), 0);

};

MaskedInput.prototype.handleKeys = function(e) {
    if (e.keyCode == 37) {
        // Left
        this.prevField();
    } else if (e.keyCode == 39) {
        // Right
        this.nextField();
    } else if (e.keyCode == 9) {
        if (e.shiftKey) {
            if (!this.prevField()) {
                return;
            }
        } else {
            if (!this.nextField()) {
                return;
            }
        }
    } else {
        if ('sequence' in this.parts[this.state]) {
            if (e.keyCode == 38) {
                this.nextSequence();
            } else if (e.keyCode == 40) {
                this.prevSequence();
            }
        } else if ('choice' in this.parts[this.state]) {
            if (e.keyCode == 38) {
                this.nextChoice();
            } else if (e.keyCode == 40) {
                this.prevChoice();
            }
        } else {
            //this.keypress(e);
        }
        this.updateView();
    }

    e.stopImmediatePropagation();
    e.preventDefault();
    this.selectField();
};

MaskedInput.prototype.nextSequence = function(e) {
    var part = this.parts[this.state];

    if (this.data[part.name] === null) {
        this.data[part.name] = part.sequence.min;
        return;
    }

    if (this.data[part.name] < (part.sequence.min + part.sequence.range - part.sequence.step)) {
        this.data[part.name] += part.sequence.step;
    } else {
        this.data[part.name] = part.sequence.min;
    }
};

MaskedInput.prototype.prevSequence = function(e) {
    var part = this.parts[this.state];

    if (this.data[part.name] === null) {
        this.data[part.name] = part.sequence.min + part.sequence.range - part.sequence.step;
        return;
    }

    if (this.data[part.name] >= (part.sequence.min + part.sequence.step)) {
        this.data[part.name] -= part.sequence.step;
    } else {
        this.data[part.name] = part.sequence.min + part.sequence.range - part.sequence.step;
    }
};

MaskedInput.prototype.nextChoice = function(e) {
    var part = this.parts[this.state];

    if (this.data[part.name] === null) {
        this.data[part.name] = 0;
        return;
    }

    if (this.data[part.name] < part.choice.length - 1) {
        this.data[part.name]++;
    } else {
        this.data[part.name] = 0;
    }
};

MaskedInput.prototype.prevChoice = function(e) {
    var part = this.parts[this.state];

    if (this.data[part.name] === null) {
        this.data[part.name] = part.choice.length - 1;
        return;
    }

    if (this.data[part.name] > 0) {
        this.data[part.name]--;
    } else {
        this.data[part.name] = part.choice.length - 1;
    }
};

MaskedInput.prototype.updateView = function(e) {
    var output = '';

    for (var i = 0; i < this.parts.length; i++) {
        if (typeof this.parts[i] === 'string') {
            output += this.parts[i];
        } else {
            if (this.data[this.parts[i].name] === null) {
                output += this.parts[i].fill;
            } else {
                if ('sequence' in this.parts[i]) {
                    output += this.padNumber(
                        this.data[this.parts[i].name],
                        this.parts[i].length,
                        '0'
                    );
                } else if ('choice' in this.parts[i]) {
                    output += this.parts[i].choice[this.data[this.parts[i].name]];
                }
            }
        }
    }

    this.input.value = output;
};

MaskedInput.prototype.padNumber = function(n, pad_l, pad_c) {
    var padding = Array(pad_l + 1).join(pad_c);
    return (n < 0 ? '-' : '') + (padding + n.toString().replace('-', '')).slice(0 - (pad_l));
};

MaskedInput.prototype._get_current_field = function() {
    var string = this.input.value.substr(this.input.selectionStart, this.input.selectionEnd);

    for (var i; i < this.parts.length; i++) {

    }

    return;
};

MaskedInput.prototype.nextField = function() {
    if (this.state >= (this.parts.length - 1)) {
        return false;
    }

    this.state++;

    if (typeof this.parts[this.state] === 'string') {
        this.state++;
    }

    this.selectField();
    return true;
};

MaskedInput.prototype.prevField = function() {
    if (this.state <= 0) {
        return false;
    }

    this.state--;

    if (typeof this.parts[this.state] === 'string') {
        this.state--;
    }

    this.selectField();
    return true;
};

MaskedInput.prototype.resetState = function() {
    this.state = 0;
};

MaskedInput.prototype._register_handlers = function() {
    var instance = this;

    this.input.addEventListener('focus', function(e) {
        instance.resetState();
        instance.selectField();
    });

    this.input.addEventListener('click', function(e) {
        instance.selectField();
    });

    this.input.addEventListener('keydown', function(e) {
        instance.handleKeys(e);
    });
};

/*
MaskedInput.prototype.days_in_months = {
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

MaskedInput.prototype.handleMonth = function(e) {
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

MaskedInput.prototype.handleDay = function(e) {
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

MaskedInput.prototype.handleYear = function(e) {
    if (e.keyCode == 38) {
        // Up
    } else if (e.keyCode == 40) {
        // Down
    }
};

MaskedInput.prototype.is_valid_day = function(day, month, year) {
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

MaskedInput.prototype.is_leap_year = function(year) {
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
*/

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
    var input2 = document.getElementById('time');
    mi2 = new MaskedInput(input2, [
        {
            length: 2,
            fill: '--',
            name: 'hour',
            sequence: {
                min: 1,
                range: 12,
                step: 1,
                precision: 0
            },
            toString: function() {
                return this.fill;
            }
        },
        ':',
        {
            length: 2,
            fill: '--',
            name: 'minute',
            sequence: {
                min: 0,
                range: 60,
                step: 1,
                precision: 0
            },
            toString: function() {
                return this.fill;
            }
        },
        ' ',
        {
            length: 2,
            fill: '--',
            name: 'meridian',
            choice: [
                'AM',
                'PM'
            ],
            toString: function() {
                return this.fill;
            }
        },
    ]);

    var input = document.getElementById('date');
    mi = new MaskedInput(input, [
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
        },
        '/',
        {
            length: 4,
            fill: 'yyyy',
            name: 'year',
            toString: function() {
                return this.fill;
            }
        },
    ]);

}, true);
