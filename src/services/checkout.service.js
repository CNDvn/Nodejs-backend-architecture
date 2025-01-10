"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check cartId ton tai hay khong?
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exist");

    const checkout_order = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];

    //tinh tong tien bill
    for (const {
      item_products = [],
      shop_discounts = [],
      shopId,
    } of shop_order_ids) {
      //check product available
      const checkProductServer = await checkProductByServer(item_products);
      console.log(`checkProductServer::`, checkProductServer);

      //tong tien don hang
      if (!checkProductServer[0]) throw new BadRequestError("order wrong");
      const checkoutPrice = checkProductServer.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);

      //tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, //tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDisCountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductByServer,
          });

        //tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check lai mot lan nua xem vuot ton kho hay khong
    // get new array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]:`, products);
    const acquireProduct = [];
    for (const product of products) {
      const { productId, quantity } = product;
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(!!keyLock);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check if co 1 san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat, vui long kiem tra lai gio hang"
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    //truong hop: neu insert thanh cong, thi remove product trong cart
    if (newOrder) {
      //remove product trong cart
    }

    return newOrder;
  }

  /**
   * 1, query orders [user]
   */
  static async getOrderByUser({ userId }) {
    return await order.find({ order_userId: userId });
  }

  /**
   * 1, query orders using id [user]
   */
  static async getOneOrderByUser({ userId }) {
    //
  }

  /**
   * 1, cancel orders [user]
   */
  static async cancelOrder({ userId }) {
    //
  }

  /**
   * 1, update orders status [Shop | Admin]
   */
  static async updateOrderStatusByShop({ userId }) {
    //
  }
}

module.exports = CheckoutService;
