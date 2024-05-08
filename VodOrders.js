const monthMap = {
    "JAN": 1, "FEB": 2, "MAR": 3, "APR": 4, "MAY": 5, "JUN": 6,
    "JUL": 7, "AUG": 8, "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12
};

class VodOrders {
    constructor(vodRecords) {
        this.vodRecords = vodRecords;
    }

    createTotalCustomerUsage() {
        const usageSummary = new Map();
        const discountSummary = new Map();

        for (const record of this.vodRecords) {
            const [customerId, orderDate, genre, title, price] = record.split(',');
            let orderDateSplit = orderDate.split('-');
            let month;
            if (!isNaN(orderDateSplit[1])) {
                month = parseInt(orderDateSplit[1]);
            } else {
                month = monthMap[orderDateSplit[1].toUpperCase()];
            }
            const monthYear = `${month}-${orderDateSplit[0]}`;
            const totalCharges = parseFloat(price);

            if (!usageSummary.has(customerId)) {
                usageSummary.set(customerId, new Map());
            }

            if (!usageSummary.get(customerId).has(monthYear)) {
                usageSummary.get(customerId).set(monthYear, 0);
            }

            usageSummary.get(customerId).set(monthYear, usageSummary.get(customerId).get(monthYear) + totalCharges);

            if (!discountSummary.has(customerId)) {
                discountSummary.set(customerId, new Map());
            }

            if (!discountSummary.get(customerId).has(monthYear)) {
                discountSummary.get(customerId).set(monthYear, 0);
            }

            if (!discountSummary.get(customerId).get(monthYear) && this.getItemCountByGenre(customerId, monthYear, genre) >= 3) {
                discountSummary.get(customerId).set(monthYear, totalCharges * 0.25);
            }
        }

        let result = "Customer ID,Month,Total Charges,Discount\n";
        for (const [customerId, monthlyUsage] of usageSummary.entries()) {
            for (const [month, totalCharges] of monthlyUsage.entries()) {
                const discount = discountSummary.get(customerId).get(month) || 0;
                result += `${customerId},${month},${totalCharges},${discount}\n`;
            }
        }
        return result;
    }

    createSummaryReport() {
        const incomeSummary = new Map();
        const itemSummary = new Map();
        const discountSummary = new Map();

        for (const record of this.vodRecords) {
            const [a1, orderDate, a2, a3, price] = record.split(',');
            let orderDateSplit = orderDate.split('-');
            let month;
            if (!isNaN(orderDateSplit[1])) {
                month = parseInt(orderDateSplit[1]);
            } else {
                month = monthMap[orderDateSplit[1].toUpperCase()];
            }
            const monthYear = `${month}-${orderDateSplit[0]}`;
            const totalIncome = parseFloat(price);

            if (!incomeSummary.has(monthYear)) {
                incomeSummary.set(monthYear, 0);
                itemSummary.set(monthYear, 0);
                discountSummary.set(monthYear, 0);
            }

            incomeSummary.set(monthYear, incomeSummary.get(monthYear) + totalIncome);
            itemSummary.set(monthYear, itemSummary.get(monthYear) + 1);

            const discount = parseFloat(a3);
            discountSummary.set(monthYear, discountSummary.get(monthYear) + discount);
        }

        let result = "Month,Total Income,Total Items Ordered,Total Discounts\n";
        for (const [month, totalIncome] of incomeSummary.entries()) {
            const totalItemsOrdered = itemSummary.get(month);
            const totalDiscounts = discountSummary.get(month);
            result += `${month},${totalIncome},${totalItemsOrdered},${totalDiscounts}\n`;
        }
        return result;
    }

    getItemCountByGenre(customerId, monthYear, genre) {
        let count = 0;
        for (const record of this.vodRecords) {
            const [recordCustomerId, orderDate, recordGenre, a2, a3] = record.split(',');
            let orderDateSplit = orderDate.split('-');
            let month;
            if (!isNaN(orderDateSplit[1])) {
                month = parseInt(orderDateSplit[1]);
            } else {
                month = monthMap[orderDateSplit[1].toUpperCase()];
            }
            const recordMonthYear = `${month}-${orderDateSplit[0]}`;
    
            if (customerId === recordCustomerId && monthYear === recordMonthYear && genre === recordGenre) {
                count++;
            }
        }
        return count;
    }
    
    calculateTotalDiscountsByMonth() {
        const discountSummary = new Map();

        for (const record of this.vodRecords) {
            const [a1, orderDate, a2, discount] = record.split(',');
            let orderDateSplit = orderDate.split('-');
            let month;
            if (!isNaN(orderDateSplit[1])) {
                month = parseInt(orderDateSplit[1]);
            } else {
                month = monthMap[orderDateSplit[1].toUpperCase()];
            }
            const monthYear = `${month}-${orderDateSplit[0]}`;
            const discountAmount = parseFloat(discount);

            if (!discountSummary.has(monthYear)) {
                discountSummary.set(monthYear, 0);
            }

            discountSummary.set(monthYear, discountSummary.get(monthYear) + discountAmount);
        }

        return discountSummary;
    }
}
