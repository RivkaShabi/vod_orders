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
        }

        let result = "Customer ID,Month,Total Charges\n";
        for (const [customerId, monthlyUsage] of usageSummary.entries()) {
            for (const [month, totalCharges] of monthlyUsage.entries()) {
                result += `${customerId},${month},${totalCharges}\n`;
            }
        }
        return result;
    }

    createSummaryReport() {
        const incomeSummary = new Map();
        const itemSummary = new Map();

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
            }

            incomeSummary.set(monthYear, incomeSummary.get(monthYear) + totalIncome);
            itemSummary.set(monthYear, itemSummary.get(monthYear) + 1);
        }

        let result = "Month,Total Income,Total Items Ordered\n";
        for (const [month, totalIncome] of incomeSummary.entries()) {
            const totalItemsOrdered = itemSummary.get(month);
            result += `${month},${totalIncome},${totalItemsOrdered}\n`;
        }
        return result;
    }
}
