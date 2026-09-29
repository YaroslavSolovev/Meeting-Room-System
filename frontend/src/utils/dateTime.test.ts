import {
 describe,
 expect,
 it
} from "vitest";


import {
 getDateLimits,
 getAvailableDurations
}
from "./dateTime";



describe(
"dateTime utils",
()=>{


it(
"allows booking up to 30 days ahead",
()=>{


const result =
getDateLimits(
"Europe/Moscow"
);



const min =
new Date(
result.minDate
);


const max =
new Date(
result.maxDate
);



const diff =
(max.getTime()-min.getTime())
/
(1000*60*60*24);



expect(diff)
.toBe(30);


});



it(
"returns durations by 15 minutes step",
()=>{


const result =
getAvailableDurations(
"10:00"
);



expect(result)
.toContain(15);


expect(result)
.toContain(30);


expect(result)
.toContain(60);



result.forEach(
duration=>{

 expect(
 duration % 15
 )
 .toBe(0);


});



});


});