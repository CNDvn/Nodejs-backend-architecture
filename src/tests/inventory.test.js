const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channel, message) => {
      InventoryServiceTest.updateInventory(JSON.parse(message));
    });
  }

  static updateInventory({ productId, quantity }) {
    console.log(`Updating inventory for product ${productId} by ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
