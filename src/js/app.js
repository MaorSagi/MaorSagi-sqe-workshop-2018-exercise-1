
import $ from 'jquery';
import {parseCode} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let tableRecords = parseCode(codeToParse);
        document.getElementById('Table').innerHTML = array_to_html(tableRecords);
    });
});



const array_to_html = (arr) => {
    let str = '<table>'+'<tr><td>' + 'Line' + '</td>' +
        '<td>' + 'Type' + '</td><td>' + 'Name' + '</td>' +
        '<td>' + 'Condition' + '</td>' + '<td>' + 'Value' + '</td></tr>';
    let i;
    for(i=0; i<arr.length ; i++)
        str += '<tr><td>' + arr[i]['line'] + '</td>' +
            '<td>' + arr[i]['type'] + '</td><td>' + arr[i]['name'] + '</td>' +
            '<td>' + arr[i]['condition'] + '</td>' + '<td>' + arr[i]['value'] + '</td></tr>';
    str += '</table>';
    return str;
};