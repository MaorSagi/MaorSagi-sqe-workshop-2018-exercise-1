import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

export {parseCode};

let tableRecords;

const parseCode = (codeToParse) => {
    tableRecords = [];
    jsonToObj((esprima.parseScript(codeToParse,{loc: true}))['body']);
    return tableRecords;
};


const typeQuery = (obj,type) => (obj['type']==type);


function function_declaration_handler(obj) {
    tableRecords.push({line: obj['loc']['start']['line'], type: 'function declaration', name: obj['id']['name'], condition: '', value: ''});
    let i;
    for (i = 0; i < obj['params'].length; i++) {
        let param = obj['params'][i];
        tableRecords.push({line: param['loc']['start']['line'], type: 'variable declaration', name: param['name'], condition: '', value: ''});
    }
    jsonToObjSimple(obj['body']);
}

function expression_statement_handler(obj) {
    jsonToObjSimple(obj['expression']);
}

function variable_declaration_handler(obj) {
    let i;
    for (i = 0; i < obj['declarations'].length; i++) {
        let declarator = obj['declarations'][i];
        let v = '';
        if(obj['declarations'][i]['init']!=null) {
            jsonToObjSimple(obj['declarations'][i]['init']);
            v=escodegen.generate(obj['declarations'][i]['init'],null);
        }
        tableRecords.push({line: declarator['loc']['start']['line'], type: 'variable declaration', name: declarator['id']['name'], condition: '', value: v});
    }}

function if_statement_handler(obj) {
    tableRecords.push({line: obj['loc']['start']['line'], type: 'if statement', name: '', condition: escodegen.generate(obj['test'],null), value: ''});
    jsonToObjSimple(obj['test']);
    jsonToObjSimple(obj['consequent']);
    if(obj['alternate']== null) return;
    if(typeQuery(obj['alternate'],'IfStatement'))
        obj['alternate']['type'] = 'ElseIfStatement';
    jsonToObjSimple(obj['alternate']);

}
function elseif_statement_handler(obj) {
    tableRecords.push({line: obj['loc']['start']['line'], type: 'else if statement', name: '', condition: escodegen.generate(obj['test'],null), value: ''});
    jsonToObjSimple(obj['test']);
    jsonToObjSimple(obj['consequent']);
    if(obj['alternate']== null) return;
    if(typeQuery(obj['alternate'],'IfStatement'))
        obj['alternate']['type']='ElseIfStatement';
    jsonToObjSimple(obj['alternate']);

}


function while_statement_handler(obj) {
    tableRecords.push({line: obj['loc']['start']['line'], type: 'while statement', name: '', condition: escodegen.generate(obj['test'],null), value: ''});
    jsonToObjSimple(obj['test']);
    jsonToObjSimple(obj['body']);
}

function for_statement_handler(obj) {
    tableRecords.push({line: obj['loc']['start']['line'], type: 'for statement', name: '', condition: escodegen.generate(obj['test'],null), value: ''});
    jsonToObjSimple(obj['init']);
    jsonToObjSimple(obj['test']);
    jsonToObjSimple(obj['update']);
    jsonToObjSimple(obj['body']);
}

function binary_expression_handler(obj){
    tableRecords.push({line: obj['loc']['start']['line'], type: 'binary expression', name: '', condition: '', value: escodegen.generate(obj,null)});
    jsonToObjSimple(obj['left']);
    jsonToObjSimple(obj['right']);
}

function assignment_expression_handler(obj){
    tableRecords.push({line: obj['loc']['start']['line'], type: 'assignment expression', name: escodegen.generate(obj['left'],null), condition: '', value: escodegen.generate(obj['right'],null)});
    jsonToObjSimple(obj['left']);
    jsonToObjSimple(obj['right']);
}

function update_expression_handler(obj){
    tableRecords.push({line: obj['loc']['start']['line'], type: 'update expression', name: escodegen.generate(obj['argument'],null), condition: '', value: escodegen.generate(obj,null)});
    jsonToObjSimple(obj['argument']);
}

function member_expression_handler(obj){
    tableRecords.push({line: obj['loc']['start']['line'], type: 'member expression', name: '', condition: '', value: escodegen.generate(obj,null)});
    jsonToObjSimple(obj['object']);
    jsonToObjSimple(obj['property']);
}

function unary_expression_handler(obj){
    tableRecords.push({line: obj['loc']['start']['line'], type: 'unary expression', name: '', condition: '', value: escodegen.generate(obj,null)});
    jsonToObjSimple(obj['argument']);
}


function block_statement_handler(obj){
    jsonToObj(obj['body']);
}

function return_statement_handler(obj){
    tableRecords.push({line: obj['loc']['start']['line'], type: 'return statement', name: '', condition: '', value: escodegen.generate(obj['argument'],null)});
    jsonToObjSimple(obj['argument']);
}

const jsonToObj = (arr) => {
    let i;
    for (i=0 ; i<arr.length ; i++)
        jsonToObjSimple(arr[i]);};

const jsonToObjSimple = (obj) =>
    typeQuery(obj,'VariableDeclaration') ? variable_declaration_handler(obj) :typeQuery(obj,'UpdateExpression') ? update_expression_handler(obj) :
        typeQuery(obj,'MemberExpression') ? member_expression_handler(obj): jsonToObjFunc(obj);

const jsonToObjFunc = (obj) => typeQuery(obj,'FunctionDeclaration') ?  function_declaration_handler(obj) :
    typeQuery(obj,'BinaryExpression')? binary_expression_handler(obj) : typeQuery(obj,'UnaryExpression') ? unary_expression_handler(obj):
        typeQuery(obj,'AssignmentExpression')? assignment_expression_handler(obj) : jsonToObjLoop(obj);

const jsonToObjLoop = (obj) =>  typeQuery(obj,'WhileStatement') ? while_statement_handler(obj) :
    typeQuery(obj,'ForStatement') ? for_statement_handler(obj) : jsonToObjCondition(obj);

const jsonToObjCondition = (obj) => typeQuery(obj,'IfStatement') ? if_statement_handler(obj) :
    typeQuery(obj,'ElseIfStatement') ? elseif_statement_handler(obj) : jsonToObjSpecial(obj);


const jsonToObjSpecial = (obj) => typeQuery(obj,'ExpressionStatement') ? expression_statement_handler(obj) :
    typeQuery(obj,'ReturnStatement') ? return_statement_handler(obj) : typeQuery(obj,'BlockStatement') ? block_statement_handler(obj): '';
