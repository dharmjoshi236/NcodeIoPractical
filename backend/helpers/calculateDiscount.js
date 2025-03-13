const calculateDiscountAndTotalAmountFromItems = (discountPercentage, taxPercentage, items)=> {
let totalAmount = 0;
    for (let item of items) {
        totalAmount += (item.itemQuantity * item.unitPrice)
    }

let subTotalAmount = parseFloat(totalAmount);

let discountedPrice = parseFloat(totalAmount * discountPercentage) / 100;

let finalPriceWithoutTax = parseFloat(totalAmount) - parseFloat(discountedPrice);

let taxedPrice = parseFloat(finalPriceWithoutTax * taxPercentage) / 100;

let finalPriceWithTax = parseFloat(finalPriceWithoutTax) + taxedPrice;

return {
    discountAmount: discountedPrice,
    taxAmount: taxedPrice,
    totalAmount: finalPriceWithTax,
    subTotalAmount: subTotalAmount,
}
}

module.exports = {
    calculateDiscountAndTotalAmountFromItems
}