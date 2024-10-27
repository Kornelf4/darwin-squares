function and(...args) {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] != 1) {
            return 0;
        }
    }
    return 1;
}
class BrainNode {
    constructor(inputsFrom, outputsTo, type, task, name) {
        this.value = 0;
        this.name = name;
        this.inputsFrom = inputsFrom;
        this.outputsTo = outputsTo;
        this.type = type; //operation, function, fromCellInputter, toCellOutputter
        this.exe = task;
        this.update = () => {
            let exe = "";
            if (this.type == "operation") {
                for (let i = 0; i < this.inputsFrom.length; i++) {
                    if (this.inputsFrom.length == i + 1) {
                        exe += this.inputsFrom[i].value;
                    } else {
                        exe += this.inputsFrom[i].value + this.exe;
                    }
                }
                let exeFunc = new Function("exe", "return " + exe);
                if(exeFunc(exe) < 0) {
                    this.value = 0;
                } else if(exeFunc(exe) > 1) {
                    this.value = 1;
                } else {
                    this.value = exeFunc(exe);
                }
            }
            if (this.type == "function") {
                exe = this.exe + "(";
                for (let i = 0; i < this.inputsFrom.length; i++) {
                    if (this.inputsFrom.length == i + 1) {
                        exe += this.inputsFrom[i].value + ")";
                    } else {
                        exe += this.inputsFrom[i].value + ",";
                    }
                }
                let exeFunc = new Function("exe", "return " + exe)
                if(exeFunc(exe) < 0) {
                    this.value = 0;
                } else if(exeFunc(exe) > 1) {
                    this.value = 1;
                } else {
                    this.value = exeFunc(exe);
                }
            }
            if (this.type == "fromCellInputter") {
                this.value = this.inputsFrom.value;
                for (let i = 0; i < this.outputsTo.length; i++) {
                    if(this.outputsTo[i] === undefined) continue;
                    this.outputsTo[i].inputsFrom = this;
                }
            }
            if (this.type == "toCellOutputter") {
                this.value = this.inputsFrom.value;
                this.outputsTo.activationLevel = this.value;
            }
        }
    }
}
function testPairing(brain) {
    let used = [];
    for(let i = 0; i < brain.length;i++) {
        if(brain[i].type == "fromCellInputter") {
            for(let i2 = 0; i2 < brain.length; i2++) {
                if(i == i2) continue;
                if(brain[i2].type == "toCellOutputter" && !used.includes(brain[i2])) {
                    brain[i].outputsTo.unshift(brain[i2]);
                    used.unshift(brain[i2]);
                }
            }
        }
    }
}