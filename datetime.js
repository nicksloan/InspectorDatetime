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

    this.fieldValue = this.input.value.slice(start, end);

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
        // Tab
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
            } else {
                this.inputChoice(e);
                this.selectField();
                return;
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

MaskedInput.prototype.inputChoice = function(e) {
    var part = this.parts[this.state];
    var options = [];
    var index;

    var teststring = (
        this.data[part.name] !== null ?
        this.fieldValue.toLowerCase() :
        ''
    ) + String.fromCharCode(e.keyCode).toLowerCase();

    if (this.data[part.name] === null) {
        for (var i = 0; i < part.choice.length; i++) {
            if (part.choice[i].toLowerCase().indexOf(teststring) === 0) {
                index = i;
                options.push(part.choice[i]);
            }
        }

        console.log(options);

        if (options.length < 1) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.data[part.name] = null;
            this.updateView();
            // Don't accept the input.
            return;
        } else if (options.length === 1) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.data[part.name] = index;
            this.updateView();
            // Select the appropriate item.
            return;
        } else {
            // Accept the input, don't select an item.
            return;
        }
    }

    e.preventDefault();
    e.stopImmediatePropagation();
};

MaskedInput.prototype.inputSequence = function(e) {
    var part = this.parts[this.state];

    var options = [];
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
