import math

def apply_discounts(cart_total, quantities,product_prices):
    flat_10_discount = 10 if cart_total > 200 else 0
    bulk_5_discount = 0.05
    bulk_10_discount = 0.1
    tiered_50_discount = 0.5

    discounts = {
        "no_discount":0,
        "flat_10_discount": 0,
        "bulk_5_discount": 0,
        "bulk_10_discount": 0,
        "tiered_50_discount": 0,
    }
    

    curr_discount=0

    # Flat_10_discount
    discounts["flat_10_discount"]=flat_10_discount

    total_price_eace_product={}
    for quantity in quantities.keys():
        total_price_eace_product[quantity]=(product_prices[quantity] * quantities[quantity])


    # Bulk_5_discount
    for quantity in quantities.keys():
        if quantities[quantity] > 10:
            # bulk_5_discount = max(bulk_5_discount, 0.05)
            curr_discount+=(total_price_eace_product[quantity])* bulk_5_discount
            discounts["bulk_5_discount"]=curr_discount

    # curr_total=sum(total_price_eace_product.values())


    # Bulk_10_discount
    total_quantity=sum(quantities.values())
    curr_discount=0
    if total_quantity>20 and total_quantity<=30:
        curr_discount=cart_total*bulk_10_discount
        discounts["bulk_10_discount"]=curr_discount


    #Tiered_50_discount
    if total_quantity > 30:
        for product, quantity in quantities.items():
            if quantity > 15:
                total_price_eace_product[product]=(((quantity - 15) * product_prices[product]) *tiered_50_discount)+(15*product_prices[product])
        curr_total=sum(total_price_eace_product.values())
        discounts["tiered_50_discount"]=cart_total-curr_total

    # print(discounts)
    max_discount_rule = max(discounts, key=discounts.get)
    discount_amount = discounts[max_discount_rule]

    return max_discount_rule, discount_amount


def calculate_total_amount(product_prices, quantities, gift_pack_product):
    subtotal = sum(product_prices[product] * quantity for product, quantity in quantities.items())
    # print(subtotal)


    cart_total = subtotal
    discount_rule, discount_amount = apply_discounts(cart_total, quantities, product_prices)
    print(discount_rule,discount_amount)
    cart_total -= discount_amount

    shipping_fee = math.ceil((sum(quantities.values()) / 10) )* 5
    gift_wrap_fee = 1
    total_gift_charge=0
    for quantity in quantities.keys():
        if(gift_pack_product[quantity]):
            total_gift_charge+=quantities[quantity]*gift_wrap_fee

    total = cart_total + shipping_fee + total_gift_charge

    return subtotal, discount_rule, discount_amount, shipping_fee, total_gift_charge, total


if __name__ == "__main__":
    product_prices = {"Product A": 20, "Product B": 40, "Product C": 50}
    quantities = {}
    gift_pack_product={}

    for product in product_prices:
        quantity = int(input(f"Enter the quantity of {product}: "))
        gift_wrap = input(f"Is {product} wrapped as a gift? (yes/no): ").lower() == "yes"
        quantities[product] = quantity
        gift_pack_product[product]=gift_wrap


    subtotal, discount_rule, discount_amount, shipping_fee, gift_wrap_fee, total = calculate_total_amount(
        product_prices, quantities, gift_pack_product
    )

    # Output details
    print("\nProduct details:")
    for product, quantity in quantities.items():
        total_amount = product_prices[product] * quantity
        print(f"{product}: {quantity} units - ${total_amount}")

    print("\nSubtotal: $", subtotal)
    print("Discount applied:", discount_rule, "- $", discount_amount)
    print("Shipping fee: $", shipping_fee)
    print("Gift wrap fee: $", gift_wrap_fee)
    print("Total: $", total)
