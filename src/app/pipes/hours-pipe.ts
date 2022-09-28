import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'hours'
})
export class HoursPipe implements PipeTransform{
    transform(minutes: number) {
        const hours: number = Math.floor(minutes/60);
        const minutesLeft: number =  minutes % 60;
        return hours +  "h " + minutesLeft + "m"
    }
}