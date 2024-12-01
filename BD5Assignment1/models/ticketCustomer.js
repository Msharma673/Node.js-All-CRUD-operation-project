module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TicketCustomer", {
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tickets",
        key: "id",
      },
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id",
      },
      primaryKey: true,
    },
  });
};
