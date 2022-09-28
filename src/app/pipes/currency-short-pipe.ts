import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'currencyShort'
})
export class CurrencyShortPipe implements PipeTransform {
    transform(n: number) {
        if (n > 1000000000000) {
            const trillions = Math.round((n/1000000000000) * 10) / 10;
            return "$" + trillions + "T";
        } else if (n > 1000000000) {
            const billions = Math.round((n / 1000000000) * 10) / 10;
            return "$" + billions + "B";
        } else if (n > 1000000) {
            const millions = Math.round((n / 1000000) * 10) / 10;
            return "$" + millions + "M";
        } else {
            return n;
        }
    }
}