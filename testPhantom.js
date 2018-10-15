const phantom=require('phantom');
const takeShot=async(url,filename)=>{
const instance=await phantom.create()
const page=await instance.createPage()
const status=await page.open(url);
console.log(status);
await page.render(filename);
await instance.exit();
}

takeShot('population.html','population.png');
takeShot('lineChart.html','lineChart.png')