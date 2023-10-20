// ler arquivo txt
// extrair comandos (lista do txt)
// criar lista de memoria

// baseado nos commandos executar coisisinhas e modificar lista de memoria

var commands = []
var memory = {}

function setVariable(index) {
    value = ""
    switch (commands[index + 1]) {
        case "403":
            i = 2
            while(commands[index + i] != "404") {
                String.fromCharCode(commands[index + i])
            }
            i++
            break;
    
        default:
            value = commands[index + 2]
            break;
    }
    var variable = {"type": dicionario[commands[index + 1]],"value": value,} 
    memory[commands[index + 3]] = variable
    return index + 3;
}

function getVariable(id) {
    return memory[id]
}

function types(i) {
    switch (commands[i]) {
        case "402":
            return [commands[i + 1], i + 1]
    
        default:
            break;
    }
    return [null, i]
}

function calcule(i) {
    var calc = ""
    while(commands[i] != "408") {
        switch (commands[i]) {case "500":
                calc += "+"
        
            default:
                var type = types(i)
                calc += type[0] != null ? type[0] : "" 
                i = type[1]
                break;
        }
        i++
    }
    var result = eval(calc).toString();
    return [result, i + 1];
}

function executar(index) {
    switch (commands[index]) {
        case "405":
            var value = getVariable(commands[index + 1])
            var variable = value ? value["value"] : null

            return [variable, index + 1]

        case "400":
            return setVariable(index)

        case "128":
            var i = index;
            while(commands[i] != "129") {
                if(commands[i] == "405") {
                    var result = executar(i)
                    process.stdout.write(result[0] != null ? result[0] : '')
                    i = result[1]
                    continue
                }
                if(commands[i] == "407") {
                    var calculo = executar(i)
                    process.stdout.write(calculo[0])
                    i = calculo[1]
                    continue
                }
                process.stdout.write(String.fromCharCode(commands[i]))
                i++
            }
            process.stdout.write("\n")
            return i;
    
        case "407":
            return calcule(index);

        case "132":
            var i = index + 1;
            var condicao = ""
            while(commands[i] != "133") {
                switch (commands[i]) {
                    case "402":
                            condicao += commands[i + 1]
                            i++
                        break;

                    case "304":
                        condicao += "=="
                    break;
                
                    default:
                        var result = executar(i)
                        if(result[0] == null)
                            condicao += dicionario[commands[i]]
                        else {
                            condicao += result[0]
                            i = result[1]
                        }
                        break;
                }
                i++
            }

            if(eval(condicao)) {
                while(commands[i] != "134") {
                    executar(i)
                    i++
                }
            } else {
                while(commands[i] != "134")
                    i++
            }
            return i;

        default:
            return [null, i]
    }
}


const fs = require('fs');
var file
try {
    file = fs.readFileSync("bin/dicionario.txt", "utf-8");
} catch (error) {
    console.error(error)
    return
}

var dicionario = {}
function commandSepare(value) {
    var ingual = false
    var num = ""
    var command = ""
    for(let i = 0; i < value.length; i++) {
        if(value[i] == "=") {
            ingual = true
            continue
        }
        if(ingual) {
            command += value[i]
            continue
        }
        num += value[i]
    }
    dicionario[num] = command
}

var value = ""
var command = 0;
for(let i = 0; i < file.length; i++) {
    if(file[i] == "\r") {
        continue
    }
    if(file[i] == "\n") {
        command += 1;
        commandSepare(value)
        value = ""
        continue
    }
    value += file[i]
}

var program
try {
    program = fs.readFileSync("bin/program.txt", "utf-8");
} catch (error) {
    console.error(error)
    return
}

value = ""
for(let i = 0; i < program.length; i++) {
    if(program[i] == " ") {
        commands.push(value)
        value = ""
        continue
    }

    value += program[i]
}
commands.push(value)

var index = 0
while(index < commands.length - 1) {
    index = executar(index);
    index++
}
console.log(memory)