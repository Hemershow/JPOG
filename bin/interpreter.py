file = open("code.jpog", "r")
jpog = file.read()
commands = []
f = open("program.txt", "w")
isIf = False

for command in jpog.split(";"):
    if command == "":
        continue

    if command[0] == "\n":
        command = command[1:]

    commands.append(command)

keys = ["write", "para", "sepa", "var"]
variables = []

def getInterpretedCondition(condition):
    conditions = [">", ">=", "<", "<=", "=", "!", "e" "o"]
    conditionIndex = conditions.index(condition)
    return 300 + conditionIndex

def getInterpretedVariable(variableStr):
    interpretation = []
    if (any(c for c in variableStr if "+" in c) and '"' not in variables):
        variableStr = variableStr.replace(" ", "")
        interpretation.append(407)
        for e in variableStr:
            if (e == "+"):
                if (len(interpretation) > 3): 
                    interpretation.append(501)
                interpretation.append(500)
            else:
                interpretation.append(402)
                interpretation.append(int(e))
                    
        return interpretation    
    
    if (variableStr.isnumeric()):
        interpretation.append(402)
        interpretation.append(int(variableStr))
    elif('"' in variableStr):
        interpretation.append(403)
        for c in variableStr.replace('"', ""):
            interpretation.append(ord(c))
        interpretation.append(404)
    else:
        interpretation.append(405)
        interpretation.append(int(variables.index(variableStr)))
    
    return interpretation

def searchCommand(command):
    for i in range(len(keys)):
        size = len(keys[i])
        if (command[:size] == keys[i]):
            innerCommands = []
            
            parameters = command[size:].replace("(", "").replace(")", "")
            global isIf
            match command[:size]:
                case "write":                    
                    innerCommands.append(128)
                    innerCommands.extend(getInterpretedVariable(parameters))
                    innerCommands.append(129)
                    if (isIf):
                        innerCommands.append(134)
                        isIf = False
                    return innerCommands
                
                case "para":
                    innerCommands.append(130)
                    innerCommands.append(131)
                    if (isIf):
                        innerCommands.append(134)
                        isIf = False
                    return innerCommands
                
                case "sepa":
                    innerCommands.append(132)
                    components = parameters.split(" ")
                    components.remove("")
                    innerCommands.extend(getInterpretedVariable(components[0]))
                    innerCommands.append(getInterpretedCondition(components[1]))
                    innerCommands.extend(getInterpretedVariable(components[2]))
                    
                    innerCommands.append(133)
                    isIf = True
                    return innerCommands
                case "var":
                    innerCommands.append(400)
                    components = parameters.split()
                    innerCommands.extend(getInterpretedVariable(components[1]))
                    variables.append(str(components[0]))
                    innerCommands.extend(str(variables.index(components[0])))
                    if (isIf):
                        innerCommands.append(134)
                        isIf = False
                    return innerCommands
            
    return -1

f = open("program.txt", "a")

for c in commands:
    
    if (c[0] == "\n"):
        c = c[1:]
        
    result = searchCommand(c)
    
    for o in result:
        f.write(str(o) + ' ')
        
f.close()