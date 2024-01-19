// Discount Rules:
// "flat_10_discount": If cart total exceeds $200, apply a flat $10 discount on the cart total.
// "bulk_5_discount": If the quantity of any single product exceeds 10 units, apply a 5% discount on that item's total price.
// "bulk_10_discount": If total quantity exceeds 20 units, apply a 10% discount on the cart total.
// "tiered_50_discount": If total quantity exceeds 30 units & any single product quantity greater than 15, then apply a 50% discount on products which are above  15 quantity. The first 15 quantities have the original price and units above 15 will get a 50% discount.

const prompt = require("prompt-sync")();

const shoppingData=[
    {
        id:1,
        prod_name:"Product A",
        prod_price:20,
        prod_qnty:1,
        gift_pack:false,
    },
    {
        id:2,
        prod_name:"Product B",
        prod_price:50,
        prod_qnty:25,
    },
    {
        id:3,
        prod_name:"Product C",
        prod_price:30,
        prod_qnty:1,
    },
]


const applyDiscount=(total_amount,shoppingData,total_quantity)=>{
    const discountRule={
        "flat_10_discount":0,
        "bulk_5_discount":0,
        "bulk_10_discount":0,
        "tiered_50_discount":0,
    }
    var total=0
    // Flat_10_discount
    if(total_amount>200){
        total=total_amount-10
        discountRule["flat_10_discount"]=total
    }

    // Bulk_5_discount
    shoppingData.forEach((item)=>{
        
        let total_amount_of_item=(item.prod_price*item.prod_qnty)
        let discount_amount_item=0
        if(item.prod_qnty>10 && item.prod_qnty<=20){
            discount_amount_item=total_amount_of_item*0.05
            total=total_amount-discount_amount_item
            discountRule["bulk_5_discount"]=total
        }
    })

    // Bulk_10_discount
    if (total_quantity>20 && total_quantity<=30){
        let discount_amount=total_amount*0.1
        total=total_amount-discount_amount
        discountRule["bulk_10_discount"]=total

    }

    // Tiered_50_discount
    if(total_quantity>30 && shoppingData.find((itme)=>itme.prod_qnty>15)){
        total=total_amount;
        let item=shoppingData.filter((item)=>item.prod_qnty>15)

        // console.log(item);
        item.forEach((it)=>{
            let exceed_products=it.prod_qnty-15
            let exceed_products_total_price=(exceed_products*it.prod_price)
            let discount_amount=exceed_products_total_price*0.5
            total=total-discount_amount
            discountRule["tiered_50_discount"]=total
        })
    }

    return discountRule

}
const shopping_bill=(shoppingData)=>{
    let total_amount=0
    let total_quantity=0
    let gift_pack_charge=0
    let shipping_charge=0
    shoppingData.forEach((item) => {
        let item_total=item.prod_price*item.prod_qnty
        total_amount+=item_total;
        total_quantity+=item.prod_qnty
    });
    


    const discountObj=applyDiscount(total_amount,shoppingData,total_quantity)
    console.log(discountObj)
    const discount_values=Object.values(discountObj);
    console.log(discount_values);
    const filteredValues=discount_values.filter(val=>val!==0)
    console.log(filteredValues);
    const discountAmount=filteredValues.length !==0 ? Math.min(...filteredValues):0;
    let discount_keys;
    let ActualDiscount;
    if (discountAmount !== 0){
        
        discount_keys=Object.keys(discountObj).find((dis)=>discountObj[dis]===discountAmount);
        ActualDiscount=total_amount-discountAmount
    }
    else{
        discount_keys="No Discount"
        ActualDiscount=0
    }
   

    shoppingData.forEach(item=>{
        if(item.gift_pack){
            gift_pack_charge=item.prod_qnty*1
        }
    })

    shipping_charge=Math.ceil(total_quantity/10)*5

    console.log("\nProduct details:");
    shoppingData.forEach(product=>{
        const totalAmount = product.prod_price * product.prod_qnty;
        console.log(`Product Name : ${product.prod_name} `)
        console.log(`Product Price : ${product.prod_price} `)
        console.log(`Product Quantity : ${product.prod_qnty} `)
        console.log(`total cost: ${totalAmount} `)
    })

    console.log("\nSubtotal: $", total_amount);
    console.log(`Discount applied: ${discount_keys}, Discount Amount -- ${ActualDiscount}`);
    console.log("Shipping fee: $", shipping_charge);
    console.log("Gift wrap fee: $", gift_pack_charge);
    console.log("Total: $", (total_amount-ActualDiscount)+shipping_charge+gift_pack_charge  );
}


const cart=()=>{
    const cataloge=[
        {
            prod_name:"Product A",
            prod_price:20,
        },
        {
            prod_name:"Product B",
            prod_price:40,
        },
        {
            prod_name:"Product C",
            prod_price:50,
        },
        
    ]


    cataloge.forEach((product)=>{
        const prod_qnty = parseInt(prompt(`Enter the quantity of ${product.prod_name}: `));
        const gift_pack = prompt(`Is ${product.prod_name} wrapped as a gift? (yes/no): `).toLowerCase() === "yes";
        product.prod_qnty=prod_qnty;
        product.gift_pack=gift_pack;
    })
    shopping_bill(cataloge);
}

cart();