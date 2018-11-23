import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

const to_string=(obj)=>{
    let str ='{';
    str+= obj.line+' '+obj.type+' '+obj.name+' '+obj.condition+' '+obj.value;
    str +='}';
    return str;
}

const array_to_string=(arr)=>{
    let str='[';
    let i;
    for(i=0 ; i< arr.length ; i++){
        str+=to_string(arr[i]);
    }
    str+=']';
    return str;
};

describe('The javascript parser - 1', () => {
    it('Test 1:', () => {
        assert.equal(array_to_string(parseCode('')), array_to_string([]));});
    it('Test 2:', () => {
        assert.equal(array_to_string(parseCode('let a;\nlet b=1;\nb++;\nM[0]=b;')), array_to_string([
            {line: 1, type: 'variable declaration', name: 'a', condition: '', value: ''},
            {line: 2, type: 'variable declaration', name: 'b', condition: '', value: '1'},
            {line: 3, type: 'update expression', name: 'b', condition: '', value: 'b++'},
            {line: 4, type: 'assignment expression', name: 'M[0]', condition: '', value: 'b'},
            {line: 4, type: 'member expression', name: '', condition: '', value: 'M[0]'}

        ]));});
});



describe('The javascript parser - 2', () => {
    it('Test 3:', () => {
        assert.equal(array_to_string(parseCode('function test(x){\n    return -1;\n}')),array_to_string([
            {line: 1, type: 'function declaration', name: 'test', condition: '', value: ''},
            {line: 1, type: 'variable declaration', name: 'x', condition: '', value: ''},
            {line: 2, type: 'return statement', name: '', condition: '', value: '-1'},
            {line: 2, type: 'unary expression', name: '', condition: '', value: '-1'},

        ]));});
    it('Test 4:', () => {
        assert.equal(array_to_string(parseCode('3+1')),array_to_string([
            {line: 1, type: 'binary expression', name: '', condition: '', value: '3 + 1'}
        ]));});
    it('Test 5:', () => {
        assert.equal(array_to_string(parseCode('x=1;')),array_to_string([
            {line: 1, type: 'assignment expression', name: 'x', condition: '', value: '1'}
        ]));});
});



describe('The javascript parser - 3', () => {
    it('Test 6:', () => {
        assert.equal(array_to_string(parseCode('while(x<1){\nx++;\n}')),array_to_string([
            {line: 1, type: 'while statement', name: '', condition: 'x < 1', value: ''},
            {line: 1, type: 'binary expression', name: '', condition: '', value: 'x < 1'},
            {line: 2, type: 'update expression', name: 'x', condition: '', value: 'x++'},
        ]));});
    it('Test 7:', () => {
        assert.equal(array_to_string(parseCode('let i;\nfor(i=0;i<10;i++){\nx=x+1;\n}')),array_to_string([
            {line: 1, type: 'variable declaration', name: 'i', condition: '', value: ''},
            {line: 2, type: 'for statement', name: '', condition: 'i < 10', value: ''},
            {line: 2, type: 'assignment expression', name: 'i', condition: '', value: '0'},
            {line: 2, type: 'binary expression', name: '', condition: '', value: 'i < 10'},
            {line: 2, type: 'update expression', name: 'i', condition: '', value: 'i++'},
            {line: 3, type: 'assignment expression', name: 'x', condition: '', value: 'x + 1'},
            {line: 3, type: 'binary expression', name: '', condition: '', value: 'x + 1'}
        ]));
    });
});


describe('The javascript parser - 4', () => {
    it('Test 8:', () => {
        assert.equal(array_to_string(parseCode('if(x<0) \nx++;\nif(x>1)\nx--;\nelse x=0;\n')),array_to_string([
            {line: 1, type: 'if statement', name: '', condition: 'x < 0', value: ''},
            {line: 1, type: 'binary expression', name: '', condition: '', value: 'x < 0'},
            {line: 2, type: 'update expression', name: 'x', condition: '', value: 'x++'},
            {line: 3, type: 'if statement', name: '', condition: 'x > 1', value: ''},
            {line: 3, type: 'binary expression', name: '', condition: '', value: 'x > 1'},
            {line: 4, type: 'update expression', name: 'x', condition: '', value: 'x--'},
            {line: 5, type: 'assignment expression', name: 'x', condition: '', value: '0'}
        ]));
    });


});

describe('The javascript parser - 5', () => {
    it('Test 9:', () => {
        assert.equal(array_to_string(parseCode('if(x<0) \nx++;\nelse if(x>1)\nx--;\nelse x=0;\n')),array_to_string([
            {line: 1, type: 'if statement', name: '', condition: 'x < 0', value: ''},
            {line: 1, type: 'binary expression', name: '', condition: '', value: 'x < 0'},
            {line: 2, type: 'update expression', name: 'x', condition: '', value: 'x++'},
            {line: 3, type: 'else if statement', name: '', condition: 'x > 1', value: ''},
            {line: 3, type: 'binary expression', name: '', condition: '', value: 'x > 1'},
            {line: 4, type: 'update expression', name: 'x', condition: '', value: 'x--'},
            {line: 5, type: 'assignment expression', name: 'x', condition: '', value: '0'}
        ]));});
});


describe('The javascript parser - 6', () => {
    it('Test 10:', () => {
        assert.equal(array_to_string(parseCode('if(x<0) \nx++;\nelse if(x>1)\nx--;\nelse if (x=0)\nx=-1;')),array_to_string([
            {line: 1, type: 'if statement', name: '', condition: 'x < 0', value: ''},
            {line: 1, type: 'binary expression', name: '', condition: '', value: 'x < 0'},
            {line: 2, type: 'update expression', name: 'x', condition: '', value: 'x++'},
            {line: 3, type: 'else if statement', name: '', condition: 'x > 1', value: ''},
            {line: 3, type: 'binary expression', name: '', condition: '', value: 'x > 1'},
            {line: 4, type: 'update expression', name: 'x', condition: '', value: 'x--'},
            {line: 5, type: 'else if statement', name: '', condition: 'x = 0', value: ''},
            {line: 5, type: 'assignment expression', name: 'x', condition: '', value: '0'},
            {line: 6, type: 'assignment expression', name: 'x', condition: '', value: '-1'},
            {line: 6, type: 'unary expression', name: '', condition: '', value: '-1'}
        ]));
    });
});

/*describe('The javascript parser3', () => {
    it('Test 11:', () => {
        assert.equal(null,null);
    });
});*/
