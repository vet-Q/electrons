const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const ExcelJS = require('exceljs');


const arr = ['african swine fever','foot and mouth disease','lumpy skin disease'];

let rate = 0;

async function getNews(arr) {
    let titles = [];
    let links =[];
    let pubdates= [];
    const ProgressCalc = (arr)=> {
        rate += 1/arr.length
    }
    for (a of arr){
        URL = `https://medisys.newsbrief.eu/rss/?type=search&mode=advanced&atLeast=${a}`
        let {title, link , pubDates} = await getHtml(URL);
        titles = titles.concat(title);
        links = links.concat(link);
        pubdates = pubdates.concat(pubDates);
    }
    const results = {
        'title':titles,
        'link':links,
        'pubDates':pubdates
    }
    
    return results
}

async function getHtml(URL) {
    const x = await axios.get(URL);
    let result = {};
    let titles = [];
    let links = [];
    let pubDates = [];
    let $ = cheerio.load(x.data,{xmlMode:true});
    $('item').each(function(){
        let title, list, pubDate;
        // console.log(this)
        title = $(this).children('title').text();
        list = $(this).children('link').text();
        pubDate = $(this).children('pubDate').text();
        titles.push(title);
        links.push(list);
        pubDates.push(pubDate);
    })
    result.title = titles;
    result.link = links;
    result.pubDates = pubDates;
    return result
}

const writefiles = async(filename)=>{
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet();

    const {title,link,pubDates} = await getNews(arr);

    const serialNum = [];    
    for (i=1; i<title.length-1; i++){
        serialNum.push(i);
    };

    const rawData = [{header: '연번', data: serialNum},
                     {header: 'title', data: title},
                     {header: 'link', data:link},
                     {header: 'date', data:pubDates},];

    rawData.forEach((data, index) => {
        worksheet.getColumn(index + 1).values = [data.header, ...data.data];
    });
    await workbook.xlsx.writeFile(`./${filename}.xlsx`)
}

// writefiles('news data')

const hello = ()=>{
    console.log('hello')
}

module.exports = {writefiles, rate}
