const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const Customer = require("./customer")(sequelize, DataTypes);
const Agent = require("./agent")(sequelize, DataTypes);
const Ticket = require("./ticket")(sequelize, DataTypes);
const TicketCustomer = require("./ticketCustomer")(sequelize, DataTypes);
const TicketAgent = require("./ticketAgent")(sequelize, DataTypes);

// Associations
Ticket.belongsToMany(Customer, {
  through: TicketCustomer,
  foreignKey: "ticketId",
  otherKey: "customerId",
});
Customer.belongsToMany(Ticket, {
  through: TicketCustomer,
  foreignKey: "customerId",
  otherKey: "ticketId",
});

Ticket.belongsToMany(Agent, {
  through: TicketAgent,
  foreignKey: "ticketId",
  otherKey: "agentId",
});
Agent.belongsToMany(Ticket, {
  through: TicketAgent,
  foreignKey: "agentId",
  otherKey: "ticketId",
});

module.exports = {
  sequelize,
  Customer,
  Agent,
  Ticket,
  TicketCustomer,
  TicketAgent,
};
